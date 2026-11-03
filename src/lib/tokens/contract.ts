/*
 * The contract of the colour tokens: which roles exist, on which ground each
 * role sits, and the contrast that each role must have. The values come
 * from tokens.css (see src/lib/tokens/resolve.ts); this file has the rules.
 * Two users read it: src/styles/tokens.test.ts and scripts/stylelint/text-roles.mjs.
 *
 * WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text (24 px or more, or
 * 18.66 px bold). The site has no bold text under 24 px that is lighter
 * than its ground, thus a role is large only when it is a headline role.
 */

export const AA_TEXT = 4.5;
export const AA_LARGE_TEXT = 3;

export type Ground = 'page' | 'accent' | 'inverse';

export const GROUND_CLASS: Record<Ground, string> = {
  page: 'surfacePage',
  accent: 'surfaceAccent',
  inverse: 'surfaceInverse',
};

/** The main surface of a ground: the one that the ground class paints. */
export const GROUND_SURFACE: Record<Ground, string> = {
  page: '--surface-default',
  accent: '--surface-accent',
  inverse: '--surface-inverse',
};

/**
 * The tints of the page ground. They are alphas over the page, thus a text
 * role of the page must also read on each of them. `--surface-accent-muted`
 * is a strong tint: only the full text reads on it. `--surface-raised` is
 * not a tint of the page: it is the card of the accent island in the dark
 * scheme, and the pill of a diagram, which sets its own text.
 */
export const PAGE_TINTS = [
  '--surface-accent-faint',
  '--surface-accent-subtle',
  '--surface-inverse-faint',
  '--surface-field',
  '--surface-nav-active',
  '--surface-status-info',
] as const;

export const PAGE_STRONG_TINTS = ['--surface-accent-muted'] as const;

/**
 * The other surfaces of the inverse ground. Every text role of the inverse
 * ground must also read on each of them.
 */
export const INVERSE_SURFACES = ['--surface-inverse-deep'] as const;

/**
 * The surfaces that have one job. Only the listed files may use them.
 * `--surface-inverse-deep` is the footer: the page closer above it stays on
 * `--surface-inverse`, thus the end of the closer is visible. The contact
 * card also uses it: the card is darker than an inverse band below it.
 */
export const SURFACE_FILES: Record<string, string[]> = {
  '--surface-inverse-deep': [
    'src/components/FooterLinks/style.module.css',
    'src/components/FooterLegal/style.module.css',
    'src/components/PageCloser/style.module.css',
    'src/components/ContactCard/style.module.css',
  ],
};

/** The canonical text roles of each ground, with the contrast that each must have. */
export const CANONICAL_ROLES: Record<Ground, Record<string, number>> = {
  page: {
    '--text-on-page': AA_TEXT,
    '--text-on-page-soft': AA_TEXT,
    '--text-on-page-muted': AA_TEXT,
    '--text-on-page-headline-muted': AA_LARGE_TEXT,
  },
  accent: {
    '--text-on-accent': AA_TEXT,
    '--text-on-accent-soft': AA_TEXT,
    '--text-on-accent-muted': AA_TEXT,
    '--text-on-accent-headline-muted': AA_LARGE_TEXT,
  },
  inverse: {
    '--text-on-inverse-strong': AA_TEXT,
    '--text-on-inverse': AA_TEXT,
    '--text-on-inverse-soft': AA_TEXT,
    '--text-on-inverse-muted': AA_TEXT,
    '--text-on-inverse-headline-muted': AA_LARGE_TEXT,
  },
};

/**
 * The contextual roles and the canonical role that each one takes on each
 * ground. Inside a ground class the two are the same colour.
 */
export const CONTEXTUAL_ROLES: Record<string, Record<Ground, string>> = {
  '--text-primary': {
    page: '--text-on-page',
    accent: '--text-on-accent',
    inverse: '--text-on-inverse',
  },
  '--text-soft': {
    page: '--text-on-page-soft',
    accent: '--text-on-accent-soft',
    inverse: '--text-on-inverse-soft',
  },
  '--text-muted': {
    page: '--text-on-page-muted',
    accent: '--text-on-accent-muted',
    inverse: '--text-on-inverse-muted',
  },
  '--text-headline-muted': {
    page: '--text-on-page-headline-muted',
    accent: '--text-on-accent-headline-muted',
    inverse: '--text-on-inverse-headline-muted',
  },
  '--border-default': {
    page: '--border-on-page',
    accent: '--border-on-accent',
    inverse: '--border-on-inverse',
  },
  '--border-strong': {
    page: '--border-on-page-strong',
    accent: '--border-on-accent-strong',
    inverse: '--border-on-inverse-strong',
  },
};

/** The derived text roles: text on the main surface of each ground (and on the page tints). */
export const DERIVED_TEXT_ROLES = ['--text-accent', '--text-positive', '--text-negative'] as const;

/** A status: a tint with its text. The pairs sit on the page and the accent grounds. */
export const STATUS_PAIRS: [surface: string, text: string][] = [
  ['--surface-status-info', '--text-status-info'],
  ['--surface-status-positive', '--text-status-positive'],
  ['--surface-status-warning', '--text-status-warning'],
  ['--surface-nav-active', '--text-nav-active'],
];

/**
 * The button: each state is a fill with its text. The ground under the
 * button fills the slots, thus the pairs sit on the three grounds. The
 * soft hover is the solid hover.
 */
export const BUTTON_PAIRS: [surface: string, text: string][] = [
  ['--surface-button', '--text-button'],
  ['--surface-button-hover', '--text-button-hover'],
  ['--surface-button-soft', '--text-button-soft'],
  ['--surface-button-accent', '--text-button-accent'],
  ['--surface-button-accent-hover', '--text-button-accent-hover'],
];

/**
 * The roles that a headline-muted token may colour: the quiet run of a
 * two-tone headline. Only these files may use a *headline-muted token.
 */
export const HEADLINE_MUTED_FILES = [
  'src/components/Headline/style.module.css',
  'src/components/UserExperience/style.module.css',
  'src/components/ChapterHeader/style.module.css',
  'src/components/ContentSource/style.module.css',
  'src/components/Community/style.module.css',
  'src/components/ProductUpdates/style.module.css',
  'src/components/QuestionAnswer/style.module.css',
  'src/components/TextWithImage/style.module.css',
];

/** The code card: its text roles on `--code-background`. */
export const CODE_ROLES: Record<string, number> = {
  '--code-plain': AA_TEXT,
  '--code-keyword': AA_TEXT,
  '--code-string': AA_TEXT,
  '--code-constant': AA_TEXT,
  '--code-function': AA_TEXT,
  '--code-punctuation': AA_TEXT,
  '--code-comment': AA_TEXT,
  '--code-line-number': AA_TEXT,
};

/**
 * The values that `color` may take in a component stylesheet (the lint).
 * A token of a text role, a code colour, or a keyword. A local custom
 * property (`--btnFg`) is allowed when every value that the same file gives
 * it is in this list.
 */
export const TEXT_COLOR_TOKEN = /^var\(--(text-[\w-]+|code-(?!background)[\w-]+|added-text)\)$/;
export const TEXT_COLOR_KEYWORDS = [
  'currentcolor',
  'inherit',
  'transparent',
  'initial',
  'unset',
  'revert',
  'none',
];

/**
 * A rule that paints one of these surfaces as its background sets `color`
 * in the same rule, to a role of that ground.
 */
export const GROUND_PAINT: Record<string, RegExp> = {
  '--surface-accent': /^var\(--text-on-accent(-[\w-]+)?\)$/,
  '--surface-inverse': /^var\(--text-on-inverse(-[\w-]+)?\)$/,
  '--surface-inverse-deep': /^var\(--text-on-inverse(-[\w-]+)?\)$/,
  '--code-background': /^var\(--code-[\w-]+\)$/,
};

/**
 * The pills: a surface as text, on a fill that is a text colour. The
 * audit checks the ink pill (the page surface on the primary text). A rule
 * that uses one of these surfaces as `color` also sets the fill, in the
 * same rule, to one of the listed tokens.
 */
export const PILL_TEXT: Record<string, string[]> = {
  '--surface-default': ['--text-primary', '--text-on-page', '--text-on-accent'],
  '--surface-inverse': ['--text-on-inverse-strong', '--text-on-inverse', '--surface-accent'],
  '--surface-accent': ['--surface-inverse'],
};

/**
 * A ground that comes with the viewport or a state (the split header, a
 * hovered row) cannot take a ground class: the rule sets a contextual role
 * to the canonical role of the same kind
 * (`--text-headline-muted: var(--text-on-accent-headline-muted)`). This is
 * the only `--text-*` or `--border-*` declaration allowed outside tokens.css.
 */
export function canonicalFor(contextual: string): string[] {
  const byGround = CONTEXTUAL_ROLES[contextual];
  return byGround ? Object.values(byGround) : [];
}
