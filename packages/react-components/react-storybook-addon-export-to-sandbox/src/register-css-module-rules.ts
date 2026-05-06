/**
 * Enables CSS Modules with debuggable class names in a Storybook webpack config.
 *
 * css-loader v5+ auto-detects `*.module.css` files via `modules.auto: true` (its default).
 * This helper finds Storybook's built-in `\.css$` rule and sets a human-readable `localIdentName`.
 */
export function registerCssModuleRules(config: import('webpack').Configuration): void {
  const rules = config.module?.rules ?? [];

  for (const rule of rules) {
    if (!rule || typeof rule !== 'object') {
      continue;
    }
    if (!(rule.test instanceof RegExp) || rule.test.source !== /\.css$/.source) {
      continue;
    }

    const loaders = Array.isArray(rule.use) ? rule.use : [];
    const cssLoaderEntry = loaders.find(
      (entry): entry is { loader: string; options?: string | Record<string, unknown> } =>
        typeof entry === 'object' &&
        entry !== null &&
        'loader' in entry &&
        /\bcss-loader\b/.test(entry.loader as string),
    );

    if (!cssLoaderEntry) {
      throw new Error(
        'registerCssModuleRules: found the .css$ rule but it no longer contains a css-loader entry. ' +
          "Storybook's internal webpack config may have changed — please update this helper.",
      );
    }

    cssLoaderEntry.options = {
      ...(typeof cssLoaderEntry.options === 'object' ? cssLoaderEntry.options : {}),
      modules: { auto: true, localIdentName: '[name]__[local]--[hash:base64:5]' },
    };
    return;
  }

  throw new Error(
    'registerCssModuleRules: could not find the default .css$ webpack rule. ' +
      "Storybook's internal webpack config may have changed — please update this helper.",
  );
}
