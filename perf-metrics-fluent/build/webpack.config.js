// @ts-check

import path from 'node:path';
import TerserWebpackPlugin from 'terser-webpack-plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname)
function createWebpackConfig(fixturePath, outputPath, debug) {
  return {
    name: 'client',
    target: 'web',
    mode: 'production',

    cache: {
      type: 'memory',
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    resolve: {},

    entry: fixturePath,
    output: {
      filename: path.basename(outputPath),
      path: path.dirname(outputPath),

      ...(debug && {
        pathinfo: true,
      }),
    },
    performance: {
      hints: false,
    },
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],

      // If debug mode is enabled, we want to disable minification and rely on Terser to produce a partially minified
      // file for debugging purposes
      ...(debug && {
        minimize: false,
        minimizer: [],
      }),
    },

    ...(debug && {
      stats: {
        optimizationBailout: true,
      },
    }),
  };
}

const config = createWebpackConfig(
  path.resolve(__dirname, './input.js'),
  path.resolve(__dirname, './output.js'),
  process.env.DEBUG === 'true',
);

const mocks = [
      { name: '@fluentui/react-icons', mock: '../react-icons.mock.js' },
      { name: '@fluentui/react-tabster', mock: '../react-tabster.mock.js' },
      { name: '@fluentui/react-positioning', mock: '../react-positioning.mock.js' },
      { name: '@floating-ui/dom', mock: '../floating_ui.mock.js' },
    ];

// Also update resolve.alias as a secondary mechanism for Webpack's resolver
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(mocks.map(({ name, mock }) => [name + '$', path.resolve(__dirname, mock)])),
    };

export default config;
