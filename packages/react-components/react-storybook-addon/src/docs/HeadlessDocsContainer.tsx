import * as React from 'react';
import { DocsContainer, type DocsContextProps } from '@storybook/addon-docs/blocks';
import type { ThemeVars } from 'storybook/theming';

interface HeadlessDocsContainerProps {
  context: DocsContextProps;
  children: React.ReactNode;
}

function getDocsTheme(context: DocsContextProps): ThemeVars | undefined {
  return (context as any).projectAnnotations?.parameters?.docs?.theme;
}

/**
 * A docs container for headless components — no FluentProvider wrapping.
 * Stories and docs chrome render without any React context provider,
 * relying on globally-loaded CSS custom properties (tokens.css) for styling.
 */
export const HeadlessDocsContainer: React.FC<HeadlessDocsContainerProps> = ({ children, context }) => {
  const docsTheme = getDocsTheme(context);
  return (
    <DocsContainer context={context} theme={docsTheme}>
      {children}
    </DocsContainer>
  );
};
