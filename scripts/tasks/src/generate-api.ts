import { performance } from 'perf_hooks';
import { execSync } from 'child_process';

import { series } from 'just-scripts';

import { apiExtractor } from './api-extractor';
import { getTsPathAliasesConfigUsedOnlyForDx } from './utils';

export function generateApi() {
  return series(generateTypeDeclarations, apiExtractor);
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
