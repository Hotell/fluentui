import yargs from 'yargs';
import { ReactVersionTester, TestType, ReactVersion, FluentVersion } from './react-version-tester';

export async function run(): Promise<void> {
  const argv = await yargs(process.argv.slice(2))
    .scriptName('react-version-tester')
    .usage('$0 [options]')
    .version('1.0.0')
    .option('baseline', {
      type: 'string',
      describe: 'React version baseline',
      choices: ['17', '18', '19'] as const,
      demandOption: true,
    })
    .option('test-type', {
      type: 'string',
      describe: 'Type of test to run',
      choices: ['e2e', 'unit', 'type-check'] as const,
      demandOption: true,
    })
    .option('fluent-version', {
      type: 'string',
      describe: 'Fluent UI version',
      choices: ['v8', 'v9'] as const,
      default: 'v9',
    })
    .option('dry-run', {
      type: 'boolean',
      describe: 'Show what would be executed without running tests',
      default: false,
    })
    .option('verbose', {
      type: 'boolean',
      describe: 'Enable verbose output',
      default: false,
    })
    .option('keep-temp', {
      type: 'boolean',
      describe: 'Keep temporary files after test completion (useful for debugging)',
      default: false,
    })
    .example('$0 --baseline 18 --test-type type-check', 'Run type-checking tests for React 18 with Fluent UI v9')
    .example('$0 --baseline 17 --test-type unit --fluent-version v8', 'Run unit tests for React 17 with Fluent UI v8')
    .example('$0 --baseline 19 --test-type e2e --dry-run', 'Show what would be executed for React 19 e2e tests')
    .example('$0 --baseline 18 --test-type type-check --keep-temp', 'Run tests and keep temporary files for debugging')
    .help()
    .alias('help', 'h')
    .alias('version', 'v')
    .strict().argv;

  // Validate arguments
  if (!['17', '18', '19'].includes(argv.baseline as string)) {
    throw new Error(`Invalid React version: ${argv.baseline}. Must be 17, 18, or 19.`);
  }
  if (!['e2e', 'unit', 'type-check'].includes(argv['test-type'] as string)) {
    throw new Error(`Invalid test type: ${argv['test-type']}. Must be e2e, unit, or type-check.`);
  }
  if (!['v8', 'v9'].includes(argv['fluent-version'] as string)) {
    throw new Error(`Invalid Fluent version: ${argv['fluent-version']}. Must be v8 or v9.`);
  }

  const tester = new ReactVersionTester({
    reactVersion: argv.baseline as ReactVersion,
    fluentVersion: argv['fluent-version'] as FluentVersion,
    testType: argv['test-type'] as TestType,
    dryRun: argv['dry-run'] as boolean,
    verbose: argv.verbose as boolean,
    keepTemp: argv['keep-temp'] as boolean,
  });

  try {
    await tester.run();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
