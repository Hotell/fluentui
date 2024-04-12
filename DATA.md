## Benchmarks

### Generate API

`yarn workspace @fluentui/react-combobox just-scripts generate-api`

- `tsc -p` 1637.501874923706
- `api-extractor` 2374.7210829257965

### Type Check

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
