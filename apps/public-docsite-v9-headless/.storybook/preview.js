import * as headlessPreview from '../../../packages/react-components/react-headless-components-preview/stories/.storybook/preview';

export const decorators = [...headlessPreview.decorators];

/** @type {typeof headlessPreview.parameters} */
export const parameters = {
  ...headlessPreview.parameters,
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Introduction', 'Headless Components'],
    },
  },
};

export const tags = ['autodocs'];
