const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const root = path.join(__dirname, 'dist');

/**
 *
 * @param {{distFolderName:string}} options
 */
function printBundleSize(options) {
  const bundleNames = {
    menu: ['Menu.min.js', 'Menu-terser.min.js'],
    menuSelectable: ['Menu.Selectable.min.js', 'Menu.Selectable-terser.min.js'],
  };

  const bundleFiles = Object.values(bundleNames).reduce((acc, [minified, additionalMinified]) => {
    const paths = {
      minified: path.join(root, options.distFolderName, minified),
      additionalMinified: path.join(root, options.distFolderName, additionalMinified),
    };

    acc[minified] = {
      content: fs.readFileSync(paths.minified, 'utf-8'),
      size: fs.statSync(paths.minified).size,
    };

    if (fs.existsSync(paths.additionalMinified)) {
      acc[additionalMinified] = {
        content: fs.readFileSync(paths.additionalMinified, 'utf-8'),
        size: fs.statSync(paths.additionalMinified).size,
      };
    }

    return acc;
  }, {});

  const data = normalizeData(bundleFiles);

  console.table(data);
}

function printPackageBundleSizes() {
  const bundleNames = {
    rollup: ['rollup.js', 'rollup.min.js'],
    webpack: ['webpack.js', 'webpack.min.js'],
    esbuild: ['esbuild.js', 'esbuild.min.js', 'esbuild-terser.min.js'],
    swc: ['swc.js', 'swc.min.js'],
  };

  const bundleFiles = Object.values(bundleNames).reduce((acc, [normal, minified, additionalMinified]) => {
    const paths = {
      normal: path.join(root, normal),
      minified: path.join(root, minified),
      additionalMinified: additionalMinified ? path.join(root, additionalMinified) : '',
    };

    acc[normal] = {
      content: fs.readFileSync(paths.normal, 'utf-8'),
      size: fs.statSync(paths.normal).size,
    };
    acc[minified] = {
      content: fs.readFileSync(paths.minified, 'utf-8'),
      size: fs.statSync(paths.minified).size,
    };

    if (paths.additionalMinified) {
      acc[additionalMinified] = {
        content: fs.readFileSync(paths.additionalMinified, 'utf-8'),
        size: fs.statSync(paths.additionalMinified).size,
      };
    }

    return acc;
  }, {});

  const data = normalizeData(bundleFiles);

  console.table(data);
}

function formatBytes(value) {
  return prettyBytes(value, { maximumFractionDigits: 3 });
}

/**
 *
 * @param {Record<string,{content: string;size: number}>} bundleFiles
 * @returns {{raw: number; min: string; gzip: string}}
 */
function normalizeData(bundleFiles) {
  return Object.entries(bundleFiles).reduce((acc, [fileName, config]) => {
    acc[fileName] = {
      raw: config.size,
      min: formatBytes(config.size),
      gzip: formatBytes(gzipSize.sync(config.content)),
    };
    return acc;
  }, {});
}

module.exports = { printPackageBundleSizes, printBundleSize };
