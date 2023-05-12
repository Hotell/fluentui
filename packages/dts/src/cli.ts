// import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';
import * as yargs from 'yargs';
import { runTests } from './run-tests';
import { Config, processConfig } from './config';
import { installAllTypeScriptVersions } from './typescript-installer';
import { createLogger, Logger } from './logger';

export async function cli() {
  // init
  const args = processArgs();
  const config = await processConfig();

  const useConfig = { ...config, ...args } as Config;

  const logger = createLogger(useConfig.verbose ? 'verbose' : 'silent');

  // setup TS
  await installTypeScript(logger);

  // run tests
  await runTests({ dtsDirPath: path.join(process.cwd(), 'dist'), ...useConfig, logger });

  return;
}

async function installTypeScript(logger: Logger) {
  await installAllTypeScriptVersions(logger);
}

function processArgs() {
  const argv = yargs
    .option('tsMinVersion', { type: 'string' })
    .option('tsMaxVersion', { type: 'string' })
    .option('warnOnly', { type: 'boolean' })
    .option('verbose', { type: 'boolean' })
    .version('0.0.1').argv;

  return argv;
}
