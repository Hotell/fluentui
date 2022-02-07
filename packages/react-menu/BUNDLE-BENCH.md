# Bundle Bench

## Execute bench on your machine

```sh
# 1. build all dependencies
yarn build --to @fluentui/react-menu

# 2. run bundle-size bench
yarn workspace @fluentui/react-menu bundle-size:bench
```

## Package(react-menu) Bundles

```
┌───────────────────────┬───────┬─────────────┬─────────────┐
│        (index)        │  raw  │     min     │    gzip     │
├───────────────────────┼───────┼─────────────┼─────────────┤
│       rollup.js       │ 53237 │ '53.237 kB' │ '10.623 kB' │
│     rollup.min.js     │ 20314 │ '20.314 kB' │ '6.041 kB'  │
│      esbuild.js       │ 52335 │ '52.335 kB' │ '9.335 kB'  │
│    esbuild.min.js     │ 24959 │ '24.959 kB' │ '7.321 kB'  │
│ esbuild-terser.min.js │ 24987 │ '24.987 kB' │ '7.067 kB'  │
└───────────────────────┴───────┴─────────────┴─────────────┘
```

## App(Fixture) Bundles

### Bundle with transpiled only files

```
Webpack:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 102840 │ '102.84 kB'  │ '31.718 kB' │
│ Menu.Selectable.min.js │ 105091 │ '105.091 kB' │ '32.083 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
ESBuild:
┌───────────────────────────────┬────────┬──────────────┬─────────────┐
│            (index)            │  raw   │     min      │    gzip     │
├───────────────────────────────┼────────┼──────────────┼─────────────┤
│          Menu.min.js          │ 162135 │ '162.135 kB' │ '44.363 kB' │
│      Menu-terser.min.js       │ 161264 │ '161.264 kB' │ '43.386 kB' │
│    Menu.Selectable.min.js     │ 164581 │ '164.581 kB' │ '45.012 kB' │
│ Menu.Selectable-terser.min.js │ 163709 │ '163.709 kB' │ '43.89 kB'  │
└───────────────────────────────┴────────┴──────────────┴─────────────┘
Rollup:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 120390 │ '120.39 kB'  │ '36.878 kB' │
│ Menu.Selectable.min.js │ 122636 │ '122.636 kB' │ '37.213 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
```

### Bundle with bundled package via rollup

```
Webpack:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 121837 │ '121.837 kB' │ '38.01 kB'  │
│ Menu.Selectable.min.js │ 121867 │ '121.867 kB' │ '38.025 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
ESBuild:
┌───────────────────────────────┬────────┬──────────────┬─────────────┐
│            (index)            │  raw   │     min      │    gzip     │
├───────────────────────────────┼────────┼──────────────┼─────────────┤
│          Menu.min.js          │ 162135 │ '162.135 kB' │ '44.363 kB' │
│      Menu-terser.min.js       │ 161264 │ '161.264 kB' │ '43.386 kB' │
│    Menu.Selectable.min.js     │ 164581 │ '164.581 kB' │ '45.012 kB' │
│ Menu.Selectable-terser.min.js │ 163709 │ '163.709 kB' │ '43.89 kB'  │
└───────────────────────────────┴────────┴──────────────┴─────────────┘
Rollup:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 139557 │ '139.557 kB' │ '43.082 kB' │
│ Menu.Selectable.min.js │ 139590 │ '139.59 kB'  │ '43.102 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
```

### Bundle with bundled package via esbuild

```
Webpack:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 122463 │ '122.463 kB' │ '38.139 kB' │
│ Menu.Selectable.min.js │ 122489 │ '122.489 kB' │ '38.154 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
ESBuild:
┌───────────────────────────────┬────────┬──────────────┬─────────────┐
│            (index)            │  raw   │     min      │    gzip     │
├───────────────────────────────┼────────┼──────────────┼─────────────┤
│          Menu.min.js          │ 162135 │ '162.135 kB' │ '44.363 kB' │
│      Menu-terser.min.js       │ 161264 │ '161.264 kB' │ '43.386 kB' │
│    Menu.Selectable.min.js     │ 164581 │ '164.581 kB' │ '45.012 kB' │
│ Menu.Selectable-terser.min.js │ 163709 │ '163.709 kB' │ '43.89 kB'  │
└───────────────────────────────┴────────┴──────────────┴─────────────┘
Rollup:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 140208 │ '140.208 kB' │ '43.242 kB' │
│ Menu.Selectable.min.js │ 140237 │ '140.237 kB' │ '43.262 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
```

## Summary

> **NOTE:**
>
> Results contain also postprocessing of esbuild minification via Terser, to better showcase the differences of bundle minification if any.
>
> Based on results, while Terser is able to shave some bytes off, the final result is **insignificant**

Based on our measurements we have following recommendations:

- best possible approach **how to ship package to NPM** is ship only transpiled file to vanilla javascript
- best possible approach **how to bundle packages in applications** is via using webpack
