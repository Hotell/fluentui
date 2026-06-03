import 'cypress-real-events';
import * as React from 'react';
import { mount as mountBase } from '@fluentui/scripts-cypress';
import { FluentProvider } from '@fluentui/react-provider';
import { teamsLightTheme } from '@fluentui/react-theme';
import type { JSXElement } from '@fluentui/react-utilities';

import { Carousel } from '../Carousel/Carousel';
import { CarouselViewport } from '../CarouselViewport/CarouselViewport';
import { CarouselSlider } from '../CarouselSlider/CarouselSlider';
import { CarouselCard } from '../CarouselCard/CarouselCard';
import { CarouselNavContainer } from '../CarouselNavContainer/CarouselNavContainer';
import { CarouselButton, carouselButtonClassNames } from './index';

const mount = (element: JSXElement) => {
  mountBase(<FluentProvider theme={teamsLightTheme}>{element}</FluentProvider>);
};

const CarouselWithButtons: React.FC<{ defaultActiveIndex?: number }> = ({ defaultActiveIndex = 0 }) => (
  <Carousel defaultActiveIndex={defaultActiveIndex}>
    <CarouselViewport>
      <CarouselSlider cardFocus>
        <CarouselCard>Card 1</CarouselCard>
        <CarouselCard>Card 2</CarouselCard>
        <CarouselCard>Card 3</CarouselCard>
      </CarouselSlider>
    </CarouselViewport>
    <CarouselNavContainer
      next={<CarouselButton navType="next" aria-label="next slide" />}
      prev={<CarouselButton navType="prev" aria-label="previous slide" />}
    />
  </Carousel>
);

describe('CarouselButton', () => {
  it('renders prev and next CarouselButton with expected class', () => {
    mount(<CarouselWithButtons />);
    cy.get(`.${carouselButtonClassNames.root}`).should('have.length.at.least', 2);
    cy.get('[aria-label="previous slide"]').should('exist');
    cy.get('[aria-label="next slide"]').should('exist');
  });

  it('advances active index when next button is clicked', () => {
    mount(<CarouselWithButtons />);
    cy.contains('Card 1').should('be.visible');
    cy.get('[aria-label="next slide"]').realClick();
    cy.contains('Card 2').should('be.visible');
  });

  it('moves back when prev button is clicked', () => {
    mount(<CarouselWithButtons defaultActiveIndex={1} />);
    cy.contains('Card 2').should('be.visible');
    cy.get('[aria-label="previous slide"]').realClick();
    cy.contains('Card 1').should('be.visible');
  });
});
