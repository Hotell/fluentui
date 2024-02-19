import * as fs from 'fs';
import * as path from 'node:path';

import { workspaceRoot, writeJsonFile } from '@nx/devkit';
import { readTsConfig } from '@nx/js/src/utils/typescript/ts-config';
import { logger } from 'just-scripts';
import * as ts from 'typescript';

import { getTsPathAliasesConfig } from './utils';

// eslint-disable-next-line @typescript-eslint/no-shadow
function createTmpTsConfig(tsconfigPath: string, workspaceRoot: string, projectRoot: string) {
  const tmpTsConfigPath = path.join(workspaceRoot, 'tmp', projectRoot, 'tsconfig.generated.json');
  const parsedTSConfig = readTsConfigWithRemappedPaths(path.join(workspaceRoot, tsconfigPath), tmpTsConfigPath);

  process.on('exit', () => cleanupTmpTsConfigFile(tmpTsConfigPath));

  writeJsonFile(tmpTsConfigPath, parsedTSConfig);

  return { tmpTsConfigPath };
}

function readTsConfigWithRemappedPaths(tsConfigPath: string, generatedTsConfigPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generatedTsConfig: Record<string, any> = { compilerOptions: {} };
  const originalConfig = readTsConfig(tsConfigPath);

  generatedTsConfig.extends = path.relative(path.dirname(generatedTsConfigPath), tsConfigPath);
  generatedTsConfig.compilerOptions.paths = updatePaths(originalConfig.options.paths ?? {});
  generatedTsConfig.include = originalConfig.raw.include;
  generatedTsConfig.files = originalConfig.raw.files;
  generatedTsConfig.references = originalConfig.raw.references.map((ref: { path: string }) => {
    const oldPath = ref.path;
    const newPath = path.relative(path.dirname(generatedTsConfigPath), oldPath);
    return { path: newPath };
  });

  // if (process.env.NX_VERBOSE_LOGGING_PATH_MAPPINGS === 'true') {
  //   output.log({
  //     title: 'TypeScript path mappings have been rewritten.',
  //   });
  //   console.log(JSON.stringify(generatedTsConfig.compilerOptions.paths, null, 2));
  // }
  return generatedTsConfig;
}

function updatePaths(paths: Record<string, string[]>) {
  // turn off path aliases for now
  return {};
}

function cleanupTmpTsConfigFile(tmpTsConfigPath: string) {
  try {
    if (tmpTsConfigPath) {
      fs.unlinkSync(tmpTsConfigPath);
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

export function typeCheckV2() {
  performance.mark('type-check-v2:start');
  const { isUsingTsSolutionConfigs, tsConfigFilePaths, projectRoot } = getTsPathAliasesConfig();

  if (!isUsingTsSolutionConfigs) {
    logger.info('project is not using TS solution config. skipping...');
    return;
  }

  const tmpTsConfig = createTmpTsConfig(
    path.relative(workspaceRoot, tsConfigFilePaths.root),
    workspaceRoot,
    path.relative(workspaceRoot, projectRoot),
  );

  const buildResult = tscBuild(tmpTsConfig.tmpTsConfigPath);

  performance.mark('type-check-v2:end');

  performance.measure('type-check-v2', 'type-check-v2:start', 'type-check-v2:end');

  performance.getEntriesByName('type-check-v2').forEach(entry => console.log(`duration: ${entry.duration / 1000} s`));

  if (buildResult > 0) {
    console.error('Build failed');
    process.exit(1);
  }
}

const formatHost: ts.FormatDiagnosticsHost = {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function tscBuild(tsConfigPath: string) {
  // const tsSolutionConfigPath = ts.findConfigFile(rootPath, ts.sys.fileExists, 'tsconfig.json');

  if (!tsConfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  // const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  // const host = ts.createSolutionBuilderHost(undefined, createProgram);
  const host = ts.createSolutionBuilderHost(ts.sys, /*createProgram*/ undefined, diagnostic => {
    const formattedDiagnostic = ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost);

    console.info(formattedDiagnostic);
  });

  const solutionBuilder = ts.createSolutionBuilder(host, [tsConfigPath], {});

  const buildResult = solutionBuilder.build();

  // if (buildResult > 0) {
  //   console.error('Build failed');
  //   process.exit(1);
  // }

  // console.log('Build succeeded');

  return buildResult;
}
