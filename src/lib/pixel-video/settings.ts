// The settings of a pixel video. There are only two: the name of a palette
// and the focus. The palette (styles.ts) gives all the colours and its
// switches. The other parts of the look are the same for all the videos:
// one square for each cell, and the same lens (see renderer.ts). Do not add
// settings for one video: add a palette.

import { findPalette } from './styles';

export interface PixelVideoSettings {
  /** The name of a palette (`palettes` in styles.ts). */
  palette: string;
  /**
   * The position of the subject, from the left (0–1). When a container
   * cuts the sides of the video, it keeps this point in the centre. The
   * element gives it to CSS as `--pixel-video-focus`.
   */
  focus: number;
}

export const DEFAULTS: Readonly<PixelVideoSettings> = Object.freeze({
  palette: 'tonal',
  focus: 0.5,
});

/** Merge partial settings on the defaults. Ignore unknown keys and wrong values. */
export function resolveSettings(settings?: Partial<PixelVideoSettings> | null): PixelVideoSettings {
  const out: PixelVideoSettings = { ...DEFAULTS };
  for (const [key, value] of Object.entries(settings ?? {})) {
    if (key === 'palette' && typeof value === 'string' && findPalette(value)) out.palette = value;
    else if (key === 'focus' && typeof value === 'number' && value >= 0 && value <= 1)
      out.focus = value;
    else console.warn(`[pixel-video] ignoring the setting "${key}": ${JSON.stringify(value)}`);
  }
  return out;
}
