import { performance } from 'perf_hooks';
import { execSync } from 'child_process';
import { OutputOptions, rollup, RollupOptions } from 'rollup';
import { dts } from 'rollup-plugin-dts';

import { series } from 'just-scripts';
import path from 'path';

import { apiExtractor } from './api-extractor';
import { getTsPathAliasesConfigUsedOnlyForDx } from './utils';
import { offsetFromRoot, workspaceRoot } from '@nx/devkit';

export function generateApi() {
  return series(generateTypeDeclarations, apiExtractor);
}
export function generateApiV2() {
  const result = execSync('tsup', { stdio: 'inherit' });
  return result;
}
export function generateApiV3() {
  return series(generateTypeDeclarations, generateApiViaRollup);
}

function generateTypeDeclarations() {
  performance.mark('generateTypeDeclarations:start');
  const { tsConfigFileForCompilation } = getTsPathAliasesConfigUsedOnlyForDx();
  const cmd = [
    'tsc',
    `-p ./${tsConfigFileForCompilation}`,
    '--emitDeclarationOnly',
    // turn off path aliases.
    '--baseUrl .',
  ].join(' ');

  const result = execSync(cmd, { stdio: 'inherit' });

  performance.mark('generateTypeDeclarations:end');
  console.log(
    performance.measure('generateTypeDeclarations', 'generateTypeDeclarations:start', 'generateTypeDeclarations:end'),
  );

  return result;
}

async function rollupDts(config: RollupOptions) {
  // create a bundle
  const bundle = await rollup(config);

  // generate code and a sourcemap
  // const { output } = await bundle.generate(config.output as OutputOptions);

  // or write the bundle to disk

  await bundle.write(config.output as OutputOptions);
}

async function generateApiViaRollup() {
  performance.mark('generateApiViaRollup:start');
  const root = process.cwd();
  const relativeRoot = root.replace(workspaceRoot, '');
  const offset = offsetFromRoot(relativeRoot);
  const input = `${offset}dist/out-tsc/types${relativeRoot}/src/index.d.ts`;

  const rollupConfig: RollupOptions = {
    input, // path to your main TypeScript file
    // input: '../../../../dist/out-tsc/types/packages/react-components/react-combobox/library/src/index.d.ts', // path to your main TypeScript file
    output: {
      file: './dist/index-rollup.d.ts', // path where the output .d.ts file will be created
      format: 'es',
    },
    plugins: [dts()],
  };
  const result = await rollupDts(rollupConfig);

  performance.mark('generateApiViaRollup:end');

  console.log(performance.measure('generateApiViaRollup', 'generateApiViaRollup:start', 'generateApiViaRollup:end'));

  return result;
}
