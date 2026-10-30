// @ts-check
/*
 * The scope of the CSS of the redesign (see "Two layout families" in
 * AGENTS.md and src/REDESIGN.md).
 *
 * Two users read this file:
 * - the Vite plugin cssLayers in astro.config.ts. It puts a CSS module
 *   in a cascade layer only when redesignCssArea() returns an area.
 * - npm run lint:css (scripts/lint-css.mjs). It lints only the CSS of
 *   the redesign. The old CSS does not obey the rules of stylelint.config.mjs.
 *
 * The rule for the components: an old component lives in
 * src/components/legacy/. Every other directory of src/components/ is
 * new. Do not add a directory in src/components/legacy/. Delete a
 * directory there when no page uses it.
 *
 * Why a list for the pages: a ported page lives in the same directory
 * as an old page, thus the path does not tell the family.
 *
 * - REDESIGN_PAGE_DIRS: the directories (and files) of src/pages/ that
 *   are ported pages. Add the directory of each page that you port (step
 *   3 and later of PLAN.md). The CSS modules in them get the layer
 *   "pages". A page at the root of src/pages/ (the home page) has no
 *   directory: add its files one by one. Never add the root itself.
 */

/** The path prefix of the old components. */
const LEGACY_COMPONENTS_PREFIX = 'legacy/';

/**
 * Paths relative to src/pages/, without a slash at the end: a directory
 * (for example 'pricing') or one file (for example '_home.module.css').
 * The home page is 'index.astro', '_graphql.ts' and the directory '_sub'.
 * The features index is 'features/index.astro', 'features/_graphql.ts' and
 * 'features/_sub' (the subpages of /features are not ported yet).
 * @type {string[]}
 */
export const REDESIGN_PAGE_DIRS = [
  'pricing',
  'editor-experience',
  'developers',
  'media',
  'ai',
  'philosophy',
  'wall',
  'contact',
  'compare',
  'case-studies',
  'blog',
  'product-updates',
  'index.astro',
  '_graphql.ts',
  'features/index.astro',
  'features/_graphql.ts',
];

/**
 * Tell if a CSS file is part of the redesign.
 * @param {string} path An absolute path or a path relative to the root of the repository.
 * @returns {'components' | 'scenes' | 'styles' | 'pages' | null} The area of the
 *   redesign, or null for old CSS.
 */
export function redesignCssArea(path) {
  const normalized = path.replaceAll('\\', '/');
  const match = normalized.match(/(?:^|\/)src\/(components|scenes|styles|pages)\/(.+)$/);
  const area = /** @type {'components' | 'scenes' | 'styles' | 'pages' | undefined} */ (match?.[1]);
  const rest = match?.[2];
  if (!area || rest === undefined) return null;

  if (area === 'components') {
    return rest.startsWith(LEGACY_COMPONENTS_PREFIX) ? null : 'components';
  }

  if (area === 'pages') {
    const ported = REDESIGN_PAGE_DIRS.some((dir) => rest === dir || rest.startsWith(`${dir}/`));
    return ported ? 'pages' : null;
  }

  return area;
}

/**
 * The globs of the CSS of the redesign, for stylelint.
 * @returns {string[]}
 */
export function redesignCssGlobs() {
  return [
    'src/components/**/*.css',
    'src/scenes/**/*.css',
    'src/styles/**/*.css',
    ...REDESIGN_PAGE_DIRS.flatMap((dir) => {
      // A file: lint it only when it is a CSS file.
      if (/\.[a-z]+$/.test(dir)) return dir.endsWith('.css') ? [`src/pages/${dir}`] : [];
      return [`src/pages/${dir}/**/*.css`];
    }),
  ];
}

/**
 * The globs of the old CSS inside the globs of redesignCssGlobs(), for stylelint.
 * @returns {string[]}
 */
export function legacyCssIgnoreGlobs() {
  return ['src/components/legacy/**'];
}
