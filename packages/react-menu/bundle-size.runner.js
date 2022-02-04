const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const pkgJson = require('./package.json');

const COMMAND_PREFIX = `${chalk.cyan('>')} ${chalk.inverse(chalk.bold(chalk.cyan(' BUNDLE BENCH ')))}`;
const bundlesForBench = [
  {
    title: 'Creating App Bundle with transpiled only files',
    path: 'lib/index.js',
  },
  { title: 'Creating App Bundle with bundled package via rollup', path: 'dist/rollup.min.js' },
  { title: 'Creating App Bundle with bundled package via esbuild', path: 'dist/esbuild.min.js' },
];

const bundlePackageCommand = 'yarn bundle:bench';
const bundleCommands = ['yarn bundle-size:webpack', 'yarn bundle-size:esbuild', 'yarn bundle-size:rollup'];
const outputCommand = 'yarn bundle-size:format';

main();

function main() {
  console.log(COMMAND_PREFIX);

  console.log('== CREATING PACKAGE BUNDLES ==');
  execSync(bundlePackageCommand, { stdio: 'inherit' });
  console.log('== CREATING PACKAGE BUNDLES: DONE ==');
  printPackageBundleSizes();

  console.log('='.repeat(30));

  console.log('== CREATING APP BUNDLES ==');

  bundlesForBench.forEach(setup => {
    console.log(chalk.greenBright.bgBlack(' > ' + setup.title));

    console.log(chalk.cyan(`UPDATE package.json main to: ${setup.path}`));
    const updatedPkgJson = { ...pkgJson, module: setup.path };
    fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(updatedPkgJson, null, 2));

    bundleCommands.forEach(cmd => {
      execSync(cmd, { stdio: 'inherit' });
    });

    execSync(outputCommand, { stdio: 'inherit' });

    console.log('\n');
  });

  console.log('== CREATING APP BUNDLES: DONE ==');

  cleanup();
}

function printPackageBundleSizes() {
  const root = path.join(__dirname, 'dist');
  const bundleNames = {
    rollup: ['rollup.js', 'rollup.min.js'],
    esbuild: ['esbuild.js', 'esbuild.min.js'],
  };

  const bundleFiles = Object.values(bundleNames).reduce((acc, [normal, minified]) => {
    acc[normal] = {
      content: fs.readFileSync(path.join(root, normal), 'utf-8'),
      size: fs.statSync(path.join(root, normal)).size,
    };
    acc[minified] = {
      content: fs.readFileSync(path.join(root, minified), 'utf-8'),
      size: fs.statSync(path.join(root, minified)).size,
    };

    return acc;
  }, {});

  const data = Object.entries(bundleFiles).reduce((acc, [fileName, config]) => {
    acc[fileName] = {
      raw: config.size,
      min: formatBytes(config.size),
      gzip: formatBytes(gzipSize.sync(config.content)),
    };
    return acc;
  }, {});

  console.table(data);

  function formatBytes(value) {
    return prettyBytes(value, { maximumFractionDigits: 3 });
  }
}

function cleanup() {
  fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkgJson, null, 2));
}
