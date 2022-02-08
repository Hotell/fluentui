const path = require('path');
const { config } = require('@swc/core/spack');

const pkg = require('./package.json');

const packageBundleConfig = () => {
  const externalDeps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }); /* .concat(implicitDeps) */
  const nodeDeps = [];
  return config({
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
};

const appBundleConfig = () => {
  const externalDeps = ['react', 'react-dom'];
  const nodeDeps = [];

  const fixtureNames = ['Menu.fixture.js', 'Menu.Selectable.fixture.js'];
  const fixturePaths = fixtureNames.map(fixtureName => path.join(__dirname, 'bundle-size', fixtureName));

  return config({
    target: 'browser',
    mode: 'production',
    externalModules: [...externalDeps, ...nodeDeps],
    entry: [fixturePaths[0], fixturePaths[1]],

    output: {
      path: path.join(__dirname, 'dist', 'bundle-size-swc'),
    },
  });
};

module.exports = {
  appBundleConfig,
  packageBundleConfig,
};
