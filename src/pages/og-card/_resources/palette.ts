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
  /** `--text-on-accent-muted`, on the accent: the kicker of the card. */
  accentMuted: string;
  /** `--text-on-accent-headline-muted`, on the accent: the quiet run of the headline. */
  accentHeadlineMuted: string;
  /** `--border-on-accent-strong`, on the accent: the outline of a chip. */
  accentBorder: string;
  /** `--surface-inverse`: the ground of the proof half. */
  inverse: string;
  /** `--text-on-inverse-strong`, on the inverse: the large text of the proof. */
  onInverseStrong: string;
  /** `--text-on-inverse-muted`, on the inverse: the label of the proof. */
  onInverseMuted: string;
  /** `--border-on-inverse-strong`, on the inverse: the edge of a window. */
  inverseBorder: string;
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
    accentMuted: '#6b5028',
    accentHeadlineMuted: '#866d32',
    accentBorder: '#351615',
    inverse: '#351615',
    onInverseStrong: '#fdfff5',
    onInverseMuted: '#b29e42',
    inverseBorder: '#8f7735',
  },
  orange: {
    paper: '#fffbf5',
    ink: '#1d0d08',
    accent: '#f07a3d',
    muted: '#655954',
    headlineMuted: '#776c67',
    chip: '#e4ded8',
    onAccent: '#1d0d08',
    plate: '#ffffff',
    border: '#e4ded8',
    highlight: '#e8d855',
    accentMuted: '#30170d',
    accentHeadlineMuted: '#5e2f18',
    accentBorder: '#1d0d08',
    inverse: '#1d0d08',
    onInverseStrong: '#fffbf5',
    onInverseMuted: '#db6f38',
    inverseBorder: '#874423',
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
    accentMuted: '#265534',
    accentHeadlineMuted: '#3e7139',
    accentBorder: '#1a4731',
    inverse: '#1a4731',
    onInverseStrong: '#f5fff5',
    onInverseMuted: '#82c047',
    inverseBorder: '#578e3e',
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
    accentMuted: '#2f1650',
    accentHeadlineMuted: '#4c2f7c',
    accentBorder: '#18032e',
    inverse: '#18032e',
    onInverseStrong: '#f6f5ff',
    onInverseMuted: '#8c66dd',
    inverseBorder: '#5b3c93',
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
    accentMuted: '#204b5b',
    accentHeadlineMuted: '#2b687c',
    accentBorder: '#1a3a47',
    inverse: '#1a3a47',
    onInverseStrong: '#edfeff',
    onInverseMuted: '#47b2d2',
    inverseBorder: '#35829a',
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
    accentMuted: '#5d222c',
    accentHeadlineMuted: '#7f3844',
    accentBorder: '#3f0e16',
    inverse: '#3f0e16',
    onInverseStrong: '#fff7f8',
    onInverseMuted: '#d06e7e',
    inverseBorder: '#994957',
  },
  docs: {
    paper: '#ffffff',
    ink: '#1b1b1b',
    accent: '#f07a3d',
    muted: '#6d6d6d',
    headlineMuted: '#828282',
    chip: '#e8e8e8',
    onAccent: '#1b1b1b',
    plate: '#ffffff',
    border: '#e8e8e8',
    highlight: '#e8d855',
    accentMuted: '#2e241e',
    accentHeadlineMuted: '#613a26',
    accentBorder: '#1b1b1b',
    inverse: '#1b1b1b',
    onInverseStrong: '#ffffff',
    onInverseMuted: '#df723a',
    inverseBorder: '#864b2c',
  },
};
