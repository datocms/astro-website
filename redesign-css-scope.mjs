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
 * Why lists: the components of the prototype keep the same paths here,
 * thus a path does not tell the old family from the new family.
 *
 * - LEGACY_COMPONENT_DIRS: the directories of src/components/ that are
 *   NOT from the prototype. This list is frozen. Remove a name when you
 *   delete its directory. Do not add a name: a new old component is a
 *   mistake. Every other directory of src/components/ is from the
 *   prototype, thus a new component of the prototype needs no change here.
 * - REDESIGN_PAGE_DIRS: the directories (and files) of src/pages/ that
 *   are ported pages. Add the directory of each page that you port (step
 *   3 and later of PLAN.md). The CSS modules in them get the layer
 *   "pages". A page at the root of src/pages/ (the home page) has no
 *   directory: add its files one by one. Never add the root itself.
 */

export const LEGACY_COMPONENT_DIRS = [
  'blocks',
  'Bullets',
  'CalloutCard',
  'Card',
  'Carousel',
  'Checks',
  'Code',
  'docs',
  'DraftModeQueryListener',
  'Faqs',
  'featureAnimations',
  'filtering',
  'Flag',
  'form',
  'Heading',
  'HeroShader',
  'inlineRecords',
  'IntegrationsBanner',
  'InterstitialTitle',
  'Journey',
  'JsonLd',
  'LegacyButton',
  'LegacyHero',
  'LegacyPagination',
  'LegacyProse',
  'LegacyQuote',
  'LegacyResponsiveImage',
  'LegacyStructuredText',
  'LegalProse',
  'Lightbox',
  'links',
  'linkToRecords',
  'LLMDate',
  'LogosBar',
  'Markdown',
  'MarkdownActionsDropdown',
  'pluginToolkit',
  'product-updates',
  'Result',
  'SameLevelNavigation',
  'Search',
  'SidebarPane',
  'Space',
  'StripWithContent',
  'Svg',
  'Tabs',
  'TargetToggler',
  'TitleStripWithContent',
  'Tooltip',
  'UiChrome',
  'VideoPlayer',
  'Wrapper',
];

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
  'index.astro',
  '_graphql.ts',
  'features/index.astro',
  'features/_graphql.ts',
];

const legacyComponents = new Set(LEGACY_COMPONENT_DIRS);

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
    const dir = rest.split('/')[0] ?? '';
    return legacyComponents.has(dir) ? null : 'components';
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
  return LEGACY_COMPONENT_DIRS.map((dir) => `src/components/${dir}/**`);
}
