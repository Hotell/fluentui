import * as path from 'path';
import { TypeScriptVersion } from './typescript-versions';
import { pathExists, readJsonFile } from './utils';

export interface Config {
  /**
   * lowest TypeScript version to test against
   */
  tsMinVersion: TypeScriptVersion;
  /**
   * highest TypeScript version to test against
   */
  tsMaxVersion: TypeScriptVersion;
  /**
   * TypeScript config for d.ts checks. We use standard one by default, but you can tweak it to your particular needs within config
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tsConfig?: { compilerOptions: Record<string, any> };
  /**
   * relative path to your project folder where `.d.ts` files are being generated. Usually "./dist"
   * TODO: should be processed from package.json#types
   */
  dtsDirPath: string;
  /**
   * don't fail the program if there is at least 1 issue with particular TypeScript
   */
  warnOnly?: boolean;
  /**
   * print all program logs
   */
  verbose?: boolean;
}

export interface ProcessedConfig extends Required<Config> {
  projectRoot: string;
}

const tsConfigDefault = {
  compilerOptions: {
    noEmit: true,
    module: 'CommonJS',
    lib: ['ES2019', 'DOM'],
    strict: true,
    types: [],
    forceConsistentCasingInFileNames: true,

    // If the library is an external module (uses `export`), this allows your test file to import "mylib" instead of "./index".
    // If the library is global (cannot be imported via `import` or `require`), leave this out.
    baseUrl: '.',
    paths: {},
  },
};
const configDefaults = {
  tsMinVersion: '4.3',
  tsMaxVersion: '5.0',
  tsConfig: tsConfigDefault,
  dtsDirPath: './dist',
  warnOnly: false,
  verbose: false,
} as const;

export async function processConfig(options: { configPath?: string }): Promise<ProcessedConfig> {
  const cwd = process.cwd();
  const configPath = options.configPath ?? path.join(cwd, 'dts.config.json');
  const configExists = await pathExists(configPath);

  if (!configExists) {
    console.warn('no config provided. using defaults');
    return { ...configDefaults, projectRoot: cwd };
  }

  const userConfig = readJsonFile<Config>(configPath);

  // TODO - use merge here
  const config = { ...configDefaults, projectRoot: cwd, ...userConfig };
  config.tsConfig = { compilerOptions: { ...tsConfigDefault.compilerOptions, ...config.tsConfig?.compilerOptions } };

  return config;
}
