const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const { printPackageBundleSizes } = require('./bundle-size.utils');
const pkgJson = require('./package.json');

const COMMAND_PREFIX = `${chalk.cyan('>')} ${chalk.inverse(chalk.bold(chalk.cyan(' BUNDLE BENCH ')))}`;
const bundlesForBench = [
  {
    title: 'Creating App Bundle with transpiled only files',
    path: 'lib/index.js',
  },
  { title: 'Creating App Bundle with bundled package via rollup', path: 'dist/rollup.min.js' },
  { title: 'Creating App Bundle with bundled package via esbuild', path: 'dist/esbuild.min.js' },
  { title: 'Creating App Bundle with bundled package via swc', path: 'dist/swc.min.js' },
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

function cleanup() {
  fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkgJson, null, 2));
}
