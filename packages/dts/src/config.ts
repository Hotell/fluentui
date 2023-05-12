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
   * don't fail the program if there is at least 1 issue with particular TypeScript
   */
  warnOnly?: boolean;
  /**
   * print all program logs
   */
  verbose?: boolean;
}

const configDefaults: Config = { tsMinVersion: '4.3', tsMaxVersion: '5.0' };

export async function processConfig(): Promise<Config> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'dts.config.json');
  const configExists = await pathExists(configPath);

  if (!configExists) {
    console.warn('no config provided. using defaults');
    return configDefaults;
  }

  const config = readJsonFile<Config>(configPath);

  return config;
}
