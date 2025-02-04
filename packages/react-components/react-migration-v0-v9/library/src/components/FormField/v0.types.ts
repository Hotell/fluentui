type ObjectOf<T extends {}> = { [key: string]: T };
type Props<T extends {} = {}> = T & ObjectOf<any>;
type ShorthandRenderFunction<P> = (Component: React.ElementType<P>, props: P) => React.ReactNode;
export type ObjectShorthandValue<P extends Props> = Props<P> & {
  children?: P['children'] | ShorthandRenderFunction<P>;
};
