import 'cypress-real-events';
import * as React from 'react';
import { mount as mountBase } from '@fluentui/scripts-cypress';
import { FluentProvider } from '@fluentui/react-provider';
import { teamsLightTheme } from '@fluentui/react-theme';
import type { JSXElement } from '@fluentui/react-utilities';

import { Calendar } from './Calendar';
import { calendarClassNames } from './useCalendarStyles.styles';
import { calendarDayClassNames } from '../CalendarDay/useCalendarDayStyles.styles';
import { calendarPickerClassNames } from '../CalendarPicker/useCalendarPickerStyles.styles';

const mount = (element: JSXElement) => {
  mountBase(<FluentProvider theme={teamsLightTheme}>{element}</FluentProvider>);
};

describe('Calendar', () => {
  it('renders Calendar with day, day grid and picker classes', () => {
    mount(<Calendar value={new Date(2024, 0, 15)} today={new Date(2024, 0, 15)} />);

    cy.get(`.${calendarClassNames.root}`).should('exist');
    cy.get(`.${calendarDayClassNames.root}`).should('exist');
    cy.get(`.${calendarPickerClassNames.root}`).should('exist');
    cy.contains('button', /^20$/).should('exist');
  });

  it('selects a day when clicked', () => {
    const onSelectDate = cy.stub().as('onSelectDate');
    mount(
      <Calendar
        value={new Date(2024, 0, 15)}
        today={new Date(2024, 0, 15)}
        onSelectDate={(date, range) => onSelectDate(date, range)}
      />,
    );

    cy.get('button').contains(/^20$/).realClick();
    cy.get('@onSelectDate').should('have.been.called');
  });

  it('navigates between month and year picker', () => {
    mount(<Calendar value={new Date(2024, 0, 15)} today={new Date(2024, 0, 15)} highlightCurrentMonth />);

    // open year picker by clicking the current item header button
    cy.get(`.${calendarPickerClassNames.currentItemButton}`).first().realClick();

    // some year cell becomes visible
    cy.contains('button', '2024').should('exist');
  });
});
