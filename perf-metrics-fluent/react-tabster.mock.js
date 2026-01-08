const useMockHook = () => ({});
const mockFunction = () => ({});

export const useArrowNavigationGroup = useMockHook;
export const useFocusableGroup = useMockHook;
export const useFocusFinders = () => ({
  findAll: () => [],
  findFirst: () => null,
  findLast: () => null,
  findNext: () => null,
  findPrev: () => null,
  findDefault: () => null,
});
export const useFocusVisible = useMockHook;
export const useFocusWithin = useMockHook;
export const useKeyboardNavAttribute = useMockHook;
export const useDangerousNeverHidden_unstable = useMockHook;
export const useModalAttributes = useMockHook;
export const useTabsterAttributes = useMockHook;
export const useObservedElement = useMockHook;
export const useFocusObserved = useMockHook;
export const useMergedTabsterAttributes_unstable = useMockHook;
export const useRestoreFocusSource = useMockHook;
export const useRestoreFocusTarget = useMockHook;
export const useUncontrolledFocus = useMockHook;
export const useOnKeyboardNavigationChange = useMockHook;
export const useIsNavigatingWithKeyboard = useMockHook;
export const useSetKeyboardNavigation = useMockHook;
export const useFocusedElementChange = useMockHook;
export const useActivateModal = useMockHook;

export const createCustomFocusIndicatorStyle = mockFunction;
export const createFocusOutlineStyle = mockFunction;
export const applyFocusVisiblePolyfill = mockFunction;

export const KEYBORG_FOCUSIN = 'keyborg:focusin';

export const MoverMoveFocusEvent = mockFunction;
export const GroupperMoveFocusEvent = mockFunction;
export const MoverMemorizedElementEvent = mockFunction;
export const TabsterMoveFocusEvent = mockFunction;

export const dispatchGroupperMoveFocusEvent = mockFunction;
export const dispatchMoverMoveFocusEvent = mockFunction;

export const TabsterDOMAttribute = {};
export const FocusOutlineStyleOptions = {};
export const KeyborgFocusInEvent = mockFunction;

export const MoverMoveFocusEventName = 'movermovefocus';
export const GroupperMoveFocusEventName = 'grouppermovefocus';
export const MoverMemorizedElementEventName = 'movermemorizedelement';
export const TabsterMoveFocusEventName = 'tabstermovefocus';

export const MoverKeys = {
  ArrowUp: 38,
  ArrowDown: 40,
  ArrowLeft: 37,
  ArrowRight: 39,
};

export const GroupperMoveFocusActions = {
  Enter: 13,
  Escape: 27,
};
