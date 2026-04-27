const rootMain = require('../../../.storybook/main');
const { registerRules, rules } = require('@fluentui/scripts-storybook');

module.exports = /** @type {Omit<import('../../../.storybook/main'), 'typescript'|'babel'>} */ ({
  ...rootMain,
  stories: [
    ...rootMain.stories,
    // docsite stories
    '../src/**/*.mdx',
    '../src/**/index.stories.@(ts|tsx)',
    // headless package stories
    '../../../packages/react-components/react-headless-components-preview/stories/src/**/index.stories.@(ts|tsx)',
  ],
  staticDirs: ['../public'],
  addons: [...rootMain.addons],
  build: {
    previewUrl: process.env.DEPLOY_PATH,
  },
  webpackFinal: (config, options) => {
    const localConfig = /** @type config */ ({ ...rootMain.webpackFinal(config, options) });

    if (process.env.REACT_COMPILER) {
      registerRules({ rules: rules.reactCompilerRule, config: localConfig });
    }

    return localConfig;
  },
});
