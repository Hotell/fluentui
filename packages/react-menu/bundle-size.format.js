const { printBundleSize, printPackageBundleSizes } = require('./bundle-size.utils');

main();

function main() {
  const args = process.argv.slice(2);

  if (!args[0] || args[0] === '--apps') {
    console.log('Webpack:');
    printBundleSize({ distFolderName: 'bundle-size' });

    console.log('ESBuild:');
    printBundleSize({ distFolderName: 'bundle-size-esbuild' });

    console.log('Rollup:');
    printBundleSize({ distFolderName: 'bundle-size-rollup' });
  }

  if (args[0] === '--libs') {
    printPackageBundleSizes();
  }
}
