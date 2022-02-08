const { printBundleSize, printPackageBundleSizes } = require('./bundle-size.utils');

main();

function main() {
  const args = process.argv.slice(2);

  if (!args[0] || args[0] === '--apps') {
    console.log('Webpack:');
    printBundleSize({ distFolderName: 'bundle-size' });

    console.log('Rollup:');
    printBundleSize({ distFolderName: 'bundle-size-rollup' });

    console.log('ESBuild:');
    printBundleSize({ distFolderName: 'bundle-size-esbuild' });

    console.log('SWC:');
    printBundleSize({ distFolderName: 'bundle-size-swc' });
  }

  if (args[0] === '--libs') {
    printPackageBundleSizes();
  }
}
