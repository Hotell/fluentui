const path = require('path');
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { execSync } = require('child_process');

// const paths = { root: path.join(__dirname) };

async function main() {
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'src/index.js')],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    treeShaking: true,
    outfile: 'dist/esbuild.js',
    plugins: [nodeExternalsPlugin()],
    tsconfig: 'tsconfig.lib.json',
  });

  await esbuild.build({
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

  execSync('terser -c -m -o dist/esbuild-terser.min.js dist/esbuild.min.js');
}

main().then(() => console.log('SUCCESS ✅'));
