import assert = require('assert');
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import { TypeScriptVersion } from '@definitelytyped/typescript-versions';
import { pathExists, writeJsonFile } from './utils';
import { latest, shipped } from './typescript-versions';

export type TsVersion = TypeScriptVersion | 'local';

const installsDir = path.join(os.homedir(), '.dts', 'typescript-installs');

export async function installAllTypeScriptVersions() {
  for (const version of shipped) {
    await install(version);
  }
  await installTypeScriptNext();
}

export async function installTypeScriptNext() {
  await install('next');
}

async function install(version: string): Promise<void> {
  // async function install(version: TsVersion | 'next'): Promise<void> {
  if (version === 'local') {
    return;
  }
  const dir = installDir(version);
  if (!(await pathExists(dir))) {
    console.log(`Installing to ${dir}...`);
    await fs.mkdir(dir, { recursive: true });
    await writeJsonFile(path.join(dir, 'package.json'), createPackageJson(version));
    await execAndThrowErrors('npm install --ignore-scripts --no-shrinkwrap --no-package-lock --no-bin-links', dir);
    console.log('Installed!');
    console.log('');
  } else {
    console.log(`install cached ${dir}`);
  }
}

export function cleanTypeScriptInstalls(): Promise<void> {
  return fs.unlink(installsDir);
}

// export function getTypeScriptPath(version: TsVersion, tsLocal: string | undefined): string {
export function getTypeScriptPath(version: string, tsLocal: string | undefined): string {
  if (version === 'local') {
    return tsLocal! + '/typescript.js';
  }
  return path.join(installDir(version), 'node_modules', 'typescript');
}

// function installDir(version: TsVersion | 'next'): string {
function installDir(version: string): string {
  assert(version !== 'local');
  if (version === 'next') {
    version = latest;
  }
  return path.join(installsDir, version);
}

// function createPackageJson(version: TsVersion | 'next'): {} {
function createPackageJson(version: string): {} {
  return {
    description: `Installs typescript@${version}`,
    repository: 'N/A',
    license: 'MIT',
    dependencies: {
      typescript: version,
    },
  };
}

/** Run a command and return the stdout, or if there was an error, throw. */
async function execAndThrowErrors(cmd: string, cwd?: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const env = { ...process.env };
    if (env.NODE_OPTIONS && env.NODE_OPTIONS.includes('--require')) {
      delete env.NODE_OPTIONS;
    }
    exec(cmd, { encoding: 'utf8', cwd, env }, (err, _stdout, stderr) => {
      if (stderr) {
        console.error(stderr);
      }

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
