/**
 * `Disclaimer` — a configurable banner rendered above the primary story.
 * Styled with Storybook's `styled` (emotion) for provider-agnostic rendering.
 *
 * Supports a single string, an array of strings (rendered as separate blocks
 * within the same aside, separated by a dashed divider), or `true` for a
 * generic preview message.
 *
 * Each message string may optionally start with "Label:" which will be rendered
 * in bold (e.g. "Heads up: some text" → <strong>Heads up:</strong> some text).
 */
import * as React from 'react';
import { styled } from 'storybook/theming';

export interface DisclaimerProps {
  /** The disclaimer content. `true` renders a generic preview message; `string` renders custom text; `string[]` renders multiple blocks. */
  message: string | string[] | boolean;
}

const DEFAULT_MESSAGE = 'These components are in preview and their APIs are subject to change.';

const Container = styled.aside(({ theme }) => ({
  margin: '20px 0 0',
  padding: '18px 22px',
  border: `1px solid ${theme.appBorderColor}`,
  borderLeft: `4px solid ${theme.color.secondary}`,
  borderRadius: 6,
  background: `${theme.color.secondary}08`,
  color: theme.color.defaultText,
  fontSize: 15,
  lineHeight: 1.55,
}));

const MessageBlock = styled.div<{ isFirst: boolean }>(({ isFirst, theme }) => ({
  ...(isFirst
    ? {}
    : {
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px dashed ${theme.appBorderColor}`,
      }),
}));

/**
 * Renders a message string. If the string starts with "Word:" pattern,
 * the prefix is rendered in bold.
 */
function renderMessage(text: string): React.ReactNode {
  const match = text.match(/^([A-Z][^:]+:)\s*/);
  if (match) {
    return (
      <>
        <strong>{match[1]}</strong> {text.slice(match[0].length)}
      </>
    );
  }
  return text;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  const messages: string[] = Array.isArray(message)
    ? message
    : [typeof message === 'string' ? message : DEFAULT_MESSAGE];

  return (
    <Container className="sb-unstyled" role="note">
      {messages.map((text, idx) => (
        <MessageBlock key={idx} isFirst={idx === 0}>
          {renderMessage(text)}
        </MessageBlock>
      ))}
    </Container>
  );
};
