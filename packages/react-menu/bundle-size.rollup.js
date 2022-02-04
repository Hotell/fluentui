import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import * as path from 'path';

// const externalDeps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }); /* .concat(implicitDeps) */
const externalDeps = ['react', 'react-dom'];
const nodeDeps = [];

const fixtureNames = ['Menu.fixture.js', 'Menu.Selectable.fixture.js'];

/**
 *
 * @param {{fixtureName:string,outDir:string}} options
 * @returns {import('rollup').RollupOptions}
 */
const createConfig = options => {
  return {
    external: [...externalDeps, ...nodeDeps],
    input: `./bundle-size/${options.fixtureName}`,
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        // include: ['src/**/*.tsx', 'src/**/*.ts'],
        extensions: ['.ts', '.tsx'],
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
              // turn off following transform to be on par with what esbuild does
              exclude: ['@babel/plugin-proposal-optional-chaining'],
            },
          ],
          ['@babel/preset-typescript'],
        ],
        plugins: ['pure-calls-annotation'],
      }),
      // resolve({ extensions: ['.ts', '.tsx'] }),
      resolve(),
      commonjs(),
    ],
    output: [
      // rolluped modules to 1 file
      {
        file: `${options.outDir}/${options.fixtureName.replace('fixture', 'output')}`,
        format: 'es',
        plugins: [
          replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          }),
        ],
      },
      // rolluped modules to 1 file + minified + dead code elimination
      {
        file: `${options.outDir}/${options.fixtureName.replace('fixture', 'min')}`,
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
};

const configs = fixtureNames.map(fixName => {
  return createConfig({ fixtureName: fixName, outDir: `./dist/bundle-size-rollup` });
});

export default configs;
