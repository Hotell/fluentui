## Benchmarks

### Generate API

| Command                                                        | Time                 | Delta  |
| -------------------------------------------------------------- | -------------------- | ------ |
| `just-scripts generate-api` (tsc -p + api-extractor)           | 1637 + 1993 = 3630ms | BASE   |
| `tsup --dts-only` (types need to be validated via `tsc` after) | 1922ms               | 𝚫 -48% |
| `rollup` with `dts` plugin (against source: src/index.ts)      | 4500ms               | 𝚫 +24% |
| 🥇 `rollup` with `dts` plugin (against tsc -p: src/index.d.ts) | 1637 + 225 = 1862ms  | 𝚫 -49% |

Effects on whole package build:

| Command              | Current (api-extractor) | New (rollup)        |
| -------------------- | ----------------------- | ------------------- |
| `just-scripts build` | 5.39s                   | 3.39s / 𝚫37% faster |

**Current tsc -p + api-extractor:**
`yarn workspace @fluentui/react-combobox just-scripts generate-api`

- `tsc -p` 1637.501874923706
- `api-extractor` 1993.7427909374237

_total: 3630ms_

**Using rollup dts plugin within `tsup`**

```json
{
  "tsup": {
    "entry": ["src/index.ts"],
    "dts": {
      "only": true,
      "resolve": true,
      "compilerOptions": {
        "isolatedModules": true,
        "baseUrl": ".",
        "skipLibCheck": false,
        "lib": ["ES2019", "DOM"],
        "typeRoots": ["node_modules/@types", "../../../../typings"],
        "types": ["static-assets", "environment"]
      }
    }
  }
}
```

```
DTS ⚡️ Build success in 1922ms
DTS dist/index.d.ts 22.08 KB
```

_total: 1922ms_

**Using rollup dts plugin**

config:

```js
import { dts } from 'rollup-plugin-dts';

export default {
  input: '../../../../dist/out-tsc/types/packages/react-components/react-combobox/library/src/index.d.ts', // path to your main TypeScript file
  output: {
    file: './dist/index-rollup.d.ts', // path where the output .d.ts file will be created
    format: 'es',
  },
  plugins: [dts()],
};
```

🙌 identifies circular dependencies !

```
(!) Circular dependencies
src/contexts/ComboboxContext.ts -> src/components/Combobox/Combobox.types.ts -> src/utils/ComboboxBase.types.ts -> src/contexts/ComboboxContext.ts
src/contexts/ListboxContext.ts -> src/components/Listbox/Listbox.types.ts -> src/contexts/ListboxContext.ts
```

### Type Check

| Command                                                                                | Time (library / stories) | Delta         |
| -------------------------------------------------------------------------------------- | ------------------------ | ------------- |
| `tsc -b`                                                                               | 3596ms / 2915ms          | BASE          |
| `tsc -p N` (parallel execution - avoiding build mode)                                  | 2307ms / 2200ms          | 𝚫 -36% / -25% |
| `tsc -p N` (parallel execution) + (using `incremental` within generate API step)       | 2319ms / x               | 𝚫 -35.5% / x  |
| `tsc -p N` (parallel execution) + (avoiding exec if `incremental` ran in generate-api) | 2287ms / x               | 𝚫 -36.5% / x  |

`yarn workspace @fluentui/react-combobox just-scripts type-check`

- `tsc -b`

  - library: 3596.847416162491
  - stories: 2915.9292919635773

- `tsc -p N` (parallel execution - avoiding build mode)

  - library: 2307.783874988556
  - stories: 2200.105416059494

- `tsc -p N` (parallel execution) + (using `incremental` within generate API step)
  - library: 2337.989207983017
    - this is- the same time as without incremental. That's because we run tsc -p in parallel so the tsconfig.lib.json tsc is fast (from cache) but the tsconfig.spec.json tsc is taking +- the same time, thus the same value. if we would not type-check spec/e2e files we would get more perf boost.
    - if avoiding tsconfig.spec.json -> `764.9177498817444`
  - stories: not applicable as stories don't have `generate-api`
