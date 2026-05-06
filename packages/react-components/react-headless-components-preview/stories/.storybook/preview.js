import { polyfillBodyAndObserve } from '@microsoft/focusgroup-polyfill/shadowless';

import * as rootPreview from '../../../../../.storybook/preview';
import theme from './theme';

// Design tokens — loaded once for every story. Defines :root (light) and
// [data-theme="dark"] CSS custom properties consumed by all *.module.css files.
import './tokens.css';

polyfillBodyAndObserve();

/** @type {typeof rootPreview.decorators} */
export const decorators = [...rootPreview.decorators];

/** @type {typeof rootPreview.parameters} */
export const parameters = {
  ...rootPreview.parameters,
  docs: {
    theme,
  },
  reactStorybookAddon: {
    ...rootPreview.parameters?.reactStorybookAddon,
    docs: {
      page: 'headless',
      sourcePanel: 'multi-file',
      disclaimer: [
        'Heads up: headless components ship without default styles. The CSS shown in these stories is provided purely as a demonstration of one possible look.',
        'Preview: these controls are in preview and their APIs are subject to change.',
      ],
      tableOfContents: true,
      argTable: { slotsApi: true, nativePropsApi: true },
    },
  },
};

export const tags = ['autodocs'];
