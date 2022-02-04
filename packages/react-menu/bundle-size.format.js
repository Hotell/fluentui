const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const root = path.join(__dirname, 'dist');

const fixtureOutputNames = ['Menu.min.js', 'Menu.Selectable.min.js'];

console.log('Webpack:');
printBundleSize({ distFolderName: 'bundle-size' });

console.log('ESBuild:');
printBundleSize({ distFolderName: 'bundle-size-esbuild' });

console.log('Rollup:');
printBundleSize({ distFolderName: 'bundle-size-rollup' });

/**
 *
 * @param {{distFolderName:string}} options
 */
function printBundleSize(options) {
  const files = {
    menu: {
      content: fs.readFileSync(path.join(root, options.distFolderName, fixtureOutputNames[0]), 'utf-8'),
      size: fs.statSync(path.join(root, options.distFolderName, fixtureOutputNames[0])).size,
    },
    menuSelectable: {
      content: fs.readFileSync(path.join(root, options.distFolderName, fixtureOutputNames[1]), 'utf-8'),
      size: fs.statSync(path.join(root, options.distFolderName, fixtureOutputNames[1])).size,
    },
  };

  const data = Object.entries(files).reduce((acc, [fileName, config]) => {
    acc[fileName] = {
      raw: config.size,
      min: formatBytes(config.size),
      gzip: formatBytes(gzipSize.sync(config.content)),
    };
    return acc;
  }, {});

  console.table(data);
}

function formatBytes(value) {
  return prettyBytes(value, { maximumFractionDigits: 3 });
}
