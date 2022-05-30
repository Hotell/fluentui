// @ts-check

const path = require('path');

const { getNamingConventionRule, getTypeInfoRuleOverrides } = require('../utils/configHelpers');

/** @type {import("eslint").Linter.RulesRecord} */
const typeAwareRules = {
  // F,T
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  // F, T
  '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [path.join(__dirname, 'core')],
  rules: {
    /**
     * `@typescript-eslint`plugin eslint rules
     * @see https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin
     */
    ...getNamingConventionRule(),
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    // F
    '@typescript-eslint/sort-type-union-intersection-members': 'warn',
    // F
    '@typescript-eslint/no-inferrable-types': 'warn',
    // F
    '@typescript-eslint/prefer-as-const': 'warn',
  },
  overrides: [
    {
      files: '**/src/index.{ts,tsx,js}',
      rules: {
        // TODO: propagate to `error` once all packages barrel files have been fixed
        '@rnx-kit/no-export-all': ['warn', { expand: 'all' }],
      },
    },
    ...getTypeInfoRuleOverrides(typeAwareRules),
  ],
};
