const path = require('path');
const { config } = require('@swc/core/spack');

const pkg = require('./package.json');

const externalDeps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }); /* .concat(implicitDeps) */
const nodeDeps = [];

module.exports = config({
  target: 'browser',
  mode: 'production',
  externalModules: [...externalDeps, ...nodeDeps],
  entry: {
    web: path.join(__dirname, './src/index.ts'),
  },
  output: {
    path: path.join(__dirname, './dist'),
    name: 'swc.js',
  },
});
