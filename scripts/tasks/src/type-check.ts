import * as fs from 'fs';

import { logger } from 'just-scripts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { exec } from 'just-scripts-utils';

import { TsConfig, getTsPathAliasesConfig } from './utils';

export function typeCheck() {
  performance.mark('typeCheck:start');
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
      // restore original tsconfig.json
      fs.writeFileSync(configPath, content, 'utf-8');
      process.exit(1);
    })
    .finally(() => {
      // restore original tsconfig.json
      fs.writeFileSync(configPath, content, 'utf-8');
      performance.mark('typeCheck:end');

      console.log(performance.measure('typeCheck', 'typeCheck:start', 'typeCheck:end'));
    });
}

function getTsConfigs(solutionConfig: TsConfig, avoid: { spec: boolean; e2e: boolean }) {
  const refs = solutionConfig.references ?? [];
  return refs
    .map(ref => {
      if (avoid.spec && ref.path.includes('spec')) {
        return;
      }
      if (avoid.e2e && ref.path.includes('cy')) {
        return;
      }
      if (ref.path.includes('tsconfig.lib.json')) {
        console.log('skipping tsconfig.lib.json type-check which happened within generate-api task...');
        return;
      }

      return ref.path;
    })
    .filter(Boolean);
}
export async function typeCheckV2() {
  performance.mark('typeCheck2:start');
  const { isUsingTsSolutionConfigs, tsConfigs } = getTsPathAliasesConfig();

  if (!isUsingTsSolutionConfigs) {
    logger.info('project is not using TS solution config. skipping...');
    return;
  }

  const config = tsConfigs.root;

  if (!config) {
    return;
  }

  const tsConfigsRefs = getTsConfigs(config, { spec: false, e2e: false });

  const asyncQueue = [];

  for (const ref of tsConfigsRefs) {
    const program = `tsc -p ${ref} --pretty --baseUrl .`;
    asyncQueue.push(exec(program));
  }

  return Promise.all(asyncQueue)
    .catch(err => {
      performance.mark('typeCheck2:end');
      console.log(performance.measure('typeCheck2', 'typeCheck2:start', 'typeCheck2:end'));
      process.exit(1);
    })
    .finally(() => {
      performance.mark('typeCheck2:end');
      console.log(performance.measure('typeCheck2', 'typeCheck2:start', 'typeCheck2:end'));
    });

  // return exec(program)
  //   .catch(err => {
  //     console.error(err.stdout);
  //     // restore original tsconfig.json
  //     fs.writeFileSync(configPath, content, 'utf-8');
  //     process.exit(1);
  //   })
  //   .finally(() => {
  //     // restore original tsconfig.json
  //     fs.writeFileSync(configPath, content, 'utf-8');
  //     performance.mark('typeCheck2:end');

  //     console.log(performance.measure('typeCheck', 'typeCheck:start', 'typeCheck:end'));
  //   });
}
