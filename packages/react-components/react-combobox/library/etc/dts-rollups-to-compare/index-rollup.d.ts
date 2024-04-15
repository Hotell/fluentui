/// <reference types="react" />
import * as React from 'react';
import { Slot, ComponentProps, ComponentState, ForwardRefComponent, SlotClassNames, SlotComponentType, ExtractSlotProps } from '@fluentui/react-utilities';
import { ActiveDescendantImperativeRef, ActiveDescendantContextValue } from '@fluentui/react-aria';
import { PositioningShorthand } from '@fluentui/react-positioning';
import { PortalProps } from '@fluentui/react-portal';
import { ContextSelector } from '@fluentui/react-context-selector';

declare type OptionValue = {
    /** The disabled state of the option. */
    disabled?: boolean;
    /** The `id` attribute of the option. */
    id: string;
    /** The `text` string for the option. */
    text: string;
    /** The value string of the option. */
    value: string;
};
declare type OptionCollectionState = {
    /**
     * @deprecated - no longer used internally
     */
    getIndexOfId(id: string): number;
    /**
     * @deprecated - no longer used internally
     */
    getOptionAtIndex(index: number): OptionValue | undefined;
    /**
     * @deprecated - no longer used internally
     */
    getOptionsMatchingText(matcher: (text: string) => boolean): OptionValue[];
    /** The total number of options in the collection. */
    getCount: () => number;
    /** Returns the option data by key. */
    getOptionById(id: string): OptionValue | undefined;
    /** Returns an array of options filtered by a value matching function against the option's value string. */
    getOptionsMatchingValue(matcher: (value: string) => boolean): OptionValue[];
    /** The unordered option data. */
    options: OptionValue[];
    registerOption: (option: OptionValue, element: HTMLElement) => () => void;
};

declare type SelectionProps = {
    /**
     * For an uncontrolled component, sets the initial selection.
     * If this is set, the `defaultValue` prop MUST also be set.
     */
    defaultSelectedOptions?: string[];
    /**
     * Sets the selection type to multiselect.
     * Set this to true for multiselect, even if fully controlling selection state.
     * This enables styles and accessibility properties to be set.
     * @default false
     */
    multiselect?: boolean;
    onOptionSelect?: (event: SelectionEvents, data: OptionOnSelectData) => void;
    /**
     * An array of selected option keys.
     * Use this with `onOptionSelect` to directly control the selected option(s)
     * If this is set, the `value` prop MUST also be controlled.
     */
    selectedOptions?: string[];
};
declare type SelectionState = {
    clearSelection: (event: SelectionEvents) => void;
    selectedOptions: string[];
    selectOption: (event: SelectionEvents, option: OptionValue) => void;
};
declare type OptionOnSelectData = {
    optionValue: string | undefined;
    optionText: string | undefined;
    selectedOptions: string[];
};
declare type SelectionEvents = React.ChangeEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>;

declare type ListboxSlots = {
    root: Slot<'div'>;
};
/**
 * Listbox Props
 */
declare type ListboxProps = ComponentProps<ListboxSlots> & SelectionProps;
/**
 * State used in rendering Listbox
 */
declare type ListboxState = ComponentState<ListboxSlots> & OptionCollectionState & Pick<SelectionProps, 'multiselect'> & SelectionState & {
    /**
     * @deprecated - no longer used internally
     * @see activeDescendantController.active()
     */
    activeOption?: OptionValue;
    /**
     * @deprecated - no longer used internally
     */
    focusVisible: boolean;
    /**
     * @deprecated - no longer used internally
     * @see activeDescendantController.focus(id)
     */
    setActiveOption(option?: OptionValue): void;
    selectOption(event: SelectionEvents, option: OptionValue): void;
    activeDescendantController: ActiveDescendantImperativeRef;
};
declare type ListboxContextValues = {
    listbox: ListboxContextValue;
    activeDescendant: ActiveDescendantContextValue;
};

/**
 * Context shared with all Listbox Options
 */
declare type ListboxContextValue = Pick<ListboxState, 'activeOption' | 'focusVisible' | 'multiselect' | 'registerOption' | 'selectedOptions' | 'selectOption' | 'setActiveOption'> & {
    onOptionClick: (e: React.MouseEvent<HTMLElement>) => void;
};
declare const useListboxContext_unstable: <T>(selector: ContextSelector<ListboxContextValue, T>) => T;
declare const ListboxProvider: React.Provider<ListboxContextValue | undefined> & React.FC<React.ProviderProps<ListboxContextValue | undefined>>;

/**
 * ComboboxBase Props
 * Shared types between Combobox and Dropdown components
 */
declare type ComboboxBaseProps = SelectionProps & Pick<PortalProps, 'mountNode'> & {
    /**
     * Controls the colors and borders of the combobox trigger.
     * @default 'outline'
     */
    appearance?: 'filled-darker' | 'filled-lighter' | 'outline' | 'underline';
    /**
     * If set, the combobox will show an icon to clear the current value.
     */
    clearable?: boolean;
    /**
     * The default open state when open is uncontrolled
     */
    defaultOpen?: boolean;
    /**
     * The default value displayed in the trigger input or button when the combobox's value is uncontrolled
     */
    defaultValue?: string;
    /**
     * Render the combobox's popup inline in the DOM.
     * This has accessibility benefits, particularly for touch screen readers.
     */
    inlinePopup?: boolean;
    /**
     * Callback when the open/closed state of the dropdown changes
     */
    onOpenChange?: (e: ComboboxBaseOpenEvents, data: ComboboxBaseOpenChangeData) => void;
    /**
     * Sets the open/closed state of the dropdown.
     * Use together with onOpenChange to fully control the dropdown's visibility
     */
    open?: boolean;
    /**
     * If set, the placeholder will show when no value is selected
     */
    placeholder?: string;
    /**
     * Configure the positioning of the combobox dropdown
     *
     * @defaultvalue below
     */
    positioning?: PositioningShorthand;
    /**
     * Controls the size of the combobox faceplate
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * The value displayed by the Combobox.
     * Use this with `onOptionSelect` to directly control the displayed value string
     */
    value?: string;
};
/**
 * State used in rendering Combobox
 */
declare type ComboboxBaseState = Required<Pick<ComboboxBaseProps, 'appearance' | 'open' | 'clearable' | 'inlinePopup' | 'size'>> & Pick<ComboboxBaseProps, 'mountNode' | 'placeholder' | 'value' | 'multiselect'> & OptionCollectionState & SelectionState & {
    /**
     * @deprecated - no longer used internally
     */
    activeOption?: OptionValue;
    /**
     * @deprecated - no longer used internally and handled automatically be activedescendant utilities
     * @see ACTIVEDESCENDANT_FOCUSVISIBLE_ATTRIBUTE for writing styles involving focusVisible
     */
    focusVisible: boolean;
    /**
     * @deprecated - no longer used internally
     * Whether the next blur event should be ignored, and the combobox/dropdown will not close.
     */
    ignoreNextBlur: React.MutableRefObject<boolean>;
    /**
     * @deprecated - no longer used internally
     */
    setActiveOption: React.Dispatch<React.SetStateAction<OptionValue | undefined>>;
    /**
     * @deprecated - no longer used internally and handled automatically be activedescendant utilities
     * @see useSetKeyboardNavigation for imperatively setting focus visible state
     */
    setFocusVisible(focusVisible: boolean): void;
    /**
     * whether the combobox/dropdown currently has focus
     */
    hasFocus: boolean;
    setHasFocus(hasFocus: boolean): void;
    setOpen(event: ComboboxBaseOpenEvents, newState: boolean): void;
    setValue(newValue: string | undefined): void;
    onOptionClick: (e: React.MouseEvent<HTMLElement>) => void;
    disabled: boolean;
    freeform: boolean;
};
/**
 * Data for the Combobox onOpenChange event.
 */
declare type ComboboxBaseOpenChangeData = {
    open: boolean;
};
declare type ComboboxBaseOpenEvents = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | React.FocusEvent<HTMLElement>;
declare type ComboboxBaseContextValues = {
    combobox: ComboboxContextValue;
    activeDescendant: ActiveDescendantContextValue;
    listbox: ListboxContextValue;
};

/**
 * Listbox component: a standalone selection control, or the popup in a Combobox
 */
declare const Listbox: ForwardRefComponent<ListboxProps>;

declare type ComboboxSlots = {
    root: NonNullable<Slot<'div'>>;
    expandIcon: Slot<'span'>;
    clearIcon?: Slot<'span'>;
    input: NonNullable<Slot<'input'>>;
    listbox?: Slot<typeof Listbox>;
};
/**
 * Combobox Props
 */
declare type ComboboxProps = Omit<ComponentProps<Partial<ComboboxSlots>, 'input'>, 'children' | 'size'> & ComboboxBaseProps & {
    freeform?: boolean;
    children?: React.ReactNode;
};
/**
 * State used in rendering Combobox
 */
declare type ComboboxState = ComponentState<ComboboxSlots> & ComboboxBaseState & {
    showClearIcon?: boolean;
    activeDescendantController: ActiveDescendantImperativeRef;
};
declare type ComboboxContextValues = ComboboxBaseContextValues;
declare type ComboboxOpenChangeData = ComboboxBaseOpenChangeData;
declare type ComboboxOpenEvents = ComboboxBaseOpenEvents;

/**
 * Context shared with Combobox, Listbox, & Options
 */
declare type ComboboxContextValue = Pick<ComboboxState, 'activeOption' | 'appearance' | 'focusVisible' | 'open' | 'registerOption' | 'setActiveOption' | 'setOpen' | 'size'> & {
    /**
     * @deprecated - no longer used
     */
    selectedOptions: ComboboxState['selectedOptions'];
    /**
     * @deprecated - no longer used
     */
    selectOption: ComboboxState['selectOption'];
};
/**
 * @deprecated - render ListboxProvider instead
 * @see ListboxProvider
 * @see useListboxContext_unstable
 */
declare const ComboboxProvider: React.Provider<ComboboxContextValue> & React.FC<React.ProviderProps<ComboboxContextValue>>;

/**
 * Combobox component: a selection control that allows users to choose from a set of possible options
 */
declare const Combobox: ForwardRefComponent<ComboboxProps>;

/**
 * Render the final JSX of Combobox
 */
declare const renderCombobox_unstable: (state: ComboboxState, contextValues: ComboboxContextValues) => JSX.Element;

/**
 * Create the state required to render Combobox.
 *
 * The returned state can be modified with hooks such as useComboboxStyles_unstable,
 * before being passed to renderCombobox_unstable.
 *
 * @param props - props from this instance of Combobox
 * @param ref - reference to root HTMLElement of Combobox
 */
declare const useCombobox_unstable: (props: ComboboxProps, ref: React.Ref<HTMLInputElement>) => ComboboxState;

declare const comboboxClassNames: SlotClassNames<ComboboxSlots>;
/**
 * Apply styling to the Combobox slots based on the state
 */
declare const useComboboxStyles_unstable: (state: ComboboxState) => ComboboxState;

declare function useComboboxContextValues(state: Omit<ComboboxBaseState, 'freeform'> & Pick<ComboboxState, 'activeDescendantController'>): ComboboxBaseContextValues;

declare function useListboxContextValues(state: ListboxState): ListboxContextValues;

/** @jsxRuntime automatic */

/**
 * Render the final JSX of Listbox
 */
declare const renderListbox_unstable: (state: ListboxState, contextValues: ListboxContextValues) => JSX.Element;

/**
 * Create the state required to render Listbox.
 *
 * The returned state can be modified with hooks such as useListboxStyles_unstable,
 * before being passed to renderListbox_unstable.
 *
 * @param props - props from this instance of Listbox
 * @param ref - reference to root HTMLElement of Listbox
 */
declare const useListbox_unstable: (props: ListboxProps, ref: React.Ref<HTMLElement>) => ListboxState;

declare const listboxClassNames: SlotClassNames<ListboxSlots>;
/**
 * Apply styling to the Listbox slots based on the state
 */
declare const useListboxStyles_unstable: (state: ListboxState) => ListboxState;

declare type OptionSlots = {
    root: NonNullable<Slot<'div'>>;
    checkIcon: Slot<'span'>;
};
/**
 * Option Props
 */
declare type OptionProps = ComponentProps<Partial<OptionSlots>> & {
    /**
     * Sets an option to the `disabled` state.
     * Disabled options cannot be selected, but are still keyboard navigable
     */
    disabled?: boolean;
    value?: string;
} & ({
    /**
     * An optional override the string value of the Option's display text,
     * defaulting to the Option's child content.
     * This is used as the Dropdown button's or Combobox input's value when the option is selected,
     * and as the comparison for type-to-find keyboard functionality.
     */
    text?: string;
    children: string;
} | {
    /**
     * The string value of the Option's display text when the Option's children are not a string.
     * This is used as the Dropdown button's or Combobox input's value when the option is selected,
     * and as the comparison for type-to-find keyboard functionality.
     */
    text: string;
    children?: React.ReactNode;
});
/**
 * State used in rendering Option
 */
declare type OptionState = ComponentState<OptionSlots> & Pick<OptionProps, 'disabled'> & {
    /**
     * @deprecated - no longer used internally
     */
    active: boolean;
    /**
     * @deprecated - no longer used internally
     */
    focusVisible: boolean;
    multiselect?: boolean;
    selected: boolean;
};

/**
 * Option component: a styled child option of a Combobox
 */
declare const Option: ForwardRefComponent<OptionProps>;

/** @jsxRuntime automatic */

/**
 * Render the final JSX of Option
 */
declare const renderOption_unstable: (state: OptionState) => JSX.Element;

/**
 * Create the state required to render Option.
 *
 * The returned state can be modified with hooks such as useOptionStyles_unstable,
 * before being passed to renderOption_unstable.
 *
 * @param props - props from this instance of Option
 * @param ref - reference to root HTMLElement of Option
 */
declare const useOption_unstable: (props: OptionProps, ref: React.Ref<HTMLElement>) => OptionState;

declare const optionClassNames: SlotClassNames<OptionSlots>;
/**
 * Apply styling to the Option slots based on the state
 */
declare const useOptionStyles_unstable: (state: OptionState) => OptionState;

declare type DropdownSlots = {
    root: NonNullable<Slot<'div'>>;
    expandIcon?: Slot<'span'>;
    clearButton?: Slot<'button'>;
    button: NonNullable<Slot<'button'>>;
    listbox?: Slot<typeof Listbox>;
};
/**
 * Dropdown Props
 */
declare type DropdownProps = ComponentProps<Partial<DropdownSlots>, 'button'> & ComboboxBaseProps;
/**
 * State used in rendering Dropdown
 */
declare type DropdownState = ComponentState<DropdownSlots> & Omit<ComboboxBaseState, 'freeform'> & {
    placeholderVisible: boolean;
    showClearButton?: boolean;
    activeDescendantController: ActiveDescendantImperativeRef;
};
declare type DropdownContextValues = ComboboxBaseContextValues;
declare type DropdownOpenEvents = ComboboxBaseOpenEvents;
declare type DropdownOpenChangeData = ComboboxBaseOpenChangeData;

/**
 * Dropdown component: a selection control that allows users to choose from a set of possible options
 */
declare const Dropdown: ForwardRefComponent<DropdownProps>;

/** @jsxRuntime automatic */

/**
 * Render the final JSX of Dropdown
 */
declare const renderDropdown_unstable: (state: DropdownState, contextValues: DropdownContextValues) => JSX.Element;

/**
 * Create the state required to render Dropdown.
 *
 * The returned state can be modified with hooks such as useDropdownStyles_unstable,
 * before being passed to renderDropdown_unstable.
 *
 * @param props - props from this instance of Dropdown
 * @param ref - reference to root HTMLElement of Dropdown
 */
declare const useDropdown_unstable: (props: DropdownProps, ref: React.Ref<HTMLButtonElement>) => DropdownState;

declare const dropdownClassNames: SlotClassNames<DropdownSlots>;
/**
 * Apply styling to the Dropdown slots based on the state
 */
declare const useDropdownStyles_unstable: (state: DropdownState) => DropdownState;

declare type OptionGroupSlots = {
    root: NonNullable<Slot<'div'>>;
    label?: Slot<'span'>;
};
/**
 * OptionGroup Props
 */
declare type OptionGroupProps = ComponentProps<Partial<OptionGroupSlots>>;
/**
 * State used in rendering OptionGroup
 */
declare type OptionGroupState = ComponentState<OptionGroupSlots>;

/**
 * OptionGroup component: allows grouping of Option components within a Combobox
 */
declare const OptionGroup: ForwardRefComponent<OptionGroupProps>;

/** @jsxRuntime automatic */

/**
 * Render the final JSX of OptionGroup
 */
declare const renderOptionGroup_unstable: (state: OptionGroupState) => JSX.Element;

/**
 * Create the state required to render OptionGroup.
 *
 * The returned state can be modified with hooks such as useOptionGroupStyles_unstable,
 * before being passed to renderOptionGroup_unstable.
 *
 * @param props - props from this instance of OptionGroup
 * @param ref - reference to root HTMLElement of OptionGroup
 */
declare const useOptionGroup_unstable: (props: OptionGroupProps, ref: React.Ref<HTMLElement>) => OptionGroupState;

declare const optionGroupClassNames: SlotClassNames<OptionGroupSlots>;
/**
 * Apply styling to the OptionGroup slots based on the state
 */
declare const useOptionGroupStyles_unstable: (state: OptionGroupState) => OptionGroupState;

declare type UseComboboxFilterConfig<T extends {
    children: React.ReactNode;
    value: string;
} | string> = {
    /** Provides a custom filter for the option. */
    filter?: (optionText: string, query: string) => boolean;
    /** Provides a custom message to display when there are no options. */
    noOptionsMessage?: React.ReactNode;
    /** Provides a way to map an option object to a React key. By default, "value" is used. */
    optionToReactKey?: (option: T) => string;
    /** Provides a way to map an option object to a text used for search. By default, "value" is used. */
    optionToText?: (option: T) => string;
    /** Provides a custom render for the option. */
    renderOption?: (option: T) => JSX.Element;
};
/**
 * @internal
 */
declare function useComboboxFilter<T extends {
    children: React.ReactNode;
    value: string;
} | string>(query: string, options: T[], config: UseComboboxFilterConfig<T>): JSX.Element[];

/**
 * @internal
 * State shared between Combobox and Dropdown components
 */
declare const useComboboxBaseState: (props: ComboboxBaseProps & {
    children?: React.ReactNode;
    editable?: boolean;
    disabled?: boolean;
    freeform?: boolean;
    activeDescendantController: ActiveDescendantImperativeRef;
}) => ComboboxBaseState;

declare type UseTriggerSlotState = Pick<ComboboxBaseState, 'open' | 'getOptionById' | 'selectOption' | 'setOpen' | 'multiselect' | 'setHasFocus'>;

declare type UseButtonTriggerSlotOptions = {
    state: UseTriggerSlotState;
    defaultProps: unknown;
    activeDescendantController: ActiveDescendantImperativeRef;
};
/**
 * @internal
 * useButtonTriggerSlot returns a tuple of trigger/listbox shorthand,
 * with the semantics and event handlers needed for the Combobox and Dropdown components.
 * The element type of the ref should always match the element type used in the trigger shorthand.
 */
declare function useButtonTriggerSlot(triggerFromProps: NonNullable<Slot<'button'>>, ref: React.Ref<HTMLButtonElement>, options: UseButtonTriggerSlotOptions): SlotComponentType<ExtractSlotProps<Slot<'button'>>>;

declare type UsedComboboxState = UseTriggerSlotState & Pick<ComboboxBaseState, 'value' | 'setValue' | 'selectedOptions' | 'clearSelection' | 'getOptionById'>;
declare type UseInputTriggerSlotOptions = {
    state: UsedComboboxState;
    freeform: boolean | undefined;
    defaultProps?: Partial<ComboboxProps>;
    activeDescendantController: ActiveDescendantImperativeRef;
};
/**
 * @internal
 * useInputTriggerSlot returns a tuple of trigger/listbox shorthand,
 * with the semantics and event handlers needed for the Combobox and Dropdown components.
 * The element type of the ref should always match the element type used in the trigger shorthand.
 */
declare function useInputTriggerSlot(triggerFromProps: NonNullable<Slot<'input'>>, ref: React.Ref<HTMLInputElement>, options: UseInputTriggerSlotOptions): SlotComponentType<ExtractSlotProps<Slot<'input'>>>;

declare type UseListboxSlotState = Pick<ComboboxBaseState, 'multiselect'>;
declare type UseListboxSlotOptions = {
    state: UseListboxSlotState;
    triggerRef: React.RefObject<HTMLInputElement> | React.RefObject<HTMLButtonElement>;
    defaultProps?: Partial<ListboxProps>;
};
/**
 * @internal
 * @returns  listbox slot with desired behaviour and props
 */
declare function useListboxSlot(listboxSlotFromProp: Slot<typeof Listbox> | undefined, ref: React.Ref<HTMLDivElement>, options: UseListboxSlotOptions): SlotComponentType<ExtractSlotProps<Slot<typeof Listbox>>> | undefined;

export { Combobox, type ComboboxBaseProps, type ComboboxBaseState, type ComboboxContextValue, type ComboboxContextValues, type ComboboxOpenChangeData, type ComboboxOpenEvents, type ComboboxProps, ComboboxProvider, type ComboboxSlots, type ComboboxState, Dropdown, type DropdownContextValues, type DropdownOpenChangeData, type DropdownOpenEvents, type DropdownProps, type DropdownSlots, type DropdownState, Listbox, type ListboxContextValue, type ListboxContextValues, type ListboxProps, ListboxProvider, type ListboxSlots, type ListboxState, Option, OptionGroup, type OptionGroupProps, type OptionGroupSlots, type OptionGroupState, type OptionOnSelectData, type OptionProps, type OptionSlots, type OptionState, type SelectionEvents, comboboxClassNames, dropdownClassNames, listboxClassNames, optionClassNames, optionGroupClassNames, renderCombobox_unstable, renderDropdown_unstable, renderListbox_unstable, renderOptionGroup_unstable, renderOption_unstable, useButtonTriggerSlot, useComboboxBaseState, useComboboxContextValues, useComboboxFilter, useComboboxStyles_unstable, useCombobox_unstable, useDropdownStyles_unstable, useDropdown_unstable, useInputTriggerSlot, useListboxContextValues, useListboxContext_unstable, useListboxSlot, useListboxStyles_unstable, useListbox_unstable, useOptionGroupStyles_unstable, useOptionGroup_unstable, useOptionStyles_unstable, useOption_unstable };
