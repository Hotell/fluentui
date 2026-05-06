import * as React from 'react';
import { DocsContainer, type DocsContextProps } from '@storybook/addon-docs/blocks';
import { webLightTheme } from '@fluentui/react-theme';
import { FluentProvider } from '@fluentui/react-provider';
import type { ThemeVars } from 'storybook/theming';

import { isDocsEnabled } from './utils';

interface FluentDocsContainerProps {
  context: DocsContextProps;
  children: React.ReactNode;
}

function getDocsTheme(context: DocsContextProps): ThemeVars | undefined {
  return (context as any).projectAnnotations?.parameters?.docs?.theme;
}

/**
 * A container that wraps storybook's native docs container to add extra components to the docs experience
 */
export const FluentDocsContainer: React.FC<FluentDocsContainerProps> = ({ children, context }) => {
  const docsTheme = getDocsTheme(context);

  if (isDocsEnabled(context)) {
    return (
      <>
        {/** TODO add table of contents */}
        <FluentProvider className="sb-unstyled" style={{ backgroundColor: 'transparent' }} theme={webLightTheme}>
          <DocsContainer context={context} theme={docsTheme}>
            {children}
          </DocsContainer>
        </FluentProvider>
      </>
    );
  }

  // If docs container is not enabled, fall back to Storybook's default DocsContainer
  return (
    <DocsContainer context={context} theme={docsTheme}>
      {children}
    </DocsContainer>
  );
};
