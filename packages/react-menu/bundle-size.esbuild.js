/* eslint-disable @typescript-eslint/naming-convention */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');

const fixtureNames = ['Menu.fixture.js', 'Menu.Selectable.fixture.js'];
const fixturePaths = fixtureNames.map(fixtureName => path.join(__dirname, 'bundle-size', fixtureName));

const config = {
  entryPoints: [...fixturePaths],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  treeShaking: true,
  outdir: 'dist/bundle-size-esbuild',
  external: [
    'react',
    'react-dom',
    // NOTE: following packages are causing issues

    // react-theme bundles whole `tokens` dictionary
    // '@fluentui/react-theme',

    // scheduler is included in development mode in .output.js (non minified)
    // 'scheduler',
  ],
  define: {
    // note: this shouldn't be needed - enabled when `minify: true`
    'process.env.NODE_ENV': '"production"',
  },
};

async function main() {
  await esbuild.build(config);

  renameFixturesToOutput({
    fixtureNames,
    outputFolderName: 'dist/bundle-size-esbuild',
    fixtureReplaceString: 'output',
  });

  await esbuild.build({
    ...config,
    minify: true,
  });

  renameFixturesToOutput({ fixtureNames, outputFolderName: 'dist/bundle-size-esbuild', fixtureReplaceString: 'min' });

  runTerserOnMinified();
}

/**
 *
 * @param {{fixtureNames:string[]; outputFolderName:string, fixtureReplaceString: string}} options
 */
function renameFixturesToOutput(options) {
  options.fixtureNames.forEach(fixtureName => {
    const old = path.join(__dirname, options.outputFolderName, fixtureName);
    const newPath = old.replace('fixture', options.fixtureReplaceString);
    fs.renameSync(old, newPath);
  });
}

function runTerserOnMinified() {
  execSync(`terser -c -m -o ./dist/bundle-size-esbuild/Menu-terser.min.js ./dist/bundle-size-esbuild/Menu.min.js`);
  execSync(
    // eslint-disable-next-line @fluentui/max-len
    `terser -c -m -o ./dist/bundle-size-esbuild/Menu.Selectable-terser.min.js ./dist/bundle-size-esbuild/Menu.Selectable.min.js`,
  );
}

main().then(() => console.log('SUCCESS ✅'));
