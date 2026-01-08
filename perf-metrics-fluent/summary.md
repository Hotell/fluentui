# summary

> fixture is for whole [react-components suite](./build/input.js)

<!--
| area | Baseline (minified/GZIP) | PR    | Change |
| :---------------- | -----------------------: | ----: | ---------: |
| icons | `1.285 MB`<br />`321.9 kB` | `1.21 MB`<br />`314.352 kB` | `-18.494 kB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /><br />`-7.548 kB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" />|
| tabster |  `1.285 MB`<br />`321.9 kB` | `1.17 MB`<br />`303.496 kB` | `-62.721 kB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /><br />`-18.404 kB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" />|
| react-positioning | `1.285 MB`<br />`321.9 kB` | `1.23 MB`<br />`? kB` | `0.055 MB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /><br />`? kB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" />|
| @floating-ui/dom | `1.285 MB`<br />`321.9 kB` | `1.24 MB`<br />`? kB` | `0.045 MB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /><br />`? kB` <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" />|

-->

> **Retrieval of data**
>
> - every module is bundled via its mock. for example [react-icons.mock.js](./react-icons.mock.js)
> - bundled in production webpack mode

> **Packages**
>
> - fluent: `react-positioning` and `react-tabster` are fluent packages that use 3rd party floating-ui/tabster/keyborg
> - 3rd party: tabster,keyboard,floating-ui
>   - candidate for drop in replacement with lightweight/native platform alternative
>   - candidate for lazy loading architecture

## Results

- default icons used within suite have bigger impact than whole 3rd party floating-ui dependency
- biggest bundle impact is from react-tabster
-

| All React components suite                                        | Size (minified) |                                                                                      Delta (vs current) <MiB>/% |
| :---------------------------------------------------------------- | --------------: | --------------------------------------------------------------------------------------------------------------: |
| current                                                           |      `1.26 MiB` |                                                                                                             `—` |
| without default icons                                             |      `1.21 MiB` |  <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /> `-0.05 MiB` / `4.0%` |
| without react-tabster                                             |      `1.17 MiB` |  <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /> `-0.09 MiB` / `7.1%` |
| without react-positioning                                         |      `1.23 MiB` |  <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /> `-0.03 MiB` / `2.4%` |
| without floating-ui                                               |      `1.23 MiB` |  <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /> `-0.03 MiB` / `2.4%` |
| without default icons,react-tabster,floating-ui                   |       `1.1 MiB` | <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /> `-0.16 MiB` / `12.7%` |
| without default icons,react-tabster,floating-ui+react-positioning |      `1.08 MiB` | <img aria-hidden="true" src="https://microsoft.github.io/monosize/images/decrease.png" /> `-0.18 MiB` / `14.3%` |
