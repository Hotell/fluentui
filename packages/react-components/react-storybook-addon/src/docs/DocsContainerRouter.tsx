/**
 * Config-driven docs container router.
 * Reads `reactStorybookAddon.docs.page` and renders the appropriate container.
 */
import * as React from 'react';
import type { DocsContextProps } from '@storybook/addon-docs/blocks';

import { getDocsPageConfig } from './utils';
import { FluentDocsContainer } from './FluentDocsContainer';
import { HeadlessDocsContainer } from './HeadlessDocsContainer';

interface DocsContainerRouterProps {
  context: DocsContextProps;
  children: React.ReactNode;
}

export const DocsContainerRouter: React.FC<DocsContainerRouterProps> = ({ children, context }) => {
  const config = getDocsPageConfig(context);

  if (config?.page === 'headless') {
    return <HeadlessDocsContainer context={context}>{children}</HeadlessDocsContainer>;
  }

  return <FluentDocsContainer context={context}>{children}</FluentDocsContainer>;
};
