import * as fs from 'fs';

import { logger } from 'just-scripts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { exec } from 'just-scripts-utils';

import { getTsPathAliasesConfig } from './utils';

export function typeCheck() {
  performance.mark('type-check-v1:start');

  const { isUsingTsSolutionConfigs, tsConfigFileContents, tsConfigs, tsConfigFilePaths } = getTsPathAliasesConfig();

  if (!isUsingTsSolutionConfigs) {
    logger.info('project is not using TS solution config. skipping...');
    return;
  }

  const content = tsConfigFileContents.root;
  const config = tsConfigs.root;
  const configPath = tsConfigFilePaths.root;

  if (!(content && config)) {
    return;
  }

  // turn off path aliases.
  // @ts-expect-error - bad just-scripts ts types
  config.compilerOptions.paths = {};
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

  const cmd = 'tsc';
  const args = ['-b', '--pretty', configPath];
  const program = `${cmd} ${args.join(' ')}`;

  return exec(program)
    .catch(err => {
      console.error(err.stdout);
      process.exit(1);
    })
    .finally(() => {
      // restore original tsconfig.json
      fs.writeFileSync(configPath, content, 'utf-8');
      performance.mark('type-check-v1:end');

      performance.measure('type-check-v1', 'type-check-v1:start', 'type-check-v1:end');

      performance
        .getEntriesByName('type-check-v1')
        .forEach(entry => console.log(`duration: ${entry.duration / 1000} s`));
    });
}
