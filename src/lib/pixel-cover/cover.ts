/*
 * The cover of a blog post: the file, the colours and the drawing.
 *
 * The file is a PNG of 100 × 58 pixels, one pixel for each cell. It has no
 * colours of a theme: a cell is transparent (the ground), or it has one of
 * three tones (black, grey, white). The theme gives the colours when the
 * cover is drawn. Thus one file works with each theme.
 *
 * The left half of a cover is on the accent of the theme, and the right half
 * is on the ink. Each half has its own colours for the three tones.
 *
 * This module imports nothing. src/components/PixelCover (the browser) and
 * scripts/blog-covers/gen.ts (Node) use it.
 */

export const COLS = 100;
export const ROWS = 58;
/** The first column of the right half. */
export const SEAM = 50;

/** The smallest pitch, in device pixels, that has a gap between the cells. */
const MIN_PITCH_WITH_GAP = 6;

export type Rgb = readonly [number, number, number];

/** The grid: for each cell, -1 (ground) or the tone 0 (dark), 1 or 2 (light). */
export type Grid = Int8Array;

// ---- The file.

/** The grey of each tone in the file. */
export const TONE_GREYS = [0, 128, 255] as const;

/**
 * The pixels of the file (RGBA) from a grid. The ground is transparent.
 */
export function gridToPixels(grid: Grid) {
  const pixels = new Uint8Array(COLS * ROWS * 4);
  for (let i = 0; i < COLS * ROWS; i++) {
    const tone = grid[i]!;
    if (tone < 0) continue;
    const grey = TONE_GREYS[tone]!;
    pixels.set([grey, grey, grey, 255], i * 4);
  }
  return pixels;
}

/** The largest difference between a pixel and the grey of its tone. */
const TONE_TOLERANCE = 40;

/**
 * The grid from the pixels of a file (RGBA). It gives an error text when the
 * file is not a cover: a different size, or a pixel that is not a tone.
 *
 * A pixel takes the nearest tone. The CDN of the assets can encode the file
 * again, and then some pixels are a little different from their tone.
 */
export function pixelsToGrid(
  pixels: ArrayLike<number>,
  width: number,
  height: number,
): { grid: Grid; error?: undefined } | { grid?: undefined; error: string } {
  if (width !== COLS || height !== ROWS)
    return { error: `The file is ${width} × ${height} pixels. A cover is ${COLS} × ${ROWS}.` };
  const grid: Grid = new Int8Array(COLS * ROWS).fill(-1);
  for (let i = 0; i < COLS * ROWS; i++) {
    const [r, g, b, a] = [
      pixels[i * 4]!,
      pixels[i * 4 + 1]!,
      pixels[i * 4 + 2]!,
      pixels[i * 4 + 3]!,
    ];
    if (a < 128) continue;
    const tone = TONE_GREYS.findIndex((grey) => Math.abs(r - grey) <= TONE_TOLERANCE);
    const isGrey = Math.max(r, g, b) - Math.min(r, g, b) <= TONE_TOLERANCE;
    if (tone < 0 || !isGrey) {
      const at = `column ${i % COLS}, row ${Math.floor(i / COLS)}`;
      return { error: `The pixel at ${at} is not a tone (rgba ${r} ${g} ${b} ${a}).` };
    }
    grid[i] = tone;
  }
  return { grid };
}

// ---- The colours.

/** The colours of a theme that a cover uses, from src/styles/tokens.css. */
export type ThemeColours = {
  /** `--theme-accent` */
  accent: Rgb;
  /** `--theme-ink` */
  ink: Rgb;
  /** `--theme-paper` */
  paper: Rgb;
  /** `--theme-pixel-highlight` */
  highlight: Rgb;
};

const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function toOklab(rgb: Rgb) {
  const [r, g, b] = rgb.map((c) => linear(c / 255)) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ] as const;
}

function fromOklab([L, a, b]: readonly [number, number, number]): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const byte = (c: number) => Math.round(Math.min(1, Math.max(0, gamma(c))) * 255);
  return [
    byte(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    byte(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    byte(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Mix two colours in OKLab, as CSS `color-mix(in oklab)`. `t` is the part of `b`. */
export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const A = toOklab(a);
  const B = toOklab(b);
  return fromOklab([0, 1, 2].map((i) => A[i]! + (B[i]! - A[i]!) * t) as [number, number, number]);
}

export type Palette = { ground: Rgb; tones: readonly [Rgb, Rgb, Rgb] };

/** The two palettes of a theme. Tone 0 is dark, 1 is the midtone, 2 is the highlight. */
export function palettes({ accent, ink, paper, highlight }: ThemeColours) {
  return {
    // The left half, on the accent.
    accent: { ground: accent, tones: [ink, mix(ink, accent, 0.5), paper] } as Palette,
    // The right half, on the ink. The dark tone is a little lighter than the
    // ground, thus the dark parts of the animal show.
    inverse: { ground: ink, tones: [mix(ink, accent, 0.3), accent, highlight] } as Palette,
  };
}

export type Palettes = ReturnType<typeof palettes>;

/** The palette of a column. */
export const paletteOf = (pal: Palettes, column: number) =>
  column < SEAM ? pal.accent : pal.inverse;

// ---- The drawing.

/** The empty columns that stay at each side of the subject (the safe area). */
const SIDE_MARGIN = 5;

/**
 * Where the grid is in a box of `width` × `height` device pixels.
 *
 * The pitch is a whole number of device pixels: all the cells have the same
 * size. The nearest whole number can make the grid a little larger than the
 * box. Then the box cuts the edges of the grid, which are ground. The gap is
 * one device pixel. A small cell has no gap: on it, the gaps make a screen.
 *
 * The seam of the grid is in the middle of the box. In a box of the shape of
 * the grid, or wider, all the grid shows. In a box that is higher than the
 * grid (the header of a post), the grid becomes larger until its rows fill
 * the height, or until the subject and its side margin fill the width. The
 * box then cuts columns of ground at the sides, not the subject. Thus a
 * narrow subject is not small below a band of ground.
 *
 * The grid is in the middle of the height. But when the subject is on the
 * ground and the box is higher than the grid, the grid is at the bottom of
 * the box: the subject stands on the bottom edge of the box.
 */
export function layout(width: number, height: number, grid?: Grid) {
  let fit = Math.min(width / COLS, height / ROWS);
  const half = grid ? halfWidth(grid) : 0;
  if (half > 0) fit = Math.min(height / ROWS, Math.max(fit, width / (2 * half)));
  const pitch = Math.max(1, Math.round(fit));
  const gap = pitch >= MIN_PITCH_WITH_GAP ? 1 : 0;
  const left = Math.floor(width / 2) - pitch * SEAM;
  const spare = height - pitch * ROWS;
  const top = grid && isGrounded(grid) && spare > 0 ? spare : Math.floor(spare / 2);
  // The seam of the grounds is at the seam of the cells.
  return { pitch, gap, left, top, seam: left + pitch * SEAM };
}

/**
 * The columns from the seam to the edge of the subject that is farther from
 * the seam, with the side margin. 0 when the grid has no subject.
 */
function halfWidth(grid: Grid) {
  let x0 = COLS;
  let x1 = -1;
  for (let i = 0; i < COLS * ROWS; i++) {
    if (grid[i]! < 0) continue;
    x0 = Math.min(x0, i % COLS);
    x1 = Math.max(x1, i % COLS);
  }
  if (x1 < 0) return 0;
  return Math.min(SEAM, Math.max(SEAM - x0, x1 + 1 - SEAM) + SIDE_MARGIN);
}

/**
 * True when the subject is on the ground: it has a cell in the last row. It
 * stands on the bottom edge, or the bottom edge cuts it.
 */
export function isGrounded(grid: Grid) {
  for (let x = 0; x < COLS; x++) if (grid[(ROWS - 1) * COLS + x]! >= 0) return true;
  return false;
}

/** The 2D context of a canvas: only the parts that the drawing uses. */
type Context = {
  fillStyle: string | CanvasGradient | CanvasPattern;
  fillRect(x: number, y: number, w: number, h: number): void;
};

const css = ([r, g, b]: Rgb) => `rgb(${r} ${g} ${b})`;

/**
 * Draw a cover on a canvas of `width` × `height` device pixels: the two
 * grounds, then the cells.
 */
export function drawCover(
  context: Context,
  grid: Grid,
  colours: ThemeColours,
  width: number,
  height: number,
) {
  const pal = palettes(colours);
  const { pitch, gap, left, top, seam } = layout(width, height, grid);
  context.fillStyle = css(pal.accent.ground);
  context.fillRect(0, 0, seam, height);
  context.fillStyle = css(pal.inverse.ground);
  context.fillRect(seam, 0, width - seam, height);
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const tone = grid[y * COLS + x]!;
      if (tone < 0) continue;
      context.fillStyle = css(paletteOf(pal, x).tones[tone]!);
      context.fillRect(left + x * pitch, top + y * pitch, pitch - gap, pitch - gap);
    }
}
