// The pixel videos of PageCloser. Each video has one style: not all the
// styles work with all the videos. The page selects a video and a theme,
// never the colours.

import type { PixelVideoSettings } from '~/lib/pixel-video/settings';
import { tint } from '~/lib/pixel-video/styles';

const INVERSE = 'var(--surface-inverse)';
const ACCENT = 'var(--surface-accent)';

export interface CloserVideo {
  src: string;
  /** The style and the dimensions. Without them, the settings of the file apply. */
  settings?: Partial<PixelVideoSettings>;
  /**
   * The surface that has the colour of the video background. The copy
   * above the video is on this surface, thus the two read as one block.
   */
  surface: 'accent' | 'inverse';
  /**
   * The position of the subject, from the left (0–1). On a narrow screen
   * the band cuts the sides of the video, and this point stays in the
   * centre. The default is 0.5.
   */
  focus?: number;
  /**
   * `right`: the subject comes in from the right edge of the video. The
   * closer keeps this edge on the right edge of the band.
   */
  edge?: 'right';
}

// These files have the Tonal style (dark background, accent midtones,
// light highlights) and the dimensions of the cells.
export const eyesVideo: CloserVideo = {
  src: '/videos/human-eyes.pxv',
  surface: 'inverse',
};

export const victoryVideo: CloserVideo = {
  src: '/videos/hand-victory-sign.pxv',
  surface: 'inverse',
};

// The arm comes in from the right edge. The fingers are at about 35%
// from the left.
export const pinchVideo: CloserVideo = {
  src: '/videos/italian-pinch.pxv',
  surface: 'inverse',
  edge: 'right',
  focus: 0.35,
};

// For a dark subject on a light background: the background of the source
// is the midtones, the subject is the background layer. The midtones
// become the accent surface with no grid, thus only the subject and the
// highlights show. The background layer is the subject, thus it does not
// fill the band.
const silhouette: Partial<PixelVideoSettings> = {
  bgFill: INVERSE,
  bgStroke: ACCENT,
  midFill: ACCENT,
  midStroke: ACCENT,
  highFill: 'var(--text-on-inverse-strong)',
  highStroke: ACCENT,
  extend: false,
};

// A drawing: dark outlines, a light screen and white highlights.
export const robotVideo: CloserVideo = {
  src: '/videos/loving-robot.pxv',
  settings: silhouette,
  surface: 'accent',
};

// Light squares on the accent surface. The file has no settings.
// The video is about 1320 px wide on desktop, two times the globe: thus
// the dimensions are half of the defaults.
export const waveVideo: CloserVideo = {
  src: '/videos/hand-waving.pxv',
  settings: {
    ...tint,
    bgSize: 0.6,
    midSize: 0.75,
    highSize: 0.9,
    hoverPixelSize: 1.8,
    hoverRadius: 12,
    hoverDistortion: 2.25,
    hoverFalloff: 4.5,
  },
  surface: 'accent',
  // The hand is at the left of the centre.
  focus: 0.42,
};

// Tall videos of a dancer, a dark figure on a light background. In some
// frames an arm goes out of the left edge of the source.
export const danceVideo: CloserVideo = {
  src: '/videos/crazy-dance-1.pxv',
  settings: silhouette,
  surface: 'accent',
};

export const danceTwoVideo: CloserVideo = {
  src: '/videos/crazy-dance-2.pxv',
  settings: silhouette,
  surface: 'accent',
};
