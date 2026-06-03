// @ts-check
/**
 * Hybrid jest transformer used when the React Compiler is enabled.
 *
 * The compiler can transform code in ways that conflict with
 * `babel-plugin-jest-hoist`'s strict out-of-scope variable check applied to
 * `jest.mock()` factories. To avoid this, test files keep using `@swc/jest`
 * (which has a more permissive mock-hoist analysis), while component source
 * files go through `babel-jest` + `babel-plugin-react-compiler`.
 *
 * @param {{ swcJestConfig: Record<string, unknown> }} options
 */
function createTransformer({ swcJestConfig }) {
  const babelJest = require('babel-jest').default.createTransformer({
    babelrc: false,
    configFile: false,
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: ['babel-plugin-react-compiler'],
  });
  const swcJest = require('@swc/jest').createTransformer(swcJestConfig);

  const isTestFile = sourcePath =>
    /\.(test|spec)\.[jt]sx?$/.test(sourcePath) ||
    // Conformance/test-helper packages contain `jest.mock()` calls with closure references
    // that conflict with `babel-plugin-jest-hoist`'s strict check. Route them through SWC too.
    /[\\/]react-conformance[^\\/]*[\\/]/.test(sourcePath) ||
    /[\\/]testing[\\/]/.test(sourcePath);

  const pick = sourcePath => (isTestFile(sourcePath) ? swcJest : babelJest);

  return {
    canInstrument: false,
    getCacheKey(sourceText, sourcePath, options) {
      const inner = pick(sourcePath);
      const innerKey = inner.getCacheKey
        ? inner.getCacheKey(sourceText, sourcePath, options)
        : sourceText;
      return `react-compiler-hybrid:${isTestFile(sourcePath) ? 'swc' : 'babel'}:${innerKey}`;
    },
    process(sourceText, sourcePath, options) {
      return pick(sourcePath).process(sourceText, sourcePath, options);
    },
    processAsync(sourceText, sourcePath, options) {
      const inner = pick(sourcePath);
      if (inner.processAsync) {
        return inner.processAsync(sourceText, sourcePath, options);
      }
      return Promise.resolve(inner.process(sourceText, sourcePath, options));
    },
  };
}

module.exports = { createTransformer };
