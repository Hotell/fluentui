const { appBundleConfig, packageBundleConfig } = require('./spack-configs');

/**
 * Manually set env variable to distinguish how do we wanna exec bundling - needed because of limitation provided below
 */
const mode = process.env.SPACK_MODE;

/**
 * this is necessary because:
 *  - providing custom config doesn't work via CLI
 *  - using Array for multiple bundles doesn't work
 */
module.exports = mode === 'app' ? appBundleConfig() : packageBundleConfig();
