const path = require('path');

const pkg = require('./package.json');
const externalDeps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }); /* .concat(implicitDeps) */

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack.js',
    // module: true,
    environment: { module: true },
    library: {
      type: 'module',
    },
  },
  // name: 'client',
  // target: 'web',
  mode: 'production',
  // externalsType: 'module',
  externals: externalDeps,

  resolve: {
    extensions: ['.tsx', '.ts'],
  },

  // performance: {
  //   hints: false,
  // },
  optimization: {
    minimize: false,
  },
  // stats: {
  //   optimizationBailout: true,
  // },

  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
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
          },
        },
      },
    ],
  },
};

module.exports = [
  config,
  {
    ...config,
    optimization: {
      minimize: true,
    },
    output: { ...config.output, filename: 'webpack.min.js' },
  },
];
