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
  /** `--text-on-page`: the text, the wordmark, the figure of the picture. */
  ink: string;
  /** `--surface-accent`: the ground of the picture. */
  accent: string;
  /** `--text-on-page-muted`, on the paper: the kicker, the intro. */
  muted: string;
  /** `--text-on-page-headline-muted`, on the paper: the quiet run of the headline. */
  headlineMuted: string;
  /** `--surface-inverse-faint`, on the paper: the fill of a chip. */
  chip: string;
  /** The line of a scene frame: `color-mix(in oklab, accent 65%, ink)`. The grid of the picture. */
  frameLine: string;
  /** `--text-on-accent-muted`, on the accent: the mid tone of a logo in the picture. */
  inkOnAccentMuted: string;
}

export const palettes: Record<Theme, OgPalette> = {
  default: {
    paper: '#fdfff5',
    ink: '#351615',
    accent: '#e7d864',
    muted: '#715c58',
    headlineMuted: '#8f7f7a',
    chip: '#e7e5dc',
    frameLine: '#a58e48',
    inkOnAccentMuted: '#6a502d',
  },
  orange: {
    paper: '#fffbf5',
    ink: '#42180f',
    accent: '#f09063',
    muted: '#73534b',
    headlineMuted: '#8e736b',
    chip: '#e8dfd9',
    frameLine: '#af6343',
    inkOnAccentMuted: '#552518',
  },
  green: {
    paper: '#f5fff5',
    ink: '#1a4731',
    accent: '#93c95b',
    muted: '#446a56',
    headlineMuted: '#648674',
    chip: '#dae9dd',
    frameLine: '#67994e',
    inkOnAccentMuted: '#214f34',
  },
  purple: {
    paper: '#f6f5ff',
    ink: '#1d2229',
    accent: '#aaa0ef',
    muted: '#585b63',
    headlineMuted: '#74767f',
    chip: '#e0dfe9',
    frameLine: '#7471a4',
    inkOnAccentMuted: '#2e3141',
  },
  blue: {
    paper: '#edfeff',
    ink: '#1a3a47',
    accent: '#58c6e7',
    muted: '#48656f',
    headlineMuted: '#668189',
    chip: '#d7eaec',
    frameLine: '#4192ab',
    inkOnAccentMuted: '#214b5a',
  },
  pink: {
    paper: '#fff5fc',
    ink: '#3c0a35',
    accent: '#ef89cf',
    muted: '#775171',
    headlineMuted: '#906f8b',
    chip: '#ebdde8',
    frameLine: '#ac5a95',
    inkOnAccentMuted: '#632657',
  },
};
