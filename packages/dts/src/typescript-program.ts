import * as TS from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

const programCache = new WeakMap<TS.Program, Map<string, TS.Program>>();
/** Maps a tslint Program to one created with the version specified in `options`. */
export function getProgram(
  configFile: string,
  ts: typeof TS,
  versionName: string,
  // lintProgram: TS.Program,
): TS.Program {
  // let versionToProgram = programCache.get(lintProgram);
  // if (versionToProgram === undefined) {
  //   versionToProgram = new Map<string, TS.Program>();
  //   programCache.set(lintProgram, versionToProgram);
  // }
  // let newProgram = versionToProgram.get(versionName);
  // if (newProgram === undefined) {
  //   newProgram = createProgram(configFile, ts);
  //   versionToProgram.set(versionName, newProgram);
  // }
  // return newProgram;
  return createProgram(configFile, ts);
}

function createProgram(configFile: string, ts: typeof TS): TS.Program {
  const projectDirectory = path.dirname(configFile);
  const { config } = TS.readConfigFile(configFile, TS.sys.readFile);
  const parseConfigHost: TS.ParseConfigHost = {
    fileExists: fs.existsSync,
    readDirectory: TS.sys.readDirectory,
    readFile: file => fs.readFileSync(file, 'utf8'),
    useCaseSensitiveFileNames: true,
  };
  const parsed = TS.parseJsonConfigFileContent(config, parseConfigHost, path.resolve(projectDirectory), {
    noEmit: true,
  });
  const host = TS.createCompilerHost(parsed.options, true);
  return TS.createProgram(parsed.fileNames, parsed.options, host);
}
