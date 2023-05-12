import * as yargs from 'yargs';
import { runTests } from './run-tests';
import { processConfig, ProcessedConfig } from './config';
import { installAllTypeScriptVersions } from './typescript-installer';
import { createLogger, Logger } from './logger';

export async function cli() {
  // init
  const { config: configPath, ...args } = processArgs();
  const config = await processConfig({ configPath });
  const useConfig = { ...config, ...args } as ProcessedConfig;
  const logger = createLogger(useConfig.verbose ? 'verbose' : 'silent');

  // setup TS
  await installTypeScript(logger);

  // run tests
  await runTests({ ...useConfig, logger });
  // await runTests({ dtsDirPath: path.join(process.cwd(), 'dist'), ...useConfig, logger });

  return;
}

async function installTypeScript(logger: Logger) {
  await installAllTypeScriptVersions(logger);
}

function processArgs() {
  const argv = yargs
    .usage('🧪 dts 🤖 / CLI tool to check your type declaration against range of various TypeScript versions')
    .option('tsMinVersion', { type: 'string', description: 'lowest TypeScript version to test against' })
    .option('tsMaxVersion', { type: 'string', description: 'highest TypeScript version to test against' })
    .option('warnOnly', {
      type: 'boolean',
      description: `don't fail the program if there is at least 1 issue with particular TypeScript`,
    })
    .option('verbose', { type: 'boolean', description: 'print all program logs' })
    .option('dtsDirPath', {
      type: 'string',
      description: 'relative path to your project folder where `.d.ts` files are being generated. Usually "./dist"',
    })
    .option('config', {
      type: 'string',
      description: 'specify config path for dts. defaults to <projectRoot>/dts.config.json',
    })
    .version('0.0.1').argv;

  return argv;
}
