// import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';
import { runTests } from './run-tests';
import { processConfig } from './config';
import { installAllTypeScriptVersions } from './typescript-installer';

export async function cli() {
  // init
  const args = processArgs();
  const config = await processConfig();

  // setup TS
  await installTypeScript();

  // run tests
  await runTests({ dtsDirPath: path.join(process.cwd(), 'dist'), ...config });

  return;
}

async function installTypeScript() {
  await installAllTypeScriptVersions();
}

function processArgs() {
  return {};
}
