import type { CompilerOptions } from 'typescript';
import { TypeScriptVersion } from './typescript-versions';

export async function checkPackageJson(dirPath: string, typesVersions: readonly TypeScriptVersion[]): Promise<void> {
  return;
}

type CompilerOptionsRaw = {
  [K in keyof CompilerOptions]?: CompilerOptions[K] extends number | undefined
    ? string | number | undefined
    : CompilerOptions[K];
};
export function checkTsconfig(options: CompilerOptionsRaw): void {
  if (!('lib' in options)) {
    throw new Error('Must specify "lib", usually to `"lib": ["es6"]` or `"lib": ["es6", "dom"]`.');
  }
  if (!('module' in options)) {
    throw new Error('Must specify "module" to `"module": "commonjs"` or `"module": "node16"`.');
  }
  if (
    options.module?.toString().toLowerCase() !== 'commonjs' &&
    options.module?.toString().toLowerCase() !== 'node16'
  ) {
    throw new Error(`When "module" is present, it must be set to "commonjs" or "node16".`);
  }
  if ('strict' in options) {
    if (options.strict !== true) {
      throw new Error('When "strict" is present, it must be set to `true`.');
    }
    for (const key of ['noImplicitAny', 'noImplicitThis', 'strictNullChecks', 'strictFunctionTypes']) {
      if (key in options) {
        throw new TypeError(`Expected "${key}" to not be set when "strict" is \`true\`.`);
      }
    }
  } else {
    for (const key of ['noImplicitAny', 'noImplicitThis', 'strictNullChecks', 'strictFunctionTypes']) {
      if (!(key in options)) {
        throw new Error(`Expected \`"${key}": true\` or \`"${key}": false\`.`);
      }
    }
  }
  if ('exactOptionalPropertyTypes' in options) {
    if (options.exactOptionalPropertyTypes !== true) {
      throw new Error('When "exactOptionalPropertyTypes" is present, it must be set to `true`.');
    }
  }
  if (options.types && options.types.length) {
    throw new Error(
      'Use `/// <reference types="..." />` directives in source files and ensure ' +
        'that the "types" field in your tsconfig is an empty array.',
    );
  }
}
