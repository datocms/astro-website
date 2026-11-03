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
    accent: '#e8d855',
    muted: '#715c58',
    headlineMuted: '#8f7f7a',
    chip: '#e7e5dc',
    frameLine: '#a68e3f',
    inkOnAccentMuted: '#6b5028',
  },
  orange: {
    paper: '#fffbf5',
    ink: '#42180f',
    accent: '#f07a3d',
    muted: '#73534b',
    headlineMuted: '#8e736b',
    chip: '#e8dfd9',
    frameLine: '#af552c',
    inkOnAccentMuted: '#522113',
  },
  green: {
    paper: '#f5fff5',
    ink: '#1a4731',
    accent: '#93d44b',
    muted: '#446a56',
    headlineMuted: '#648674',
    chip: '#dae9dd',
    frameLine: '#67a046',
    inkOnAccentMuted: '#265534',
  },
  purple: {
    paper: '#f6f5ff',
    ink: '#1d2229',
    accent: '#9e90ee',
    muted: '#585b63',
    headlineMuted: '#74767f',
    chip: '#e0dfe9',
    frameLine: '#6d67a3',
    inkOnAccentMuted: '#2c2f41',
  },
  blue: {
    paper: '#edfeff',
    ink: '#1a3a47',
    accent: '#50c9ed',
    muted: '#48656f',
    headlineMuted: '#668189',
    chip: '#d7eaec',
    frameLine: '#3d94af',
    inkOnAccentMuted: '#204b5b',
  },
  pink: {
    paper: '#fff7f8',
    ink: '#3f0e16',
    accent: '#f28497',
    muted: '#79545a',
    headlineMuted: '#927277',
    chip: '#ebdfe1',
    frameLine: '#af5866',
    inkOnAccentMuted: '#5d222c',
  },
  docs: {
    paper: '#ffffff',
    ink: '#1a1923',
    accent: '#9e90ee',
    muted: '#5f5e65',
    headlineMuted: '#818186',
    chip: '#e8e8e9',
    frameLine: '#6c63a0',
    inkOnAccentMuted: '#2a273b',
  },
};
