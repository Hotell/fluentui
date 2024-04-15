/// <reference types="react" />

import type { ActiveDescendantContextValue } from '@fluentui/react-aria';
import { ActiveDescendantImperativeRef } from '@fluentui/react-aria';
import type { ComponentProps } from '@fluentui/react-utilities';
import type { ComponentState } from '@fluentui/react-utilities';
import { ContextSelector } from '@fluentui/react-context-selector';
import type { ExtractSlotProps } from '@fluentui/react-utilities';
import { FC } from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { PortalProps } from '@fluentui/react-portal';
import type { PositioningShorthand } from '@fluentui/react-positioning';
import { Provider } from 'react';
import { ProviderProps } from 'react';
import * as React_2 from 'react';
import type { Slot } from '@fluentui/react-utilities';
import { SlotClassNames } from '@fluentui/react-utilities';
import type { SlotComponentType } from '@fluentui/react-utilities';

/**
 * Combobox component: a selection control that allows users to choose from a set of possible options
 */
export declare const Combobox: ForwardRefComponent<ComboboxProps>;

declare type ComboboxBaseContextValues = {
    combobox: ComboboxContextValue;
    activeDescendant: ActiveDescendantContextValue;
    listbox: ListboxContextValue;
};

/**
 * Data for the Combobox onOpenChange event.
 */
declare type ComboboxBaseOpenChangeData = {
    open: boolean;
};

declare type ComboboxBaseOpenEvents = React_2.MouseEvent<HTMLElement> | React_2.KeyboardEvent<HTMLElement> | React_2.FocusEvent<HTMLElement>;

/**
 * ComboboxBase Props
 * Shared types between Combobox and Dropdown components
 */
export declare type ComboboxBaseProps = SelectionProps & Pick<PortalProps, 'mountNode'> & {
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
export declare type ComboboxBaseState = Required<Pick<ComboboxBaseProps, 'appearance' | 'open' | 'clearable' | 'inlinePopup' | 'size'>> & Pick<ComboboxBaseProps, 'mountNode' | 'placeholder' | 'value' | 'multiselect'> & OptionCollectionState & SelectionState & {
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
    ignoreNextBlur: React_2.MutableRefObject<boolean>;
    /**
     * @deprecated - no longer used internally
     */
    setActiveOption: React_2.Dispatch<React_2.SetStateAction<OptionValue | undefined>>;
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
    onOptionClick: (e: React_2.MouseEvent<HTMLElement>) => void;
    disabled: boolean;
    freeform: boolean;
};

export declare const comboboxClassNames: SlotClassNames<ComboboxSlots>;

/**
 * Context shared with Combobox, Listbox, & Options
 */
export declare type ComboboxContextValue = Pick<ComboboxState, 'activeOption' | 'appearance' | 'focusVisible' | 'open' | 'registerOption' | 'setActiveOption' | 'setOpen' | 'size'> & {
    /**
     * @deprecated - no longer used
     */
    selectedOptions: ComboboxState['selectedOptions'];
    /**
     * @deprecated - no longer used
     */
    selectOption: ComboboxState['selectOption'];
};

export declare type ComboboxContextValues = ComboboxBaseContextValues;

export declare type ComboboxOpenChangeData = ComboboxBaseOpenChangeData;

export declare type ComboboxOpenEvents = ComboboxBaseOpenEvents;

/**
 * Combobox Props
 */
export declare type ComboboxProps = Omit<ComponentProps<Partial<ComboboxSlots>, 'input'>, 'children' | 'size'> & ComboboxBaseProps & {
    freeform?: boolean;
    children?: React_2.ReactNode;
};

/**
 * @deprecated - render ListboxProvider instead
 * @see ListboxProvider
 * @see useListboxContext_unstable
 */
export declare const ComboboxProvider: Provider<ComboboxContextValue> & FC<ProviderProps<ComboboxContextValue>>;

export declare type ComboboxSlots = {
    root: NonNullable<Slot<'div'>>;
    expandIcon: Slot<'span'>;
    clearIcon?: Slot<'span'>;
    input: NonNullable<Slot<'input'>>;
    listbox?: Slot<typeof Listbox>;
};

/**
 * State used in rendering Combobox
 */
export declare type ComboboxState = ComponentState<ComboboxSlots> & ComboboxBaseState & {
    showClearIcon?: boolean;
    activeDescendantController: ActiveDescendantImperativeRef;
};

/**
 * Dropdown component: a selection control that allows users to choose from a set of possible options
 */
export declare const Dropdown: ForwardRefComponent<DropdownProps>;

export declare const dropdownClassNames: SlotClassNames<DropdownSlots>;

export declare type DropdownContextValues = ComboboxBaseContextValues;

export declare type DropdownOpenChangeData = ComboboxBaseOpenChangeData;

export declare type DropdownOpenEvents = ComboboxBaseOpenEvents;

/**
 * Dropdown Props
 */
export declare type DropdownProps = ComponentProps<Partial<DropdownSlots>, 'button'> & ComboboxBaseProps;

export declare type DropdownSlots = {
    root: NonNullable<Slot<'div'>>;
    expandIcon?: Slot<'span'>;
    clearButton?: Slot<'button'>;
    button: NonNullable<Slot<'button'>>;
    listbox?: Slot<typeof Listbox>;
};

/**
 * State used in rendering Dropdown
 */
export declare type DropdownState = ComponentState<DropdownSlots> & Omit<ComboboxBaseState, 'freeform'> & {
    placeholderVisible: boolean;
    showClearButton?: boolean;
    activeDescendantController: ActiveDescendantImperativeRef;
};

/**
 * Listbox component: a standalone selection control, or the popup in a Combobox
 */
export declare const Listbox: ForwardRefComponent<ListboxProps>;

export declare const listboxClassNames: SlotClassNames<ListboxSlots>;

/**
 * Context shared with all Listbox Options
 */
export declare type ListboxContextValue = Pick<ListboxState, 'activeOption' | 'focusVisible' | 'multiselect' | 'registerOption' | 'selectedOptions' | 'selectOption' | 'setActiveOption'> & {
    onOptionClick: (e: React_2.MouseEvent<HTMLElement>) => void;
};

export declare type ListboxContextValues = {
    listbox: ListboxContextValue;
    activeDescendant: ActiveDescendantContextValue;
};

/**
 * Listbox Props
 */
export declare type ListboxProps = ComponentProps<ListboxSlots> & SelectionProps;

export declare const ListboxProvider: React_2.Provider<ListboxContextValue | undefined> & React_2.FC<React_2.ProviderProps<ListboxContextValue | undefined>>;

export declare type ListboxSlots = {
    root: Slot<'div'>;
};

/**
 * State used in rendering Listbox
 */
export declare type ListboxState = ComponentState<ListboxSlots> & OptionCollectionState & Pick<SelectionProps, 'multiselect'> & SelectionState & {
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

/**
 * Option component: a styled child option of a Combobox
 */
declare const Option_2: ForwardRefComponent<OptionProps>;
export { Option_2 as Option }

export declare const optionClassNames: SlotClassNames<OptionSlots>;

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

/**
 * OptionGroup component: allows grouping of Option components within a Combobox
 */
export declare const OptionGroup: ForwardRefComponent<OptionGroupProps>;

export declare const optionGroupClassNames: SlotClassNames<OptionGroupSlots>;

/**
 * OptionGroup Props
 */
export declare type OptionGroupProps = ComponentProps<Partial<OptionGroupSlots>>;

export declare type OptionGroupSlots = {
    root: NonNullable<Slot<'div'>>;
    label?: Slot<'span'>;
};

/**
 * State used in rendering OptionGroup
 */
export declare type OptionGroupState = ComponentState<OptionGroupSlots>;

export declare type OptionOnSelectData = {
    optionValue: string | undefined;
    optionText: string | undefined;
    selectedOptions: string[];
};

/**
 * Option Props
 */
export declare type OptionProps = ComponentProps<Partial<OptionSlots>> & {
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
    children?: React_2.ReactNode;
});

export declare type OptionSlots = {
    root: NonNullable<Slot<'div'>>;
    checkIcon: Slot<'span'>;
};

/**
 * State used in rendering Option
 */
export declare type OptionState = ComponentState<OptionSlots> & Pick<OptionProps, 'disabled'> & {
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

/**
 * Render the final JSX of Combobox
 */
export declare const renderCombobox_unstable: (state: ComboboxState, contextValues: ComboboxContextValues) => JSX.Element;

/**
 * Render the final JSX of Dropdown
 */
export declare const renderDropdown_unstable: (state: DropdownState, contextValues: DropdownContextValues) => JSX.Element;

/**
 * Render the final JSX of Listbox
 */
export declare const renderListbox_unstable: (state: ListboxState, contextValues: ListboxContextValues) => JSX.Element;

/**
 * Render the final JSX of Option
 */
export declare const renderOption_unstable: (state: OptionState) => JSX.Element;

/**
 * Render the final JSX of OptionGroup
 */
export declare const renderOptionGroup_unstable: (state: OptionGroupState) => JSX.Element;

export declare type SelectionEvents = React_2.ChangeEvent<HTMLElement> | React_2.KeyboardEvent<HTMLElement> | React_2.MouseEvent<HTMLElement>;

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

/**
 * @internal
 * useButtonTriggerSlot returns a tuple of trigger/listbox shorthand,
 * with the semantics and event handlers needed for the Combobox and Dropdown components.
 * The element type of the ref should always match the element type used in the trigger shorthand.
 */
export declare function useButtonTriggerSlot(triggerFromProps: NonNullable<Slot<'button'>>, ref: React_2.Ref<HTMLButtonElement>, options: UseButtonTriggerSlotOptions): SlotComponentType<ExtractSlotProps<Slot<'button'>>>;

declare type UseButtonTriggerSlotOptions = {
    state: UseTriggerSlotState;
    defaultProps: unknown;
    activeDescendantController: ActiveDescendantImperativeRef;
};

/**
 * Create the state required to render Combobox.
 *
 * The returned state can be modified with hooks such as useComboboxStyles_unstable,
 * before being passed to renderCombobox_unstable.
 *
 * @param props - props from this instance of Combobox
 * @param ref - reference to root HTMLElement of Combobox
 */
export declare const useCombobox_unstable: (props: ComboboxProps, ref: React_2.Ref<HTMLInputElement>) => ComboboxState;

/**
 * @internal
 * State shared between Combobox and Dropdown components
 */
export declare const useComboboxBaseState: (props: ComboboxBaseProps & {
    children?: React_2.ReactNode;
    editable?: boolean;
    disabled?: boolean;
    freeform?: boolean;
    activeDescendantController: ActiveDescendantImperativeRef;
}) => ComboboxBaseState;

export declare function useComboboxContextValues(state: Omit<ComboboxBaseState, 'freeform'> & Pick<ComboboxState, 'activeDescendantController'>): ComboboxBaseContextValues;

/**
 * @internal
 */
export declare function useComboboxFilter<T extends {
    children: React_2.ReactNode;
    value: string;
} | string>(query: string, options: T[], config: UseComboboxFilterConfig<T>): JSX.Element[];

declare type UseComboboxFilterConfig<T extends {
    children: React_2.ReactNode;
    value: string;
} | string> = {
    /** Provides a custom filter for the option. */
    filter?: (optionText: string, query: string) => boolean;
    /** Provides a custom message to display when there are no options. */
    noOptionsMessage?: React_2.ReactNode;
    /** Provides a way to map an option object to a React key. By default, "value" is used. */
    optionToReactKey?: (option: T) => string;
    /** Provides a way to map an option object to a text used for search. By default, "value" is used. */
    optionToText?: (option: T) => string;
    /** Provides a custom render for the option. */
    renderOption?: (option: T) => JSX.Element;
};

/**
 * Apply styling to the Combobox slots based on the state
 */
export declare const useComboboxStyles_unstable: (state: ComboboxState) => ComboboxState;

declare type UsedComboboxState = UseTriggerSlotState & Pick<ComboboxBaseState, 'value' | 'setValue' | 'selectedOptions' | 'clearSelection' | 'getOptionById'>;

/**
 * Create the state required to render Dropdown.
 *
 * The returned state can be modified with hooks such as useDropdownStyles_unstable,
 * before being passed to renderDropdown_unstable.
 *
 * @param props - props from this instance of Dropdown
 * @param ref - reference to root HTMLElement of Dropdown
 */
export declare const useDropdown_unstable: (props: DropdownProps, ref: React_2.Ref<HTMLButtonElement>) => DropdownState;

/**
 * Apply styling to the Dropdown slots based on the state
 */
export declare const useDropdownStyles_unstable: (state: DropdownState) => DropdownState;

/**
 * @internal
 * useInputTriggerSlot returns a tuple of trigger/listbox shorthand,
 * with the semantics and event handlers needed for the Combobox and Dropdown components.
 * The element type of the ref should always match the element type used in the trigger shorthand.
 */
export declare function useInputTriggerSlot(triggerFromProps: NonNullable<Slot<'input'>>, ref: React_2.Ref<HTMLInputElement>, options: UseInputTriggerSlotOptions): SlotComponentType<ExtractSlotProps<Slot<'input'>>>;

declare type UseInputTriggerSlotOptions = {
    state: UsedComboboxState;
    freeform: boolean | undefined;
    defaultProps?: Partial<ComboboxProps>;
    activeDescendantController: ActiveDescendantImperativeRef;
};

/**
 * Create the state required to render Listbox.
 *
 * The returned state can be modified with hooks such as useListboxStyles_unstable,
 * before being passed to renderListbox_unstable.
 *
 * @param props - props from this instance of Listbox
 * @param ref - reference to root HTMLElement of Listbox
 */
export declare const useListbox_unstable: (props: ListboxProps, ref: React_2.Ref<HTMLElement>) => ListboxState;

export declare const useListboxContext_unstable: <T>(selector: ContextSelector<ListboxContextValue, T>) => T;

export declare function useListboxContextValues(state: ListboxState): ListboxContextValues;

/**
 * @internal
 * @returns  listbox slot with desired behaviour and props
 */
export declare function useListboxSlot(listboxSlotFromProp: Slot<typeof Listbox> | undefined, ref: React_2.Ref<HTMLDivElement>, options: UseListboxSlotOptions): SlotComponentType<ExtractSlotProps<Slot<typeof Listbox>>> | undefined;

declare type UseListboxSlotOptions = {
    state: UseListboxSlotState;
    triggerRef: React_2.RefObject<HTMLInputElement> | React_2.RefObject<HTMLButtonElement>;
    defaultProps?: Partial<ListboxProps>;
};

declare type UseListboxSlotState = Pick<ComboboxBaseState, 'multiselect'>;

/**
 * Apply styling to the Listbox slots based on the state
 */
export declare const useListboxStyles_unstable: (state: ListboxState) => ListboxState;

/**
 * Create the state required to render Option.
 *
 * The returned state can be modified with hooks such as useOptionStyles_unstable,
 * before being passed to renderOption_unstable.
 *
 * @param props - props from this instance of Option
 * @param ref - reference to root HTMLElement of Option
 */
export declare const useOption_unstable: (props: OptionProps, ref: React_2.Ref<HTMLElement>) => OptionState;

/**
 * Create the state required to render OptionGroup.
 *
 * The returned state can be modified with hooks such as useOptionGroupStyles_unstable,
 * before being passed to renderOptionGroup_unstable.
 *
 * @param props - props from this instance of OptionGroup
 * @param ref - reference to root HTMLElement of OptionGroup
 */
export declare const useOptionGroup_unstable: (props: OptionGroupProps, ref: React_2.Ref<HTMLElement>) => OptionGroupState;

/**
 * Apply styling to the OptionGroup slots based on the state
 */
export declare const useOptionGroupStyles_unstable: (state: OptionGroupState) => OptionGroupState;

/**
 * Apply styling to the Option slots based on the state
 */
export declare const useOptionStyles_unstable: (state: OptionState) => OptionState;

declare type UseTriggerSlotState = Pick<ComboboxBaseState, 'open' | 'getOptionById' | 'selectOption' | 'setOpen' | 'multiselect' | 'setHasFocus'>;

export { }
