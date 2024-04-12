import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

import { BabelFileResult, transformAsync } from '@babel/core';
import * as glob from 'glob';
import { logger } from 'just-scripts';

const EOL_REGEX = /\r?\n/g;

function addSourceMappingUrl(code: string, loc: string): string {
  // Babel keeps stripping this comment, even when correct option is set. Adding manually.
  return code + '\n//# sourceMappingURL=' + path.basename(loc);
}

export function hasBabel() {
  return fs.existsSync(path.join(process.cwd(), '.babelrc.json'));
}

export async function babel() {
  const root = process.cwd();
  const files = glob.sync('lib/**/*.styles.js');

  performance.mark('babel-loop:start');

  for (const filename of files) {
    performance.mark('loop:start');

    const filePath = path.resolve(root, filename);

    performance.mark('babel-read-filepath:start');
    const codeBuffer = await fs.promises.readFile(filePath);
    const sourceCode = codeBuffer.toString().replace(EOL_REGEX, '\n');
    performance.mark('babel-read-filepath:end');

    performance.mark('babel-transform:start');
    const result = (await transformAsync(sourceCode, {
      ast: false,
      sourceMaps: true,

      babelrc: true,
      // to avoid leaking of global configs
      babelrcRoots: [root],

      caller: { name: 'just-scripts' },
      filename: filePath,

      sourceFileName: path.basename(filename),
    })) /* Bad `transformAsync` types. it can be null only if 2nd param is null(config)*/ as NonNullableRecord<BabelFileResult>;
    performance.mark('babel-transform:end');

    performance.mark('babel-write-file:start');
    const resultCode = addSourceMappingUrl(result.code, path.basename(filename) + '.map');

    if (resultCode === sourceCode) {
      logger.verbose(`babel: skipped ${filePath}`);
      continue;
    } else {
      logger.verbose(`babel: transformed ${filePath}`);
    }

    const sourceMapFile = filePath + '.map';

    await fs.promises.writeFile(filePath, resultCode);
    await fs.promises.writeFile(sourceMapFile, JSON.stringify(result.map));
    performance.mark('babel-write-file:end');
    performance.mark('loop:end');

    console.log(`transform:${filename}:`);
    console.log(performance.measure('babel-transform', 'babel-transform:start', 'babel-transform:end'));
    // console.log(performance.measure('loop', 'loop:start', 'loop:end'));
  }

  performance.mark('babel-loop:end');

  console.log(performance.measure('babel-loop', 'babel-loop:start', 'babel-loop:end'));

  // console.log(performance.measure('babel-read-filepath', 'babel-read-filepath:start', 'babel-read-filepath:end'));

  // console.log(performance.measure('babel-write-file', 'babel-write-file:start', 'babel-write-file:end'));
}

type NonNullableRecord<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
