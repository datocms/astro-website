// The cells of one step of the pixel development (see `./index.ts` for the
// rules). The functions read pixels and give cells: they do not draw, thus
// the canvas of the browser and the server (the first step from the
// thumbhash, see `./thumbhash.ts`) use the same rules.

export type DevelopMode = 'ink' | 'photo';

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** An image as RGBA pixels on white, with the colour that is not ink. */
export interface Pixels {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
  /** The colour that is not ink. */
  ground: Rgb;
}

/** A square cell, in the pixels of the image. */
export interface Cell {
  x: number;
  y: number;
  size: number;
  colour: Rgb;
}

// The size of the cells at each step, as a part of the side of a square
// with the area of the image.
export const STEPS = [1 / 4, 1 / 8, 1 / 16, 1 / 32];
// A pixel is ink when it is this far from the ground (the sum of the
// differences of the three channels, 0–765).
const INK_DISTANCE = 60;
// A cell gets the colour of the ink when the ink covers this part of its
// area or more. A logo is solid, thus it needs much ink. An illustration
// can be thin lines, thus a photo needs less.
const INK_COVERAGE: Record<DevelopMode, number> = { ink: 0.3, photo: 0.08 };

/** The ground of a mode: white for `ink`, the most frequent colour of the image for `photo`. */
export function groundOf(pixels: Uint8ClampedArray, mode: DevelopMode): Rgb {
  return mode === 'ink' ? { r: 255, g: 255, b: 255 } : mostFrequentColour(pixels);
}

/**
 * The cells of one step: square cells of `step` times the side of the
 * image. The grid has its centre at the centre of the image, thus the
 * cells at the two sides are equal. `minSize` is the smallest cell, in
 * pixels of the image.
 */
export function cellsOf(image: Pixels, step: number, mode: DevelopMode, minSize = 2): Cell[] {
  const side = Math.sqrt(image.width * image.height);
  const size = Math.max(minSize, Math.round(side * step));
  const cols = Math.ceil(image.width / size);
  const rows = Math.ceil(image.height / size);
  const left = Math.round((image.width - cols * size) / 2);
  const top = Math.round((image.height - rows * size) / 2);

  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = Math.max(0, left + col * size);
      const y0 = Math.max(0, top + row * size);
      const x1 = Math.min(image.width, left + (col + 1) * size);
      const y1 = Math.min(image.height, top + (row + 1) * size);
      let count = 0;
      const ink: number[] = [];
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * image.width + x) * 4;
          count++;
          if (distance(image.pixels, i, image.ground) >= INK_DISTANCE) ink.push(i);
        }
      }
      const colour =
        ink.length > 0 && ink.length >= count * INK_COVERAGE[mode]
          ? mostFrequentColour(image.pixels, ink)
          : mode === 'photo'
            ? image.ground
            : null;
      if (colour) cells.push({ x: left + col * size, y: top + row * size, size, colour });
    }
  }
  return cells;
}

// The sum of the differences of the three channels between the pixel at
// `i` and `colour`.
function distance(pixels: Uint8ClampedArray, i: number, colour: Rgb) {
  return (
    Math.abs(pixels[i]! - colour.r) +
    Math.abs(pixels[i + 1]! - colour.g) +
    Math.abs(pixels[i + 2]! - colour.b)
  );
}

// The pixels go into buckets of similar colours (4 bits for each channel).
// The result is the mean colour of the largest bucket. A mean of all the
// pixels would mix two colours of the image into a colour that the image
// does not have (black on yellow gives olive). `indexes` are the pixels to
// read; without it, all the pixels.
function mostFrequentColour(pixels: Uint8ClampedArray, indexes?: number[]): Rgb {
  const buckets = new Map<number, Rgb & { n: number }>();
  const add = (i: number) => {
    const r = pixels[i]!;
    const g = pixels[i + 1]!;
    const b = pixels[i + 2]!;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n++;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  };
  if (indexes) for (const i of indexes) add(i);
  else for (let i = 0; i < pixels.length; i += 4) add(i);
  let largest = { r: 255, g: 255, b: 255, n: 0 };
  for (const bucket of buckets.values()) if (bucket.n > largest.n) largest = bucket;
  if (largest.n === 0) return largest;
  return {
    r: Math.round(largest.r / largest.n),
    g: Math.round(largest.g / largest.n),
    b: Math.round(largest.b / largest.n),
  };
}
