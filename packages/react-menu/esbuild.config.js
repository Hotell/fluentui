const path = require('path');
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

// const paths = { root: path.join(__dirname) };

esbuild.build({
  entryPoints: [path.join(__dirname, 'src/index.js')],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  treeShaking: true,
  outfile: 'dist/esbuild.js',
  plugins: [nodeExternalsPlugin()],
  tsconfig: 'tsconfig.lib.json',
});

esbuild.build({
  entryPoints: [path.join(__dirname, 'src/index.js')],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  treeShaking: true,
  outfile: 'dist/esbuild.min.js',
  minify: true,
  plugins: [nodeExternalsPlugin()],
  tsconfig: 'tsconfig.lib.json',
});
