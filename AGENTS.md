# Agent Instructions for Fluent UI Web

This file provides instructions for AI agents (e.g. OpenAI Codex, GitHub Copilot Workspace) working on this repository.

## Repository Overview

Fluent UI Web is a **Yarn monorepo** managed by [Nx](https://nx.dev/). It contains three main projects:

| Project | Package | Description |
|---|---|---|
| React Components v9 | `@fluentui/react-components` | Current, recommended component library |
| React v8 | `@fluentui/react` | Mature, widely-adopted library |
| Web Components | `@fluentui/web-components` | Web Component implementation |

Source lives under `packages/` (libraries) and `apps/` (applications/storybooks).

## Prerequisites

- **Node.js** – see `.node-version` or `.nvmrc` for the exact version
- **Yarn** – this repo uses Yarn workspaces (classic Yarn v1)

## Setup

```sh
yarn install
```

> **Note:** The `preinstall` and `postinstall` hooks in `package.json` run automatically; do not skip them.

## Common Commands

All build/test/lint tasks are executed via Nx. Replace `<project>` with the Nx project name (typically matches the npm package name, e.g. `react-button`).

### Build

```sh
# Build a single package
yarn nx run <project>:build

# Build all packages (with affected check)
yarn nx run-many -t build
```

### Test

```sh
# Test a single package
yarn nx run <project>:test

# Run tests in watch mode (useful during development)
yarn nx run <project>:test --watch
```

Tests use **Jest** with `@testing-library/react`. Test files are colocated with source files as `*.test.tsx`.

### Lint

```sh
yarn nx run <project>:lint
```

### Type Check

```sh
yarn nx run <project>:type-check
```

### Storybook (dev server)

```sh
yarn nx run <project>:storybook
```

### Format (Prettier)

```sh
yarn format
```

### Code style (Prettier + ESLint fix)

```sh
yarn nx run <project>:code-style
```

## React Components v9 – Architecture

All v9 components follow a strict **five-file pattern** inside `packages/react-components/<package>/library/src/components/<ComponentName>/`:

| File | Purpose |
|---|---|
| `<Component>.tsx` | Top-level component; calls `use*`, `use*Styles`, and `render*` |
| `<Component>.types.ts` | `ComponentProps`, `ComponentState`, and slot type definitions |
| `use<Component>.ts` | Hook that resolves props into state |
| `use<Component>Styles.styles.ts` | Griffel styles via `makeStyles` / `makeResetStyles` |
| `render<Component>.tsx` | Pure render function that maps state to JSX slots |

### Key rules

- Components are exported as `React.forwardRef` wrappers typed as `ForwardRefComponent<Props>`.
- Styles use **Griffel** (`@griffel/react`): `makeStyles`, `makeResetStyles`, `mergeClasses`. Do **not** use inline styles or CSS-in-JS from other libraries.
- Design tokens come from `@fluentui/react-theme` (`tokens.*`).
- Props / state types extend `ComponentProps<Slots>` / `ComponentState<Slots>` from `@fluentui/react-utilities`.
- Slots are declared in a `*Slots` type and resolved with `slot.always` / `slot.optional` from `@fluentui/react-utilities`.
- The render file uses `/** @jsxRuntime automatic */` and `/** @jsxImportSource @fluentui/react-jsx-runtime */` pragmas at the top.
- Class names are exported as `<componentName>ClassNames: SlotClassNames<Slots>`.
- Internal/unstable exports are suffixed with `_unstable`.

### Example skeleton

```tsx
// Button.tsx
import * as React from 'react';
import { renderButton_unstable } from './renderButton';
import { useButton_unstable } from './useButton';
import { useButtonStyles_unstable } from './useButtonStyles.styles';
import type { ButtonProps } from './Button.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

export const Button: ForwardRefComponent<ButtonProps> = React.forwardRef((props, ref) => {
  const state = useButton_unstable(props, ref);
  useButtonStyles_unstable(state);
  return renderButton_unstable(state);
}) as ForwardRefComponent<ButtonProps>;

Button.displayName = 'Button';
```

## Generating New Code

```sh
# Generate a new v9 component inside an existing package
yarn nx g @fluentui/workspace-plugin:react-component

# Generate a new v9 library package
yarn nx g @fluentui/workspace-plugin:react-library

# Interactive project starter
yarn start
```

## Changelogs

This repo uses [beachball](https://github.com/microsoft/beachball) for changelogs and versioning.

```sh
# Create a change file (required before merging a PR that touches package code)
yarn change
```

Change types allowed are `patch`, `minor`, and `prerelease` (`major` is disallowed per `beachball.config.js`). Change files are committed to the `change/` directory.

## Pull Requests

1. Branch from `master`.
2. Make your changes.
3. Run `yarn change` to generate a change file.
4. Ensure lint, type-check, and tests pass for affected packages.
5. Open a PR against `master`; reviewers are auto-assigned.

## Conformance Testing

New v9 components must pass the `isConformant` test suite from `@fluentui/react-conformance` (called in `*.test.tsx`). This validates slot contracts, ref forwarding, display names, and Griffel class names.

## Useful Links

- Docs: <https://react.fluentui.dev/>
- Nx docs: <https://nx.dev/>
- Griffel docs: <https://griffel.js.org/>
