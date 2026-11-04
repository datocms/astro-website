// The cells of the pixel field: a slow noise, sorted into the layers of a
// pixel video (src/lib/pixel-video/format.ts). The field is calm at the top
// left (the headline) and busy at the right and at the bottom. An ordered
// dither (Bayer 4×4) breaks the edges between two tones into a pattern of
// single cells, as in pixel art.

// The layers of format.ts.
const FAINT = 0;
const MUTED = 1;
const ACCENT = 2;
const EMPTY = 3;
const GLINT = 4;

// The size of a blob of the noise, in cells.
const SCALE = 22;
// The drift of the field, in cells for each second.
const DRIFT_X = 0.9;
const DRIFT_Y = -0.35;
// The change of the shape of the field, in noise units for each second.
const EVOLVE = 0.09;

// The 4×4 Bayer matrix, from 0 to 1.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);

function hash(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

// Value noise in 3D, from 0 to 1.
function noise(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const fz = smooth(z - iz);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const plane = (k: number) =>
    lerp(
      lerp(hash(ix, iy, k), hash(ix + 1, iy, k), fx),
      lerp(hash(ix, iy + 1, k), hash(ix + 1, iy + 1, k), fx),
      fy,
    );
  return lerp(plane(iz), plane(iz + 1), fz);
}

function fbm(x: number, y: number, z: number): number {
  return (
    noise(x, y, z) * 0.6 +
    noise(x * 2.1, y * 2.1, z * 1.7) * 0.28 +
    noise(x * 4.3, y * 4.3, z * 2.9) * 0.12
  );
}

/**
 * Fill `cells` (`cols` × `rows`, row by row from the top) with the field at
 * step `step`. One step is `stepSeconds` long.
 */
export function fillField(
  cells: Uint8Array,
  cols: number,
  rows: number,
  step: number,
  stepSeconds: number,
): void {
  const t = step * stepSeconds;
  const ox = t * DRIFT_X;
  const oy = t * DRIFT_Y;
  const z = t * EVOLVE;
  for (let y = 0; y < rows; y++) {
    const v = y / Math.max(1, rows - 1);
    for (let x = 0; x < cols; x++) {
      const u = x / Math.max(1, cols - 1);
      // The bias: below zero at the top left, above zero at the bottom right.
      const bias = u * 0.6 + v * 0.2 - 0.88;
      const n = fbm((x - ox) / SCALE, (y - oy) / SCALE, z);
      const c = n + bias + BAYER[(y & 3) * 4 + (x & 3)]! * 0.1;
      let layer: number;
      if (c < 0.2) layer = EMPTY;
      else if (c < 0.3) layer = FAINT;
      else if (c < 0.38) layer = MUTED;
      else layer = ACCENT;
      // A few cells of the accent flash for one step.
      if (layer === ACCENT && c > 0.44 && hash(x, y, step) > 0.985) layer = GLINT;
      cells[y * cols + x] = layer;
    }
  }
}
