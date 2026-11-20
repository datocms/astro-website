import type { Theme } from '~/lib/theme';

/**
 * The colours of the OG card, one set for each theme, in the light scheme.
 *
 * The card is a PNG: satori and sharp cannot read a CSS custom property.
 * Thus this file holds the resolved values of the roles of the page ground
 * of `src/styles/tokens.css`. The values are flattened on the paper: a role
 * with an alpha becomes an opaque colour. `palette.test.ts` computes each
 * value from `tokens.css` with the token resolver and fails when this file
 * is behind: the test prints the new module. Do not add a colour that is
 * not a role of `tokens.css`.
 */
export interface OgPalette {
  /** `--surface-default`: the ground of the card. */
  paper: string;
  /** `--text-on-page`: the text and the wordmark. */
  ink: string;
  /** `--surface-accent`: the ground of the picture. */
  accent: string;
  /** `--text-on-page-muted`, on the paper: the kicker, the intro. */
  muted: string;
  /** `--text-on-page-headline-muted`, on the paper: the quiet run of the headline. */
  headlineMuted: string;
  /** `--surface-inverse-faint`, on the paper: the fill of a chip. */
  chip: string;
  /** `--text-on-accent`, on the accent: the symbol in the picture. */
  onAccent: string;
  /** `--surface-raised`: the white plate of the logo of a partner. */
  plate: string;
  /** `--border-default` of the page, on the paper: the line between the paper and the plate. */
  border: string;
  /** `--theme-pixel-highlight`: the light tone of a cover on the ink half. */
  highlight: string;
}

export const palettes: Record<Theme, OgPalette> = {
  yellow: {
    paper: '#fdfff5',
    ink: '#351615',
    accent: '#e8d855',
    muted: '#796561',
    headlineMuted: '#8f7f7a',
    chip: '#e7e5dc',
    onAccent: '#351615',
    plate: '#ffffff',
    border: '#e7e5dc',
    highlight: '#f8f2c2',
  },
  orange: {
    paper: '#fffbf5',
    ink: '#42180f',
    accent: '#f07a3d',
    muted: '#7e6159',
    headlineMuted: '#8e736b',
    chip: '#e8dfd9',
    onAccent: '#42180f',
    plate: '#ffffff',
    border: '#e8dfd9',
    highlight: '#e8d855',
  },
  green: {
    paper: '#f5fff5',
    ink: '#1a4731',
    accent: '#93d44b',
    muted: '#486e5a',
    headlineMuted: '#648674',
    chip: '#dae9dd',
    onAccent: '#1a4731',
    plate: '#ffffff',
    border: '#dae9dd',
    highlight: '#eef0a8',
  },
  purple: {
    paper: '#f6f5ff',
    ink: '#18032e',
    accent: '#9d75f7',
    muted: '#6f6180',
    headlineMuted: '#7e728e',
    chip: '#dfdcea',
    onAccent: '#18032e',
    plate: '#ffffff',
    border: '#dfdcea',
    highlight: '#d1c4ff',
  },
  blue: {
    paper: '#edfeff',
    ink: '#1a3a47',
    accent: '#50c9ed',
    muted: '#516d77',
    headlineMuted: '#668189',
    chip: '#d7eaec',
    onAccent: '#1a3a47',
    plate: '#ffffff',
    border: '#d7eaec',
    highlight: '#cbf5ee',
  },
  pink: {
    paper: '#fff7f8',
    ink: '#3f0e16',
    accent: '#f28497',
    muted: '#826065',
    headlineMuted: '#927277',
    chip: '#ebdfe1',
    onAccent: '#3f0e16',
    plate: '#ffffff',
    border: '#ebdfe1',
    highlight: '#ffd6b3',
  },
  docs: {
    paper: '#ffffff',
    ink: '#1a1923',
    accent: '#9d75f7',
    muted: '#6c6c72',
    headlineMuted: '#818186',
    chip: '#e8e8e9',
    onAccent: '#1a1923',
    plate: '#ffffff',
    border: '#e8e8e9',
    highlight: '#d1c4ff',
  },
};
