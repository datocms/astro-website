import type { PixelVideoSettings } from './settings';

// The pixel styles. Each one is a set of colours for <pixel-video>.
//
// The encoder puts each cell in a layer by its brightness: background (dark
// pixels), midtone, highlight (bright pixels). A style gives a fill and a
// stroke colour to each layer, and nothing more. All the colours are theme
// tokens, so a style works in each theme. The strokes of each layer go off
// with a separate setting (bgStrokeDisabled, midStrokeDisabled,
// highStrokeDisabled), with each style.

export type Style = Partial<PixelVideoSettings>;

const INVERSE = 'var(--surface-inverse)';
const ACCENT = 'var(--surface-accent)';

// The brightness order of the video stays: dark background, theme colour for
// the midtones, light highlights. Use it for normal footage. The highlights
// are the light text of the inverse surface: the default surface is dark in
// the dark scheme.
export const tonal: Style = {
  bgFill: INVERSE,
  bgStroke: INVERSE,
  midFill: ACCENT,
  midStroke: INVERSE,
  highFill: 'var(--text-on-inverse-strong)',
  highStroke: INVERSE,
};

// The opposite order: dark pixels become light. Use it for dark footage
// (space, night, a studio with a black background) on a light section.
export const negative: Style = {
  bgFill: 'var(--surface-default)',
  bgStroke: 'var(--surface-default)',
  midFill: ACCENT,
  midStroke: 'var(--surface-default)',
  highFill: INVERSE,
  highStroke: 'var(--surface-default)',
};

// One layer shows as dark squares. The other two layers become the accent
// surface, with a dark grid.
const duotone = (layer: 'bg' | 'mid' | 'high'): Style => ({
  bgFill: layer === 'bg' ? INVERSE : ACCENT,
  bgStroke: INVERSE,
  midFill: layer === 'mid' ? INVERSE : ACCENT,
  midStroke: INVERSE,
  highFill: layer === 'high' ? INVERSE : ACCENT,
  highStroke: INVERSE,
});
// The dark pixels show. Use it for a dark subject on a light background,
// line drawings and emoji outlines.
export const duotoneShadows = duotone('bg');
// The midtones show. Use it for graphics with a clear middle band (the
// globe: black space and white land become the surface, the grey ocean
// shows).
export const duotoneMidtones = duotone('mid');
// The bright pixels show. Use it for a lit subject on a dark background.
export const duotoneHighlights = duotone('high');

// Tints of the accent colour only: low contrast, a texture behind text. This
// is the style of the Questions CTA of the home page.
export const tint: Style = {
  bgFill: ACCENT,
  bgStroke: 'var(--surface-accent-muted)',
  midFill: 'var(--surface-accent-subtle)',
  midStroke: 'var(--surface-accent-muted)',
  highFill: 'var(--surface-accent-faint)',
  highStroke: 'var(--surface-accent-muted)',
};

// Only the outlines of the squares, on the page surface. The background
// grid has the colour of the surface, thus it does not show. Lighter than
// Tint, for busy footage behind text.
export const outline: Style = {
  bgFill: 'var(--surface-default)',
  bgStroke: 'var(--surface-default)',
  midFill: 'var(--surface-default)',
  midStroke: 'var(--surface-accent-muted)',
  highFill: 'var(--surface-default)',
  highStroke: INVERSE,
};

// Flat cells in three tones, with no visible grid: dark background, accent
// midtones and the light pixel highlight. This is the pixel hover of the
// image cards (PixelImage): orange cells with yellow highlights.
export const tintHighlight: Style = {
  bgFill: INVERSE,
  bgStroke: INVERSE,
  midFill: ACCENT,
  midStroke: ACCENT,
  highFill: 'var(--surface-pixel-highlight)',
  highStroke: 'var(--surface-pixel-highlight)',
};

export const pixelStyles = [
  { label: 'Tonal', settings: tonal },
  { label: 'Negative', settings: negative },
  { label: 'Duotone: shadows', settings: duotoneShadows },
  { label: 'Duotone: midtones', settings: duotoneMidtones },
  { label: 'Duotone: highlights', settings: duotoneHighlights },
  { label: 'Tint', settings: tint },
  { label: 'Tint + highlight', settings: tintHighlight },
  { label: 'Outline', settings: outline },
];
