import * as fs from 'fs/promises';
import * as path from 'path';
import assert = require('node:assert');

import { latest, lowest, shipped, supported, TypeScriptVersion } from './typescript-versions';
import { getTypeScriptPath } from './typescript-installer';
import { createProgramFromConfig, getProgram } from './typescript-program';
import { checkTsconfig } from './checks';
import { getCompilerOptions } from './utils';
import { ProcessedConfig } from './config';
import { Logger } from './logger';

function getMaxVersion(v1: TypeScriptVersion, v2: TypeScriptVersion): TypeScriptVersion {
  assert(supported.indexOf(v1) !== -1);
  assert(supported.indexOf(v2) !== -1);

  if (parseFloat(v1) >= parseFloat(v2)) {
    return v1;
  }
  return v2;
}
function getMinVersion(v1: TypeScriptVersion, v2: TypeScriptVersion): TypeScriptVersion {
  assert(supported.indexOf(v1) !== -1);
  assert(supported.indexOf(v2) !== -1);

  if (parseFloat(v1) <= parseFloat(v2)) {
    return v1;
  }
  return v2;
}

function getNextVersion(version: (typeof supported)[number]): string {
  const index = supported.indexOf(version);
  assert.notStrictEqual(index, -1);
  assert(index < supported.length);
  return supported[index + 1];
}

export async function runTests(options: { dtsDirPath: string; logger: Logger } & ProcessedConfig) {
  const { logger, dtsDirPath, tsMinVersion, tsMaxVersion, tsConfig, warnOnly, projectRoot } = options;
  // get d.ts from package - defined via types,exports.types
  // const dtsContents = await fs.readFile(path.join(dtsDirPath, 'index.d.ts'), 'utf-8');

  const minVersion = getMaxVersion(tsMinVersion, lowest);
  const maxVersion = getMinVersion(tsMaxVersion, latest);

  // const compilerOptions = await getCompilerOptions(dtsDirPath);
  const compilerOptions = tsConfig.compilerOptions;
  checkTsconfig(compilerOptions);

  logger.info(`🧪 Checking declaration files against TS versions - from v${minVersion} to v${maxVersion}\n`);
  const tsCheckVersions = shipped.slice(supported.indexOf(minVersion), supported.indexOf(maxVersion) + 1);

  const tsVersionViolations: boolean[] = [];
  for (const tsVersion of tsCheckVersions) {
    const versionPath = getTypeScriptPath(tsVersion, undefined);
    tsVersionViolations.push(
      await testTypesVersion({ versionPath, dtsDirPath, tsVersion, tsConfig, logger, projectRoot }),
    );
  }

  if (tsVersionViolations.some(Boolean) && !warnOnly) {
    process.exit(1);
  }
}

async function testTypesVersion(options: {
  versionPath: string;
  dtsDirPath: string;
  projectRoot: string;
  tsVersion: string;
  tsConfig: ProcessedConfig['tsConfig'];
  logger: Logger;
}) {
  const { versionPath, dtsDirPath, projectRoot, tsVersion, tsConfig, logger } = options;
  const projectDirectory = path.join(projectRoot, dtsDirPath);
  const declarationFiles = await fs.readdir(projectDirectory);

  logger.info(`Checking declarations in ${projectDirectory} against TS@${tsVersion}`);
  declarationFiles.forEach(fileName => {
    logger.info(`- ${fileName}`);
  });

  // const tsconfigPath = path.join(dtsDirPath, 'tsconfig.json');

  type ScopedTS = typeof import('typescript');
  const ts: ScopedTS = await import(versionPath);

  //  const ts: typeof TsType = require(typeScriptPath(version, tsLocal));
  // const lintProgram = ts.createProgram({ options: compilerOptions });
  // const program = getProgram(
  //   tsconfigPath,
  //   ts,
  //   tsVersion,
  //   /* , lintProgram */
  // );
  const program = createProgramFromConfig(tsConfig, projectDirectory, ts);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (!diagnostics.length) {
    logger.success('All good');
    return false;
  }

  const showDiags = ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: (filename: string) => filename,
    getCurrentDirectory: () => projectDirectory,
    getNewLine: () => '\n',
  });
  const message = `Errors found:\n${showDiags}`;

  logger.error(message);

  return true;
}
