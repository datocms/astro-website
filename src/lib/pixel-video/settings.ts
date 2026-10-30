// The look of a pixel video. The names are the same as in
// @overnice/datocms-pixel-video. The thresholds and the smoothing are not
// here: the encoder applies them (see format.ts).
//
// All the dimensions are a percentage of the width of the drawn video (the
// source, fitted in the element), not CSS px. Thus the look is the same at
// each size of the player. The Overnice lab gives px: divide them by 1% of
// the width that the video had in the lab. The stroke of the squares is not
// a setting: it is always 1 CSS px.

export interface PixelVideoSettings {
  /** Cell size of each layer, in % of the drawn width. */
  bgSize: number;
  bgFill: string;
  bgStroke: string;
  /** Draw the background layer's squares without strokes. */
  bgStrokeDisabled: boolean;
  /** Draw the background grid on all of the element, also out of the source. */
  extend: boolean;
  midSize: number;
  midFill: string;
  midStroke: string;
  /** Draw the midtone layer's squares without strokes. */
  midStrokeDisabled: boolean;
  highSize: number;
  highFill: string;
  highStroke: string;
  /** Draw the highlight layer's squares without strokes. */
  highStrokeDisabled: boolean;
  /** Show the lens under the pointer. */
  hover: boolean;
  /** The lens dimensions, in % of the drawn width. */
  hoverRadius: number;
  hoverDistortion: number;
  hoverSpeed: number;
  hoverPixelSize: number;
  hoverFalloff: number;
}

const INVERSE = 'var(--surface-inverse)';

// The dimensions are the px of the Overnice lab for a video that is 660 px
// wide (the globe of the Partners section). The colours are the Tonal style
// (see styles.ts): theme tokens, thus the defaults work in each theme.
export const DEFAULTS: Readonly<PixelVideoSettings> = Object.freeze({
  bgSize: 1.2,
  bgFill: INVERSE,
  bgStroke: INVERSE,
  bgStrokeDisabled: false,
  extend: false,
  midSize: 1.5,
  midFill: 'var(--surface-accent)',
  midStroke: INVERSE,
  midStrokeDisabled: false,
  highSize: 1.8,
  highFill: 'var(--surface-default)',
  highStroke: INVERSE,
  highStrokeDisabled: false,
  hover: true,
  hoverRadius: 24,
  hoverDistortion: 4.5,
  hoverSpeed: 1,
  hoverPixelSize: 3.6,
  hoverFalloff: 9,
});

export const COLOR_KEYS = [
  'bgFill',
  'bgStroke',
  'midFill',
  'midStroke',
  'highFill',
  'highStroke',
] as const;

/** Merge partial settings on the defaults. Ignore unknown keys and wrong types. */
export function resolveSettings(settings?: Partial<PixelVideoSettings> | null): PixelVideoSettings {
  const out: PixelVideoSettings = { ...DEFAULTS };
  for (const [key, value] of Object.entries(settings ?? {})) {
    if (!(key in DEFAULTS)) {
      console.warn(`[pixel-video] ignoring unknown setting "${key}"`);
      continue;
    }
    const expected = typeof DEFAULTS[key as keyof PixelVideoSettings];
    if (typeof value !== expected || (expected === 'number' && !Number.isFinite(value))) {
      console.warn(`[pixel-video] ignoring "${key}": expected a ${expected}`);
      continue;
    }
    (out as unknown as Record<string, unknown>)[key] = value;
  }
  return out;
}
