// @ts-check
/*
 * The scope of the CSS of the site (see "Cascade layers" in
 * src/REDESIGN.md).
 *
 * Two users read this file:
 * - the Vite plugin cssLayers in astro.config.ts. It puts a CSS module
 *   in a cascade layer when cssLayerArea() returns an area.
 * - npm run lint:css (scripts/lint-css.mjs). It lints the CSS of
 *   cssGlobs() with stylelint.config.mjs.
 *
 * All CSS in src/ is in scope. The CSS modules in src/pages/ get the layer
 * "pages". All other CSS modules get the layer "sections".
 */

/**
 * Tell the area of a CSS file.
 * @param {string} path An absolute path or a path relative to the root of the repository.
 * @returns {'pages' | 'sections' | null} The area, or null for a file outside src/.
 */
export function cssLayerArea(path) {
  const normalized = path.replaceAll('\\', '/');
  const match = normalized.match(/(?:^|\/)src\/([^/]+)\//);
  if (!match) return null;
  return match[1] === 'pages' ? 'pages' : 'sections';
}

/**
 * The globs of the CSS to lint, for stylelint.
 * @returns {string[]}
 */
export function cssGlobs() {
  return ['src/**/*.css'];
}
