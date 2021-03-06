import * as React from 'react';
import { getSlotsCompat } from '@fluentui/react-utilities';
import { MenuListState } from './MenuList.types';
import { MenuListProvider } from '../../contexts/menuListContext';

/**
 * Function that renders the final JSX of the component
 */
export const renderMenuList = (state: MenuListState) => {
  const { slots, slotProps } = getSlotsCompat(state);
  const {
    onCheckedValueChange,
    checkedValues,
    toggleCheckbox,
    selectRadio,
    setFocusByFirstCharacter,
    hasIcons,
    hasCheckmarks,
  } = state;

  return (
    <MenuListProvider
      value={{
        onCheckedValueChange,
        checkedValues,
        toggleCheckbox,
        selectRadio,
        setFocusByFirstCharacter,
        hasIcons,
        hasCheckmarks,
        hasMenuListContext: true,
      }}
    >
      <slots.root {...slotProps.root}>{state.children}</slots.root>
    </MenuListProvider>
  );
};
