

export const createVirtualElementFromClick = () => ({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
  }),
});

export const createArrowHeightStyles = () => ({});
export const createArrowStyles = () => ({});
export const createSlideStyles = () => ({});

export const PositioningConfigurationProvider = ({ children }) => children;

export const usePositioning = () => ({
  targetRef: { current: null },
  containerRef: { current: null },
  arrowRef: { current: null },
  setTarget: () => {},
  setContainer: () => {},
  setArrow: () => {},
  update: () => {},
  setOverrideTarget: () => {},
});

export const usePositioningMouseTarget = () => [null, () => {}];

export const useSafeZoneArea = () => ({
  ref: { current: null },
});

export const resolvePositioningShorthand = (shorthand) => shorthand || {};
export const mergeArrowOffset = (offset) => offset;



