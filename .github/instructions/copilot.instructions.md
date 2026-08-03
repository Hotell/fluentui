---
applyTo: "**"
---

# GitHub Copilot Instructions – Fluent UI Web

## Project overview

Fluent UI Web is a **Yarn + Nx monorepo** that ships three React/Web-Component libraries.  
The active, recommended library is **React Components v9** (`@fluentui/react-components`).  
Source lives under `packages/` (libraries) and `apps/` (storybooks / demo apps).

---

## React Components v9 – component anatomy

Every v9 component lives in `packages/react-components/<package>/library/src/components/<Name>/` and follows a strict five-file pattern:

| File | Responsibility |
|---|---|
| `<Name>.tsx` | `React.forwardRef` wrapper; calls `use*`, `use*Styles`, and `render*` |
| `<Name>.types.ts` | `*Slots`, `*Props`, `*State` type definitions |
| `use<Name>.ts` | Resolves props → state; calls slot helpers |
| `use<Name>Styles.styles.ts` | Griffel styles (`makeStyles` / `makeResetStyles` / `mergeClasses`) |
| `render<Name>.tsx` | Pure render function; maps state slots to JSX |

### Component entry (`<Name>.tsx`)

```tsx
import * as React from 'react';
import { render<Name>_unstable } from './render<Name>';
import { use<Name>_unstable } from './use<Name>';
import { use<Name>Styles_unstable } from './use<Name>Styles.styles';
import type { <Name>Props } from './<Name>.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

export const <Name>: ForwardRefComponent<<Name>Props> = React.forwardRef((props, ref) => {
  const state = use<Name>_unstable(props, ref);
  use<Name>Styles_unstable(state);
  return render<Name>_unstable(state);
}) as ForwardRefComponent<<Name>Props>;

<Name>.displayName = '<Name>';
```

### Types (`<Name>.types.ts`)

```ts
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type <Name>Slots = {
  root: NonNullable<Slot<'div'>>;
  // additional optional slots here
};

export type <Name>Props = ComponentProps<<Name>Slots> & {
  // public props with JSDoc
};

export type <Name>State = ComponentState<<Name>Slots> &
  Required<Pick<<Name>Props, 'propA' | 'propB'>>;
```

### Hook (`use<Name>.ts`)

```ts
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';
import type { <Name>Props, <Name>State } from './<Name>.types';

export const use<Name>_unstable = (props: <Name>Props, ref: React.Ref<HTMLElement>): <Name>State => {
  const { propA = 'default' } = props;
  return {
    propA,
    components: { root: 'div' },
    root: slot.always(getIntrinsicElementProps('div', { ...props, ref }), { elementType: 'div' }),
  };
};
```

### Styles (`use<Name>Styles.styles.ts`)

```ts
import { makeStyles, makeResetStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import type { SlotClassNames } from '@fluentui/react-utilities';
import type { <Name>Slots, <Name>State } from './<Name>.types';

export const <camelName>ClassNames: SlotClassNames<<Name>Slots> = {
  root: 'fui-<Name>',
};

const useRootBaseClassName = makeResetStyles({
  // base reset styles
});

const useStyles = makeStyles({
  // variant styles
});

export const use<Name>Styles_unstable = (state: <Name>State): <Name>State => {
  const baseClassName = useRootBaseClassName();
  const styles = useStyles();
  state.root.className = mergeClasses(
    <camelName>ClassNames.root,
    baseClassName,
    state.root.className,
  );
  return state;
};
```

### Render function (`render<Name>.tsx`)

```tsx
/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { <Name>Slots, <Name>State } from './<Name>.types';

export const render<Name>_unstable = (state: <Name>State) => {
  assertSlots<<Name>Slots>(state);
  return <state.root />;
};
```

---

## Key conventions

- **Styling**: Griffel only (`makeStyles`, `makeResetStyles`, `mergeClasses`). Never use inline styles or other CSS-in-JS.
- **Tokens**: Always use `tokens.*` from `@fluentui/react-theme` for colors, spacing, typography, etc.
- **Slots**: Use `slot.always` for required slots, `slot.optional` for optional ones (from `@fluentui/react-utilities`).
- **Exports**: Public API exports from the package `index.ts`; internal/unstable names end in `_unstable`.
- **Class names**: Export a `<camelName>ClassNames` constant typed as `SlotClassNames<Slots>` with `fui-<Name>` root and `fui-<Name>__<slotName>` for sub-slots.
- **JSX runtime**: Render files use `@fluentui/react-jsx-runtime` (custom JSX import source pragmas required).
- **React**: Always import as `import * as React from 'react'` (not default import).

---

## Testing

- Tests live alongside source: `<Name>.test.tsx`
- Use `@testing-library/react` (`render`, queries) and `@testing-library/user-event`.
- Call `isConformant` (from the local `src/testing/isConformant.ts` helper) for every new v9 component – it validates slot contracts, ref forwarding, display names, and Griffel classes.
- Snapshot serializer: `@griffel/jest-serializer` (configured in `jest.config.js`).

```tsx
import { isConformant } from '../../testing/isConformant';
import { <Name> } from './<Name>';

describe('<Name>', () => {
  isConformant({ Component: <Name>, displayName: '<Name>' });

  it('renders correctly', () => {
    const { getByRole } = render(<<Name> />);
    // assertions
  });
});
```

---

## Changelogs

Run `yarn change` after touching any package source to generate a beachball change file. Change type options: `patch`, `minor`, `prerelease` (never `major`).

---

## Useful commands

```sh
yarn nx run <project>:build        # compile TypeScript
yarn nx run <project>:test         # Jest tests
yarn nx run <project>:lint         # ESLint
yarn nx run <project>:type-check   # tsc type checking
yarn nx run <project>:storybook    # local Storybook dev server
yarn format                        # Prettier across repo

# Scaffolding
yarn nx g @fluentui/workspace-plugin:react-component   # new component in existing package
yarn nx g @fluentui/workspace-plugin:react-library     # new package
```
