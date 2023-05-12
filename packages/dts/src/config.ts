import * as path from 'path';
import { TypeScriptVersion } from './typescript-versions';
import { pathExists, readJsonFile } from './utils';

export interface Config {
  tsMinVersion: TypeScriptVersion;
  tsMaxVersion: TypeScriptVersion;
  warnOnly?: boolean;
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
