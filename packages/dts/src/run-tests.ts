import * as fs from 'fs/promises';
import * as path from 'path';

import { latest, lowest, shipped, supported, TypeScriptVersion } from './typescript-versions';
import { getTypeScriptPath } from './typescript-installer';
import { checkTsconfig } from './checks';
import { getCompilerOptions } from './utils';
import { getProgram } from './typescript-program';
import { Config } from './config';
import assert = require('node:assert');

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

export async function runTests(options: { dtsDirPath: string } & Config) {
  const { dtsDirPath, tsMinVersion, tsMaxVersion } = options;
  // get d.ts from package - defined via types,exports.types
  // const dtsContents = await fs.readFile(path.join(dtsDirPath, 'index.d.ts'), 'utf-8');

  const minVersion = getMaxVersion(tsMinVersion, lowest);
  const maxVersion = getMinVersion(tsMaxVersion, latest);

  const compilerOptions = await getCompilerOptions(dtsDirPath);
  checkTsconfig(compilerOptions);

  console.log(`checking from TS v${minVersion} to v${maxVersion}`);
  const tsCheckVersions = shipped.slice(supported.indexOf(minVersion), supported.indexOf(maxVersion));
  for (const tsVersion of tsCheckVersions) {
    const versionPath = getTypeScriptPath(tsVersion, undefined);
    await testTypesVersion({ versionPath, dtsDirPath, tsVersion });
    // await testTypesVersion(versionPath, low, hi, isOlderVersion, dt, expectOnly, undefined, isLatest);
  }
}

async function testTypesVersion(options: { versionPath: string; dtsDirPath: string; tsVersion: string }) {
  const { versionPath, dtsDirPath, tsVersion } = options;
  console.info(`Checking ${dtsDirPath} -> against TS@${tsVersion}`);

  const tsconfigPath = path.join(dtsDirPath, 'tsconfig.json');

  type ScopedTS = typeof import('typescript');
  const ts: ScopedTS = await import(versionPath);

  //  const ts: typeof TsType = require(typeScriptPath(version, tsLocal));
  // const lintProgram = ts.createProgram({ options: compilerOptions });
  const program = getProgram(
    tsconfigPath,
    ts,
    tsVersion,
    /* , lintProgram */
  );
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (!diagnostics.length) {
    return undefined;
  }
  const showDiags = ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: (filename: string) => filename,
    getCurrentDirectory: () => dtsDirPath,
    getNewLine: () => '\n',
  });
  const message = `Errors in typescript@${tsVersion} for external dependencies:\n${showDiags}`;

  console.error(message);
}
