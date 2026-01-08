const mockMiddleware = () => ({
  name: 'mock',
  fn: () => ({}),
});

// Using a thenable instead of Promise.resolve to be extremely lightweight and avoid polyfill injection
const resolved = (val) => ({
  then: (fn) => fn(val),
});

export const computePosition = () => resolved({
  x: 0,
  y: 0,
  placement: 'bottom',
  strategy: 'absolute',
  middlewareData: {},
});

export const arrow = mockMiddleware;
export const autoPlacement = mockMiddleware;
export const flip = mockMiddleware;
export const hide = mockMiddleware;
export const offset = mockMiddleware;
export const shift = mockMiddleware;
export const limitShift = () => ({});
export const size = mockMiddleware;
export const inline = mockMiddleware;

export const detectOverflow = () => resolved({
  top: 0, bottom: 0, left: 0, right: 0
});

export const getOverflowAncestors = () => [];

export const platform = {
  getElementRects: () => ({ reference: {}, floating: {} }),
  getClippingRect: () => ({ x: 0, y: 0, width: 0, height: 0 }),
  getDimensions: () => ({ width: 0, height: 0 }),
  getOffsetParent: () => null,
  getDocumentElement: () => null,
  getScale: () => ({ x: 1, y: 1 }),
  isElement: () => resolved(true),
  isRTL: () => resolved(false),
};

export const Platform = platform;
