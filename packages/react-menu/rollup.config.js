import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import * as path from 'path';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

import tsConfigRoot from '../../tsconfig.base.json';
import pkg from './package.json';

const implicitDeps = ['@fluentui/react-theme'];

// const tsPathAliases = pathsToModuleNameMapper(tsConfigRoot.compilerOptions.paths, {
//   prefix: `${path.relative(process.cwd(), __dirname)}`,
// });
const tsPathAliases = Object.entries(tsConfigRoot.compilerOptions.paths).reduce((acc, [pkgName, pkgPath]) => {
  acc[pkgName] = pkgPath[0];
  return acc;
}, {});

const isProduction = process.env.NODE_ENV === 'production';

const externalDeps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }); /* .concat(implicitDeps) */
const nodeDeps = [];

console.log(
  `NODE_ENV: ${JSON.stringify(process.env.NODE_ENV)}\n`,
  `Build executed in  ${isProduction ? 'PRODUCTION MODE' : 'NON PRODUCTION'}\n`,
  { externalDeps },
  { tsPathAliases },
);

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  external: [...externalDeps, ...nodeDeps],
  input: 'src/index.ts',
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      // include: ['src/**/*.tsx', 'src/**/*.ts'],
      extensions: [/* '.js', '.jsx', '.es6', '.es', '.mjs',  */ '.ts', '.tsx'],
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            corejs: 3,
            targets: 'last 1 version, not IE 11, not dead',
            loose: true,
            modules: false,
          },
        ],
        ['@babel/preset-typescript'],
      ],
      plugins: ['pure-calls-annotation'],
    }),
    resolve({ extensions: ['.ts', '.tsx'] }),
    commonjs(),
  ],
  output: [
    // rolluped modules to 1 file
    {
      file: 'dist/rollup.js',
      format: 'es',
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
      ],
    },
    // rolluped modules to 1 file + minified + dead code elimination
    {
      file: 'dist/rollup.min.js',
      format: 'es',
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        terser(),
      ],
    },
  ],
};

export default config;
