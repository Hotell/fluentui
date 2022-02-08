# Bundle Bench

## Execute bench on your machine

```sh
# 1. build all dependencies
yarn build --to @fluentui/react-menu

# 2. run bundle-size bench
yarn workspace @fluentui/react-menu bundle-size:bench
```

## Package(react-menu) Bundles

Following table shows file sizes of rolluped(bundled) and minified library files with various compilers/bundlers.

> NOTE:
> webpack library bundling is [experimental](https://github.com/webpack/webpack/issues/2933#issuecomment-774253975) and turns out the produced snapshot will not work (Only Rollup complained that something is wrong)

```
┌───────────────────────┬───────┬─────────────┬─────────────┐
│        (index)        │  raw  │     min     │    gzip     │
├───────────────────────┼───────┼─────────────┼─────────────┤
│       rollup.js       │ 53237 │ '53.237 kB' │ '10.623 kB' │
│     rollup.min.js     │ 20314 │ '20.314 kB' │ '6.041 kB'  │
│      webpack.js       │ 82299 │ '82.299 kB' │ '13.753 kB' │
│    webpack.min.js     │ 24642 │ '24.642 kB' │ '7.011 kB'  │
│      esbuild.js       │ 52335 │ '52.335 kB' │ '9.335 kB'  │
│    esbuild.min.js     │ 24959 │ '24.959 kB' │ '7.321 kB'  │
│ esbuild-terser.min.js │ 24987 │ '24.987 kB' │ '7.067 kB'  │
│        swc.js         │ 63836 │ '63.836 kB' │ '11.986 kB' │
│      swc.min.js       │ 43928 │ '43.928 kB' │ '8.637 kB'  │
└───────────────────────┴───────┴─────────────┴─────────────┘
```

## Application(Fixture) Bundles

To understand library packaging methods real impact on consumer based on their tooling we provide bundle-size benchmarks for various combination of approaches.

Every benchmark contains application fixtures build executed via following tools:

- webpack
- esbuild
- swc
- rollup

### App consuming `Transpiled files`

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
SWC:
┌────────────────────────┬─────────┬────────────┬────────────┐
│        (index)         │   raw   │    min     │    gzip    │
├────────────────────────┼─────────┼────────────┼────────────┤
│      Menu.min.js       │ 9556077 │ '9.556 MB' │ '1.562 MB' │
│ Menu.Selectable.min.js │ 9556111 │ '9.556 MB' │ '1.562 MB' │
└────────────────────────┴─────────┴────────────┴────────────┘
```

### App consuming `Rollup` bundled library

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
SWC:
┌────────────────────────┬─────────┬────────────┬────────────┐
│        (index)         │   raw   │    min     │    gzip    │
├────────────────────────┼─────────┼────────────┼────────────┤
│      Menu.min.js       │ 9602577 │ '9.603 MB' │ '1.569 MB' │
│ Menu.Selectable.min.js │ 9602586 │ '9.603 MB' │ '1.569 MB' │
└────────────────────────┴─────────┴────────────┴────────────┘
```

### App consuming `ESbuild` bundled library

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
SWC:
┌────────────────────────┬─────────┬────────────┬────────────┐
│        (index)         │   raw   │    min     │    gzip    │
├────────────────────────┼─────────┼────────────┼────────────┤
│      Menu.min.js       │ 9602873 │ '9.603 MB' │ '1.569 MB' │
│ Menu.Selectable.min.js │ 9602882 │ '9.603 MB' │ '1.569 MB' │
└────────────────────────┴─────────┴────────────┴────────────┘
```

### App consuming `swc` bundled library

```
Webpack:
┌────────────────────────┬────────┬──────────────┬─────────────┐
│        (index)         │  raw   │     min      │    gzip     │
├────────────────────────┼────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 123182 │ '123.182 kB' │ '38.26 kB'  │
│ Menu.Selectable.min.js │ 123212 │ '123.212 kB' │ '38.274 kB' │
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
│      Menu.min.js       │ 140983 │ '140.983 kB' │ '43.452 kB' │
│ Menu.Selectable.min.js │ 141016 │ '141.016 kB' │ '43.471 kB' │
└────────────────────────┴────────┴──────────────┴─────────────┘
SWC:
┌────────────────────────┬─────────┬────────────┬────────────┐
│        (index)         │   raw   │    min     │    gzip    │
├────────────────────────┼─────────┼────────────┼────────────┤
│      Menu.min.js       │ 9607505 │ '9.608 MB' │ '1.569 MB' │
│ Menu.Selectable.min.js │ 9607539 │ '9.608 MB' │ '1.569 MB' │
└────────────────────────┴─────────┴────────────┴────────────┘
```

## Summary

> **NOTE:**
>
> Results contain also postprocessing of esbuild minified bundle via Terser, to better showcase the differences of bundle minification.
>
> Based on results, while Terser is able to shave off some additional bytes, the final result is **insignificant**

### Observations based on our measurements:

_Rollup:_

- is best industry choice when bundling package(library) code into one file (smallest output)

_Webpack:_

- performs best for both use cases (transpiled only library `'31.718 kB'` vs. bundled library)
- the best result for bundled library consumption scenario is when library is bundled via `rollup.js` - `'38.01 kB'`, although the difference in comparison with using (esbuild/swc for bundling) is negligible

```
┌────────────────────────┬───────────────┬───────────┬──────────────┬─────────────┐
│                        │  transpiled   │  rollup   │     esbuild  │    swc      │
│                        │    only       │           │              │             │
├────────────────────────┼───────────────┼───────────┼──────────────┼─────────────┤
│      Menu.min.js       │ 31.718 kB     │ 38.01 kB  │ 38.139 kB    │  38.26 kB   │
└────────────────────────┴───────────────┴───────────┴──────────────┴─────────────┘
```

_SWC:_

- bundling apps with raw `swc` is very bad idea (docs explicitly mention that this should not be used in production/work in progress)
- _NOTE:_ we found some extent of bugs in the tooling during creating this benchmark

_ESBuild:_

- is fastest
- most consistent
  - same bundle size for both use cases with all scenarios (bundling application that uses transpiled only package or rollup-ed/bundled package)
- running terser to postprocess esbuild minified output improves final bundle size, but the difference is negligible

### Based on our measurements we have following recommendations:

- best possible approach **how to ship package to NPM** is ship `transpiled files to vanilla javascript without bundling`
- best possible approach **how to bundle packages in applications for production** is with `webpack`
