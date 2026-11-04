// The palettes of <pixel-video>. A palette is the full look of a video: a
// file (or a component) gives only its name (`palettes` below).
//
// The encoder puts each cell in a layer by its brightness: background (dark
// pixels), midtone, highlight (bright pixels). A palette gives a fill and a
// stroke colour to each layer. All the colours are theme tokens, so a
// palette works in each theme. The other parts of the look (one square for
// each cell, the lens) are the same for all the videos (see renderer.ts).
// Only the element can remove the lens (the `no-lens` attribute).

/** The colours of the three layers. */
export interface Style {
  bgFill: string;
  bgStroke: string;
  midFill: string;
  midStroke: string;
  highFill: string;
  highStroke: string;
  /**
   * The colour of the ground: under the squares, and out of the source.
   * When it is not set, the ground is `bgFill`, thus the squares of the
   * background layer do not show on it. With a different colour, the
   * background layer has its own squares: a dark subject on a light ground.
   */
  groundFill?: string;
  /**
   * The colours of the TOP layer (format.ts), for a live frame that has
   * it. Without them, the renderer draws TOP cells as the highlight.
   */
  topFill?: string;
  topStroke?: string;
}

const INVERSE = 'var(--surface-inverse)';
const ACCENT = 'var(--surface-accent)';
// Half the inverse surface and half the accent surface.
const HALF_DARK = `color-mix(in oklab, ${INVERSE} 50%, ${ACCENT})`;

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
// midtones and the light pixel highlight: orange cells with yellow highlights.
export const tintHighlight: Style = {
  bgFill: INVERSE,
  bgStroke: INVERSE,
  midFill: ACCENT,
  midStroke: ACCENT,
  highFill: 'var(--surface-pixel-highlight)',
  highStroke: 'var(--surface-pixel-highlight)',
};

// The order of Tonal, on a ground of the accent colour: dark squares, darker
// accent midtones, light highlights. Use it for a subject with a large dark
// part (black clothes) on a transparent background: with Tonal, the dark part
// has the colour of the ground and does not show. Put the video on the
// accent surface. The strokes have the colour of the ground, but the strokes
// of the dark squares are half dark: a full accent grid on the dark part is
// too strong.
export const onAccent: Style = {
  ...tonal,
  groundFill: ACCENT,
  bgStroke: HALF_DARK,
  midFill: HALF_DARK,
  midStroke: ACCENT,
  highStroke: ACCENT,
};

// The silhouette of a dark subject on a light background: the background
// of the source is the midtones, the subject is the background layer. The
// midtones become the accent surface with no grid, thus only the subject and
// the highlights show. The background layer is the subject, thus the grid
// does not fill the band (`extend: false` in `palettes`). The strokes of the subject are
// half dark, as in On accent.
export const silhouette: Style = {
  bgFill: INVERSE,
  bgStroke: HALF_DARK,
  midFill: ACCENT,
  midStroke: ACCENT,
  highFill: 'var(--text-on-inverse-strong)',
  highStroke: ACCENT,
};

// The look of the course pictures of the academy: soft, as the page. Dark
// pixels take the surface of the page (with no grid), the midtones the
// theme colour, and the highlights the colour of the text.
export const soft: Style = {
  bgFill: 'var(--surface-default)',
  bgStroke: 'var(--surface-default)',
  midFill: ACCENT,
  midStroke: 'var(--surface-default)',
  highFill: 'var(--text-primary)',
  highStroke: 'var(--surface-default)',
};

// A line icon (a Lottie icon with dark outlines and light fills) on the
// page surface. The outlines have the colour of the text. The fills have
// the accent colour mixed with the surface: they are light in the light
// scheme and dark in the dark scheme. The ground is the page surface, thus
// the transparent pixels around the icon do not show. The grid has the
// colour of the surface. This is the picture of the courses of the
// academy.
export const lineIcon: Style = {
  bgFill: 'var(--text-primary)',
  bgStroke: 'var(--surface-default)',
  midFill: ACCENT,
  midStroke: 'var(--surface-default)',
  highFill: `color-mix(in oklab, ${ACCENT} 30%, var(--surface-default))`,
  highStroke: 'var(--surface-default)',
  groundFill: 'var(--surface-default)',
};

// Tonal with the yellow pixel highlight, and no grid on the background.
// This is the hero video of the site window of the home page.
export const tonalHighlight: Style = {
  ...tonal,
  highFill: 'var(--surface-pixel-highlight)',
};

// The globe footage has black space, a grey ocean and white land. Space
// becomes the accent surface, the ocean dark squares with an accent grid,
// and the land accent squares with a light grid. This is the globe of the
// Partners section.
export const globe: Style = {
  bgFill: ACCENT,
  bgStroke: ACCENT,
  midFill: INVERSE,
  midStroke: ACCENT,
  highFill: ACCENT,
  highStroke: 'var(--surface-default)',
};

// The globe footage, quiet, on the inverse surface: the land shows
// clearly, the sea a little. This is the globe behind the Ping diagram.
export const globeDim: Style = {
  bgFill: INVERSE,
  bgStroke: INVERSE,
  midFill: 'color-mix(in oklab, var(--surface-inverse) 92%, var(--text-on-inverse))',
  midStroke: INVERSE,
  highFill: 'color-mix(in oklab, var(--surface-inverse) 78%, var(--text-on-inverse))',
  highStroke: INVERSE,
};

// The globe of /partners, drawn live from the map (not from footage) on the
// accent surface. The sea is the accent with a quiet grid, thus the globe
// shows as a grid of squares; the land is a quarter of the deep, and a
// country with partners is the deep. The country of the tour (the TOP
// layer) is the pixel highlight, the light partner of the accent.
export const partnersGlobe: Style = {
  bgFill: ACCENT,
  bgStroke: `color-mix(in oklab, ${INVERSE} 16%, ${ACCENT})`,
  midFill: `color-mix(in oklab, ${INVERSE} 28%, ${ACCENT})`,
  midStroke: ACCENT,
  highFill: INVERSE,
  highStroke: ACCENT,
  topFill: 'var(--surface-pixel-highlight)',
  topStroke: ACCENT,
};

// The field behind the hero of the docs home, drawn live (not from
// footage) on the page surface. The tints of the accent go up in three
// steps: faint, muted, the accent. The grid has the colour of the page,
// thus each cell is a separate square. A few cells of the accent flash in
// the pixel highlight (the TOP layer). The tints mix the accent into the
// page surface, thus they are light on the white page and deep on the ink
// page: the same palette works in light and in dark.
export const docsField: Style = {
  bgFill: `color-mix(in oklab, ${ACCENT} 16%, var(--surface-default))`,
  bgStroke: 'var(--surface-default)',
  midFill: `color-mix(in oklab, ${ACCENT} 42%, var(--surface-default))`,
  midStroke: 'var(--surface-default)',
  highFill: ACCENT,
  highStroke: 'var(--surface-default)',
  groundFill: 'var(--surface-default)',
  topFill: 'var(--surface-pixel-highlight)',
  topStroke: 'var(--surface-default)',
};

/**
 * A palette: a style with a name, and the switches that go with it. A .pxv
 * file gives the name in its settings (`palette`), never the colours. Thus
 * a change here changes all the files of that palette.
 */
export interface Palette {
  name: string;
  label: string;
  /**
   * The surface that has the colour of the ground. Put the video on this
   * surface: the empty cells and the space out of the video show it.
   */
  surface: 'inverse' | 'accent' | 'default';
  colors: Style;
  /** The squares of the background layer have no strokes. */
  flatBackground?: boolean;
  /**
   * The background grid fills all of the element, also out of the source
   * (true when it is not set).
   */
  extend?: boolean;
}

export const palettes: readonly Palette[] = [
  { name: 'tonal', label: 'Tonal', surface: 'inverse', colors: tonal },
  { name: 'onAccent', label: 'On accent', surface: 'accent', colors: onAccent },
  {
    name: 'silhouette',
    label: 'Silhouette',
    surface: 'accent',
    colors: silhouette,
    extend: false,
  },
  { name: 'negative', label: 'Negative', surface: 'default', colors: negative },
  { name: 'duotoneShadows', label: 'Duotone: shadows', surface: 'inverse', colors: duotoneShadows },
  {
    name: 'duotoneMidtones',
    label: 'Duotone: midtones',
    surface: 'accent',
    colors: duotoneMidtones,
  },
  {
    name: 'duotoneHighlights',
    label: 'Duotone: highlights',
    surface: 'accent',
    colors: duotoneHighlights,
  },
  { name: 'tint', label: 'Tint', surface: 'accent', colors: tint, flatBackground: true },
  { name: 'tintHighlight', label: 'Tint + highlight', surface: 'inverse', colors: tintHighlight },
  { name: 'outline', label: 'Outline', surface: 'default', colors: outline },
  { name: 'soft', label: 'Soft', surface: 'default', colors: soft, flatBackground: true },
  { name: 'lineIcon', label: 'Line icon', surface: 'default', colors: lineIcon },
  {
    name: 'tonalHighlight',
    label: 'Tonal + highlight',
    surface: 'inverse',
    colors: tonalHighlight,
    flatBackground: true,
  },
  { name: 'globe', label: 'Globe', surface: 'accent', colors: globe },
  {
    name: 'globeDim',
    label: 'Globe, dim',
    surface: 'inverse',
    colors: globeDim,
  },
  {
    name: 'partnersGlobe',
    label: 'Partners globe',
    surface: 'accent',
    colors: partnersGlobe,
    extend: false,
  },
  {
    name: 'docsField',
    label: 'Docs field',
    surface: 'default',
    colors: docsField,
    extend: false,
  },
];

/** The palette with this name, or undefined. */
export const findPalette = (name: string): Palette | undefined =>
  palettes.find((palette) => palette.name === name);
