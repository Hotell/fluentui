import { useGlobals as useStorybookGlobals } from 'storybook/manager-api';
import type { Args as StorybookArgs, StoryContext as StorybookContext, Parameters } from '@storybook/react-webpack5';

import type { DIR_ID, STRICT_MODE_ID, THEME_ID } from './constants';
import type { ThemeIds } from './theme';

export interface FluentStoryContext extends StorybookContext {
  globals: FluentGlobals;
  parameters: FluentParameters;
}

/**
 * Extends the storybook globals object to include fluent specific properties
 */
export interface FluentGlobals extends StorybookArgs {
  [DIR_ID]?: 'ltr' | 'rtl';
  [THEME_ID]?: ThemeIds;
  [STRICT_MODE_ID]?: boolean;
}

/**
 * Extends the storybook parameters object to include fluent specific properties
 */
export interface FluentParameters extends Parameters {
  dir?: 'ltr' | 'rtl';
  fluentTheme?: ThemeIds;
  mode?: 'default' | 'vr-test';
  reactStorybookAddon?: {
    disabledDecorators?: ['AriaLive' | 'FluentProvider' | 'ReactStrictMode'];
    docs?: FluentDocsConfig;
  };
}

/**
 * Configuration for docs components
 */
export type FluentDocsConfig =
  | boolean
  | {
      /**
       * Selects the docs page variant to render.
       * - `'fluent'` (default): Full FluentProvider-wrapped page with Griffel styling and v9 tokens.
       * - `'headless'`: Provider-free page for headless components using pure CSS tokens.
       *   Automatically disables the FluentProvider decorator on stories.
       *
       * @default 'fluent'
       */
      page?: 'fluent' | 'headless';
      /**
       * Selects the "Show code" experience.
       * - `'default'`: Storybook's built-in single-source toggle.
       * - `'multi-file'`: Tabbed panel showing TSX + CSS module files.
       *   Requires `@fluentui/react-storybook-addon-export-to-sandbox` with `cssModules` enabled
       *   to inject `story.parameters.fullSource` and `story.parameters.cssModuleSources`.
       *
       * @default 'default'
       */
      sourcePanel?: 'multi-file' | 'default';
      /**
       * Configurable disclaimer banner displayed above the primary story.
       * - `false` (default): No disclaimer.
       * - `true`: Renders a generic preview disclaimer.
       * - `string`: Renders a single disclaimer block with custom text.
       * - `string[]`: Renders multiple blocks within the same aside, separated by a dashed line.
       *   Strings starting with "Label:" will have the prefix bolded.
       *
       * @default false
       */
      disclaimer?: string | string[] | boolean;
      tableOfContents?: boolean;
      dirSwitcher?: boolean;
      themePicker?: boolean;
      copyAsMarkdown?: boolean;
      argTable?:
        | boolean
        | {
            slotsApi?: boolean;
            nativePropsApi?: boolean;
          };
    };

export function useGlobals(): [FluentGlobals, (newGlobals: FluentGlobals) => void, FluentGlobals, FluentGlobals] {
  return useStorybookGlobals();
}

export function parameters(options?: FluentParameters): FluentParameters {
  return { dir: 'ltr', fluentTheme: 'web-light', mode: 'default', ...options };
}
export function getParametersConfig(context: FluentStoryContext): FluentParameters['reactStorybookAddon'] {
  return context?.parameters?.reactStorybookAddon;
}
