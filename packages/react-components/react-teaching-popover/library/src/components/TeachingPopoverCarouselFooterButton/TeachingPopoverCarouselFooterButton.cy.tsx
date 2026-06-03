import 'cypress-real-events';
import * as React from 'react';
import { mount as mountBase } from '@fluentui/scripts-cypress';
import { FluentProvider } from '@fluentui/react-provider';
import { teamsLightTheme } from '@fluentui/react-theme';
import type { JSXElement } from '@fluentui/react-utilities';

import { TeachingPopover } from '../TeachingPopover/TeachingPopover';
import { TeachingPopoverTrigger } from '../TeachingPopoverTrigger/TeachingPopoverTrigger';
import { TeachingPopoverSurface } from '../TeachingPopoverSurface/TeachingPopoverSurface';
import { TeachingPopoverBody } from '../TeachingPopoverBody/TeachingPopoverBody';
import { TeachingPopoverTitle } from '../TeachingPopoverTitle/TeachingPopoverTitle';
import { TeachingPopoverCarousel } from '../TeachingPopoverCarousel/TeachingPopoverCarousel';
import { TeachingPopoverCarouselCard } from '../TeachingPopoverCarouselCard/TeachingPopoverCarouselCard';
import { TeachingPopoverCarouselFooter } from '../TeachingPopoverCarouselFooter/TeachingPopoverCarouselFooter';
import { teachingPopoverCarouselFooterButtonClassNames } from './useTeachingPopoverCarouselFooterButtonStyles.styles';
import type { TeachingPopoverProps } from '../TeachingPopover/TeachingPopover.types';

const mount = (element: JSXElement) => {
  mountBase(<FluentProvider theme={teamsLightTheme}>{element}</FluentProvider>);
};

const CarouselHarness: React.FC<{ appearance?: TeachingPopoverProps['appearance'] }> = ({ appearance }) => (
  <TeachingPopover appearance={appearance}>
    <TeachingPopoverTrigger>
      <button type="button">Open</button>
    </TeachingPopoverTrigger>
    <TeachingPopoverSurface>
      <TeachingPopoverCarousel defaultValue="1">
        <TeachingPopoverCarouselCard value="1">
          <TeachingPopoverBody>
            <TeachingPopoverTitle>Page 1</TeachingPopoverTitle>
            <div>Slide one</div>
          </TeachingPopoverBody>
        </TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselCard value="2">
          <TeachingPopoverBody>
            <TeachingPopoverTitle>Page 2</TeachingPopoverTitle>
            <div>Slide two</div>
          </TeachingPopoverBody>
        </TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselCard value="3">
          <TeachingPopoverBody>
            <TeachingPopoverTitle>Page 3</TeachingPopoverTitle>
            <div>Slide three</div>
          </TeachingPopoverBody>
        </TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselFooter next="Next" previous="Previous" initialStepText="Close" finalStepText="Finish" />
      </TeachingPopoverCarousel>
    </TeachingPopoverSurface>
  </TeachingPopover>
);

describe('TeachingPopoverCarouselFooterButton', () => {
  it('renders footer buttons with expected class when popover is opened', () => {
    mount(<CarouselHarness />);
    cy.contains('button', 'Open').realClick();
    cy.contains('Slide one').should('be.visible');
    cy.get(`.${teachingPopoverCarouselFooterButtonClassNames.root}`).should('have.length.at.least', 2);
  });

  it('navigates through slides when next/previous are clicked', () => {
    mount(<CarouselHarness />);
    cy.contains('button', 'Open').realClick();
    cy.contains('Slide one').should('be.visible');
    cy.contains('button', 'Next').realClick();
    cy.contains('Slide two').should('be.visible');
    cy.contains('button', 'Next').realClick();
    cy.contains('Slide three').should('be.visible');
    cy.contains('button', 'Previous').realClick();
    cy.contains('Slide two').should('be.visible');
  });

  it('applies brand styling without breaking navigation', () => {
    mount(<CarouselHarness appearance="brand" />);
    cy.contains('button', 'Open').realClick();
    cy.contains('Slide one').should('be.visible');
    cy.contains('button', 'Next').realClick();
    cy.contains('Slide two').should('be.visible');
  });
});
