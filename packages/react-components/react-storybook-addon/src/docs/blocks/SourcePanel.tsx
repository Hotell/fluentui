/**
 * `FluentSourcePanel` — a docs block that renders a tabbed "Show code" panel
 * for a story with multiple source tabs: one for the story TSX, one per CSS
 * Module referenced by the story.
 *
 * The tabbed panel is driven by Storybook's native "Show code" toggle that
 * Canvas renders inside its footer. We listen to that toggle's clicks via a
 * click handler on its DOM node and mirror its open/closed state into local
 * React state.
 *
 * The story's TSX comes from `parameters.fullSource` (injected by
 * `@fluentui/babel-preset-storybook-full-source` at build time); the CSS comes
 * from `parameters.cssModuleSources.cssModules`.
 *
 * Styled via Storybook's `styled` (emotion) so the panel inherits the active
 * SB theme tokens and stays consistent with the rest of the docs chrome.
 */
/* eslint-disable @nx/workspace-no-restricted-globals */
import * as React from 'react';
import { createPortal } from 'react-dom';

import { useOf } from '@storybook/addon-docs/blocks';
import { SyntaxHighlighter } from 'storybook/internal/components';
import { styled } from 'storybook/theming';

/** A CSS Module file surfaced as a tab in the "Show code" panel. */
interface CssModule {
  name: string;
  source: string;
}

/** Shape consumed via `story.parameters.cssModuleSources`. */
interface SourceParameters {
  cssModules?: CssModule[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

export interface FluentSourcePanelProps {
  /** Reference to the story being rendered (`story.moduleExport`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  of: any;
}

const PanelContainer = styled.div(({ theme }) => ({
  marginTop: 16,
  borderTop: `1px solid ${theme.appBorderColor ?? '#e4e4e7'}`,
  background: theme.background?.content ?? '#ffffff',
}));

const TabBar = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  background: theme.background.app,
  borderBottom: `1px solid ${theme.appBorderColor}`,
}));

const TabButton = styled.button<{ active: boolean }>(({ active, theme }) => ({
  appearance: 'none',
  border: 0,
  background: 'transparent',
  padding: '10px 14px',
  font: 'inherit',
  fontSize: 12,
  fontWeight: active ? 700 : 500,
  color: active ? theme.color.secondary : theme.color.mediumdark,
  cursor: 'pointer',
  borderBottom: `2px solid ${active ? theme.color.secondary : 'transparent'}`,
  marginBottom: -1,
  whiteSpace: 'nowrap',
}));

/**
 * Subscribe to the native "Show code" toggle that Canvas renders inside the
 * `.docs-story` element for `storyId`. Returns the current open/closed state.
 */
function useNativeToggleState(storyId: string): boolean {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const selector = [
      `#anchor--${storyId} .docs-story .docblock-code-toggle:not(.with-code-sandbox-button)`,
      `#anchor--primary--${storyId} .docs-story .docblock-code-toggle:not(.with-code-sandbox-button)`,
    ].join(', ');

    let cleanups: Array<() => void> = [];
    let cancelled = false;

    const attach = () => {
      if (cancelled) {
        return true;
      }
      const button = document.querySelector<HTMLButtonElement>(selector);
      if (!button) {
        return false;
      }
      const onClick = () => {
        setExpanded(prev => !prev);
      };
      button.addEventListener('click', onClick);
      cleanups.push(() => button.removeEventListener('click', onClick));
      return true;
    };

    if (!attach()) {
      const interval = window.setInterval(() => {
        if (attach()) {
          window.clearInterval(interval);
        }
      }, 100);
      cleanups.push(() => window.clearInterval(interval));
    }

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn());
      cleanups = [];
    };
  }, [storyId]);

  return expanded;
}

/**
 * Find the canvas card (`.sbdocs-preview`) for `storyId` and append (once) a
 * portal target div as its last child. Returns the element when ready so the
 * panel renders **inside** the same bordered card as the story preview.
 */
function useCanvasPortalTarget(storyId: string): HTMLElement | null {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const anchorSelector = [`#anchor--${storyId}`, `#anchor--primary--${storyId}`].join(', ');
    let cancelled = false;
    let interval: number | undefined;
    let portalEl: HTMLDivElement | null = null;

    const attach = () => {
      if (cancelled) {
        return true;
      }
      const anchor = document.querySelector<HTMLElement>(anchorSelector);
      const card = anchor?.querySelector<HTMLElement>('.sbdocs-preview');
      if (!card) {
        return false;
      }
      let existing = card.querySelector<HTMLDivElement>(':scope > .fluent-source-portal');
      if (!existing) {
        existing = document.createElement('div');
        existing.className = 'fluent-source-portal';
        existing.style.background = 'transparent';
        existing.style.boxShadow = 'none';
        card.appendChild(existing);
      }
      portalEl = existing;
      setTarget(existing);
      return true;
    };

    if (!attach()) {
      interval = window.setInterval(() => {
        if (attach()) {
          window.clearInterval(interval!);
          interval = undefined;
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
      if (portalEl && portalEl.parentElement) {
        portalEl.parentElement.removeChild(portalEl);
      }
    };
  }, [storyId]);

  return target;
}

export const FluentSourcePanel: React.FC<FluentSourcePanelProps> = ({ of }) => {
  const { story } = useOf(of || 'story', ['story']) as { story: AnyProps };
  const expanded = useNativeToggleState(story.id);
  const portalTarget = useCanvasPortalTarget(story.id);
  const [activeTabId, setActiveTabId] = React.useState<string>('story-tsx');

  const tsxCode: string = typeof story.parameters?.fullSource === 'string' ? story.parameters.fullSource : '';
  const allCssModules: CssModule[] =
    (story.parameters?.cssModuleSources as SourceParameters | undefined)?.cssModules ?? [];

  // Only show CSS modules actually referenced in the displayed TSX
  const referencedBasenames = new Set(Array.from(tsxCode.matchAll(/([a-z][a-z0-9-]*\.module\.css)/gi), m => m[1]));
  const cssModules = referencedBasenames.size
    ? allCssModules.filter(m => referencedBasenames.has(m.name))
    : allCssModules;

  if (!expanded || !portalTarget) {
    return null;
  }
  if (!tsxCode && cssModules.length === 0) {
    return null;
  }

  type Tab = { id: string; label: string; code: string; language: 'tsx' | 'css' };
  const tabs: Tab[] = [
    { id: 'story-tsx', label: 'Story.tsx', code: tsxCode, language: 'tsx' },
    ...cssModules.map((m, i) => ({ id: `css-${i}`, label: m.name, code: m.source.trim(), language: 'css' as const })),
  ];
  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  return createPortal(
    <PanelContainer className="sb-unstyled">
      {tabs.length > 1 && (
        <TabBar role="tablist" aria-label="Source code">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab.id}
              active={tab.id === activeTab.id}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
      )}
      <div role="tabpanel">
        <SyntaxHighlighter
          key={activeTab.id}
          language={activeTab.language}
          copyable
          bordered={false}
          padded
          format={false}
          showLineNumbers={false}
          customStyle={{ background: '#ffffff' }}
        >
          {activeTab.code}
        </SyntaxHighlighter>
      </div>
    </PanelContainer>,
    portalTarget,
  );
};
