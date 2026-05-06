/**
 * Config-driven docs page router.
 * Reads `reactStorybookAddon.docs.page` and renders the appropriate variant.
 */
import * as React from 'react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import type { JSXElement } from '@fluentui/react-utilities';

import { getDocsPageConfig } from './utils';
import { FluentDocsPage } from './FluentDocsPage';
import { HeadlessDocsPage } from './HeadlessDocsPage';

export const DocsPageRouter = (): JSXElement => {
  const context = React.useContext(DocsContext);
  const config = getDocsPageConfig(context);

  if (config?.page === 'headless') {
    return <HeadlessDocsPage />;
  }

  return <FluentDocsPage />;
};
