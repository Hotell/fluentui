/**
 * `Toc` — Table of contents sidebar for docs pages.
 * Uses Storybook's `styled` (emotion) for provider-agnostic rendering.
 */
/* eslint-disable @nx/workspace-no-restricted-globals */
import * as React from 'react';
import { addons } from 'storybook/manager-api';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
import { styled } from 'storybook/theming';
import type { JSXElement } from '@fluentui/react-utilities';

export const nameToHash = (id: string): string => id.toLowerCase().replace(/[^a-z0-9]/gi, '-');

type TocItem = { name: string; id: string; selected?: boolean };

const navigate = (url: string) => {
  addons.getChannel().emit(NAVIGATE_URL, url);
};

const Nav = styled.nav({
  top: '64px',
  position: 'sticky',
  marginLeft: '40px',
});

const Heading = styled.h3({
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  marginBottom: '20px',
});

const List = styled.ol({
  position: 'relative',
  listStyleType: 'none',
  marginLeft: 0,
  marginTop: 0,
  paddingInlineStart: '20px',
  '& li': {
    marginBottom: '15px',
    lineHeight: '16px',
  },
  '& a': {
    textDecorationLine: 'none',
    color: '#201F1E',
    fontSize: '14px',
    ':hover': {
      color: '#201F1E',
    },
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    height: '100%',
    width: '3px',
    backgroundColor: '#EDEBE9',
    borderRadius: '4px',
  },
});

const SelectedItem = styled.li(({ theme }) => ({
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    left: '-20px',
    top: 0,
    bottom: 0,
    width: '3px',
    backgroundColor: theme.color.secondary,
    borderRadius: '4px',
  },
}));

export const Toc = ({ stories }: { stories: TocItem[] }): JSXElement => {
  const [selected, setSelected] = React.useState('');
  const isNavigating = React.useRef<boolean>(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (isNavigating.current) {
          isNavigating.current = false;
          return;
        }
        for (const entry of entries) {
          const { intersectionRatio, target } = entry;
          if (intersectionRatio > 0.5) {
            setSelected(target.id);
            return;
          }
        }
      },
      {
        threshold: [0.5],
      },
    );

    stories.forEach(link => {
      const element = document.getElementById(nameToHash(link.name));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [stories]);

  const tocItems = stories.map(item => {
    return { ...item, selected: nameToHash(item.name) === selected };
  });

  return (
    <Nav>
      <Heading>On this page</Heading>
      <List>
        {tocItems.map(s => {
          const name = nameToHash(s.name);
          const ListItem = s.selected ? SelectedItem : 'li';
          return (
            <ListItem key={s.id}>
              <a
                href={`#${name}`}
                target="_self"
                onClick={() => {
                  isNavigating.current = true;
                  navigate(`#${name}`);
                  setSelected(name);
                }}
              >
                {s.name}
              </a>
            </ListItem>
          );
        })}
      </List>
    </Nav>
  );
};
