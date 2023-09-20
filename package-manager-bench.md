| package manager                   | install (no cache)            | install (cache)               | node_modules size                  |     |
| --------------------------------- | ----------------------------- | ----------------------------- | ---------------------------------- | --- |
| yarn 1 - midgard (Baseline)       | 114s                          | 31s                           | 1.3 GB                             |     |
| yarn 3 (nodeLinker: node-modules) | 74s 🚅 (35% speed decrease)   | 44s 🚨 (42% speed decrease)   | 1.7 GB 🚨 (31% size increase)      |     |
| pnpm                              | 88s 🚨 (23% speed decrease)   | 28s 🚅 (10% speed increase)   | 1.1 GB 🚅 (15% size decrease)      |     |
| bun                               | 36s 🚅🚅 (68% speed increase) | 14s 🚅🚅 (54% speed increase) | 3.1 GB 🚨🚨🚨 (138% size increase) |     |

### yarn v1 - midgard

**pros:**

- works the same as normal yarn
- faster than v1

**cons:**

- ghost dependencies / potential security issues
- nohoist doesn't properly work in some use-cases (react 18 and 17 types)
- no native proper dedupe mechanism
- no native package patching
- no `workspace:*` protocol

### yarn 3

**pros:**

- relatively convenient switch for contributors
- nodeLinker node-modules is relatively easy for migration
- `workspace:*` protocol
- native package patching

**cons:**

- packages (and their binaries) installed only in root package.json don't work when executing from within workspace scope. They need to be explicitly defined per workspace `"scripts`" via `yarn run -T <binary-name>`
  - this should work with PNP mode though
- confusing behaviours when workspace packages are used within workspace configuration source - things work although they should not as nor root nor workspace package.json doesn't have specified those as dependencies
- nodeLinker pnpm triggers lots of errors (in comparison with native pnpm pm)

### pnpm (v8)

**pros:**

- excellent node_modules size reduction ( thanks to shared storage )
- zero ghost dependencies within workspaces
- `workspace:*` protocol
- nicely complements single version policy approach

  - packages (and their binaries) installed only in root package.json just work when executing from within workspace

    - `pnpm --filter @fluentui/react-text exec tsc -v` works
    - ```
        "@fluentui/scripts-prettier": "workspace:*",
        "@fluentui/scripts-storybook": "workspace:*",
        "@fluentui/scripts-babel": "workspace:*",
      ```
      adding workspace packages to root `/package.json` makes them available globally within any workspaces

- patching packages is build-in
- lerna support

**cons:**

- inconvenient switch for contributors ?

### bun (v1)

**pros:**

- install speed is superior to any existing pm
- one can use yarn v1 "as is" for task execution (incl workspaces) etc

**cons:**

- having 2 "pm" in monorepo/ci is confusing
- huge node_modules size delta
- implications how to declare dependencies

_more details:_

- every workspace dependency needs to use `workspace:*` protocol to enable hoisting
- every non workspace dependency needs to have exactly same version specified as in root package.json to properly enable hoisting
- one of reasons of significant node_modules size increase
- react-northstar doesn't uses workspaces and lerna is not supported via bun ( additional work needed to migrate N\* to bun/yarn workspaces)
  - one of reasons of significant node_modules size increase

## Summary

Based on initial benchmarks and our use cases testing it looks like we have 3 options:

- continue using yarn midgard
- switch to pnpm
- once bun ships full package manager functionality for monorepos we might consider switching
  - https://github.com/oven-sh/bun/issues/533
  - https://github.com/oven-sh/bun/issues/2450

All of those option will nicely complement to our goal to adopt single version policy.
