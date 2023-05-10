import * as path from 'path';
import * as fs from 'fs/promises';
import { readJsonFile } from '@nrwl/devkit';
import type * as ts from 'typescript';
export { serializeJson, writeJsonFile } from '@nrwl/devkit';
export { readJsonFile };

// eslint-disable-next-line @typescript-eslint/no-shadow
export async function pathExists(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory() || stats.isFile();
  } catch {
    return false;
  }
}

export async function getCompilerOptions(dirPath: string): Promise<ts.CompilerOptions> {
  const tsconfigPath = path.join(dirPath, 'tsconfig.json');
  if (!(await pathExists(tsconfigPath))) {
    throw new Error(`Need a 'tsconfig.json' file in ${dirPath}`);
  }
  return (await readJsonFile(tsconfigPath)).compilerOptions;
}
