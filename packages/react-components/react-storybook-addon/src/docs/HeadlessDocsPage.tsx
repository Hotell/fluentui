/**
 * `HeadlessDocsPage` — A provider-free docs page variant for headless components.
 *
 * Features:
 * - Multi-file tabbed source panel (TSX + CSS modules)
 * - Table of contents sidebar
 * - Slot normalization in ArgTypes
 * - Configurable disclaimer banner
 * - No FluentProvider dependency — uses Storybook's native theming
 *
 * Selected via `reactStorybookAddon.docs.page: 'headless'` in story parameters.
 */
import * as React from 'react';
import {
  Anchor,
  ArgTypes,
  Canvas,
  Description,
  DocsContext,
  HeaderMdx,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import type { PreparedStory, Renderer, SBEnumType } from 'storybook/internal/types';
import { styled, useTheme } from 'storybook/theming';
import { InfoFilled } from '@fluentui/react-icons';
import type { JSXElement } from '@fluentui/react-utilities';

import { getDocsPageConfig } from './utils';
import { Disclaimer, FluentSourcePanel, Toc, nameToHash } from './blocks';

type PrimaryStory = PreparedStory<Renderer>;

/**
 * Injects global styles for the native Storybook "Show/Hide code" button
 * so it keeps the accent underline when expanded (not just on hover).
 * Reads `theme.color.secondary` as the single source of truth for accent color.
 */
const AccentGlobalStyles: React.FC = () => {
  const theme = useTheme();
  const accentColor = theme.color.secondary;
  return (
    <style>{`
    .sbdocs-preview .docblock-code-toggle.docblock-code-toggle--expanded,
    .sbdocs-preview .docblock-code-toggle:hover,
    .sbdocs-preview .docblock-code-toggle:focus {
      outline: none !important;
      box-shadow: ${accentColor} 0 -3px 0 0 inset !important;
      color: ${accentColor} !important;
    }
    .docs-story .with-code-sandbox-button:hover,
    .docs-story .with-code-sandbox-button:focus {
      outline: none !important;
      box-shadow: ${accentColor} 0 -3px 0 0 inset !important;
      color: ${accentColor} !important;
    }
    .fluent-source-portal > div {
      background: #ffffff !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      right: auto !important;
    }
    .sbdocs-preview > *:not(.docs-story):not(.fluent-source-portal) {
      display: none !important;
    }
    .sbdocs-preview:has(> .fluent-source-portal:not(:empty)) {
      height: auto !important;
    }
  `}</style>
  );
};

// --- Styled components (provider-agnostic) ---

const Wrapper = styled.div({
  display: 'flex',
  gap: '16px',
});

const ContentContainer = styled.div({
  width: '200px',
  flexGrow: 1,
});

const TocContainer = styled.div({
  flexBasis: '200px',
  flexShrink: 0,
  '@media screen and (max-width: 1000px)': {
    display: 'none',
  },
});

const Divider = styled.hr({
  height: 1,
  backgroundColor: '#e1dfdd',
  border: 0,
  margin: '48px 0',
});

const StoriesHeading = styled.h2({
  fontSize: 11,
  fontWeight: 700,
  lineHeight: '16px',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: '#666666',
  border: 0,
  margin: '56px 0 12px',
});

const SlotInfoBox = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '12px',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 6,
  padding: '12px 16px',
  margin: '12px 0',
  '& p': { margin: 0 },
}));

const InfoIcon = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignSelf: 'center',
  flexShrink: 0,
  color: theme.color.secondary,
  fontSize: '24px',
  lineHeight: 1,
  '& svg': { width: '1em', height: '1em' },
}));

// --- Slot normalization (shared logic) ---

const slotRegex = /as\?:\s*"([^"]+)"/;

function withSlotEnhancer(story: PreparedStory<Renderer>, options: { slotsApi?: boolean; nativePropsApi?: boolean }) {
  const hasArgAsProp = options.nativePropsApi ? story.argTypes.as?.type?.name === 'enum' : false;
  const argAsProp = hasArgAsProp ? (story.argTypes.as.type as SBEnumType).value : null;
  let hasArgAsSlot = false;

  type ArgTypesMap = Record<
    string,
    {
      table?: { type: { summary?: string } };
      type: { name?: string };
    }
  >;

  type InternalComponentApi = {
    __docgenInfo: {
      props?: ArgTypesMap;
    };
  };

  const transformArgTypeNameWithSlotShorthand = (typeName: string) => {
    const match = typeName.match(slotRegex);
    if (match) {
      hasArgAsSlot = true;
      return `Slot<"${match[1]}">`;
    }
    if (typeName.includes('WithSlotShorthandValue')) {
      hasArgAsSlot = true;
      return `Slot`;
    }
    return typeName;
  };

  const transformArgTypesWithSlotShorthand = (argTypes: ArgTypesMap) => {
    Object.values(argTypes).forEach(argType => {
      if (argType?.table?.type?.summary) {
        argType.table.type.summary = transformArgTypeNameWithSlotShorthand(argType.table.type.summary);
      }
      if (argType?.type?.name) {
        argType.type.name = transformArgTypeNameWithSlotShorthand(argType.type.name);
      }
    });
  };

  const transformComponentDocGenProps = (component: InternalComponentApi) => {
    const docGenProps = component?.__docgenInfo?.props;
    if (docGenProps) {
      transformArgTypesWithSlotShorthand(docGenProps);
    }
  };

  const component = story.moduleExport;

  if (options.slotsApi) {
    transformArgTypesWithSlotShorthand(story.argTypes as ArgTypesMap);
    transformComponentDocGenProps(component);
    if (story.subcomponents) {
      Object.values(story.subcomponents).forEach(transformComponentDocGenProps);
    }
  }

  return { component, hasArgAsSlot, hasArgAsProp, argAsProp };
}

const getNativeElementsList = (elements: SBEnumType['value']): React.ReactElement => {
  const elementsArr = elements?.map((el, idx) => [
    <code key={idx}>{`<${el}>`}</code>,
    idx !== elements.length - 1 ? ', ' : ' ',
  ]);
  return (
    <>
      {elementsArr}
      {elementsArr.length > 1 ? 'elements' : 'element'}
    </>
  );
};

// --- Args Table with slot enhancement ---

const RenderArgsTable: React.FC<{
  story: PrimaryStory;
  hideArgsTable: boolean;
  showSlotsApi?: boolean;
  showNativePropsApi?: boolean;
}> = ({ story, hideArgsTable, showSlotsApi, showNativePropsApi }) => {
  const { component, hasArgAsProp, hasArgAsSlot, argAsProp } = withSlotEnhancer(story, {
    slotsApi: showSlotsApi,
    nativePropsApi: showNativePropsApi,
  });

  if (hideArgsTable) {
    return null;
  }

  return (
    <>
      {hasArgAsProp && (
        <SlotInfoBox>
          <InfoIcon aria-hidden>
            <InfoFilled />
          </InfoIcon>
          <p>
            <strong>
              Native props are supported <span role="presentation">🙌</span>
            </strong>
            <br />
            <span>
              All HTML attributes native to the {getNativeElementsList(argAsProp!)}, including all <code>aria-*</code>{' '}
              and <code>data-*</code> attributes, can be applied as native props on this component.
            </span>
          </p>
        </SlotInfoBox>
      )}
      {hasArgAsSlot && (
        <SlotInfoBox>
          <InfoIcon aria-hidden>
            <InfoFilled />
          </InfoIcon>
          <p>
            <strong>
              Customizing components with slots <span role="presentation">🙌</span>
            </strong>
            <br />
            <span>
              Slots are designed to be modified or replaced, providing a flexible approach to customizing components.
              Each slot is exposed as a top-level prop and can be filled with primitive values, JSX/TSX, props objects,
              or render functions.
            </span>
          </p>
        </SlotInfoBox>
      )}
      <ArgTypes of={component} />
    </>
  );
};

// --- Main page component ---

export const HeadlessDocsPage = (): JSXElement => {
  const context = React.useContext(DocsContext);
  const docsPageConfig = getDocsPageConfig(context);
  const stories = context.componentStories();
  const primaryStory = stories[0];
  const remainingStories = stories.slice(1);
  const primaryStoryContext = context.getStoryContext(primaryStory);

  const hideArgsTable = Boolean(primaryStoryContext.parameters?.docs?.hideArgsTable);

  // Determine feature config
  const showTableOfContents = docsPageConfig?.tableOfContents ?? true;
  const showSourcePanel = (docsPageConfig?.sourcePanel ?? 'multi-file') === 'multi-file';
  const disclaimer = docsPageConfig?.disclaimer ?? false;
  const argTableConfig = docsPageConfig?.argTable ?? { slotsApi: true, nativePropsApi: true };

  return (
    <div className="sb-unstyled">
      <AccentGlobalStyles />
      <Title />
      <Wrapper>
        <ContentContainer>
          <Subtitle />
          <Description />
          {disclaimer && <Disclaimer message={disclaimer} />}

          {primaryStory && (
            <>
              <Divider />
              <HeaderMdx as="h3" id={nameToHash(primaryStory.name)}>
                {primaryStory.name}
              </HeaderMdx>
              <Anchor storyId={primaryStory.id}>
                <Canvas of={primaryStory.moduleExport} />
                {showSourcePanel && <FluentSourcePanel of={primaryStory.moduleExport} />}
              </Anchor>
            </>
          )}

          <RenderArgsTable
            story={primaryStory as unknown as PrimaryStory}
            hideArgsTable={hideArgsTable}
            showSlotsApi={argTableConfig.slotsApi}
            showNativePropsApi={argTableConfig.nativePropsApi}
          />

          {remainingStories.length > 0 && (
            <>
              <StoriesHeading>Stories</StoriesHeading>
              {remainingStories.map(story => (
                <Anchor key={story.id} storyId={story.id}>
                  <HeaderMdx as="h3" id={nameToHash(story.name)}>
                    {story.name}
                  </HeaderMdx>
                  <Description of={story.moduleExport} />
                  <Canvas of={story.moduleExport} />
                  {showSourcePanel && <FluentSourcePanel of={story.moduleExport} />}
                </Anchor>
              ))}
            </>
          )}
        </ContentContainer>
        {showTableOfContents && (
          <TocContainer>
            <Toc stories={stories} />
          </TocContainer>
        )}
      </Wrapper>
    </div>
  );
};
