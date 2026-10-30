// The pixel frame format (.pxv): a short video, already sorted into the
// three layers of the pixel effect, at a low resolution. The site shows it
// with <pixel-video>. It does not use a <video> element, because some
// browsers (Firefox on Android) cannot copy video frames into a canvas.
//
// This module has no imports, so that it runs in the browser and in Node.
//
// Layout (little-endian):
//   0   4 bytes  "PXV2"
//   4   u16      width, in cells
//   6   u16      height, in cells
//   8   u16      number of frames
//   10  u16      frames per second × 100
//   12  u32      length of the settings, in bytes (0 = no settings)
//   16  ...      the suggested player settings, as UTF-8 JSON (see
//                settings.ts). The `settings` attribute of the element
//                replaces them, key by key.
//   ... ...      gzip data: the frames one after the other, row by row
//                from the top, 2 bits for each cell (4 cells in a byte,
//                the first cell in the low bits). Each frame is XOR'd with
//                the frame before it, so a cell that does not change is 0
//                and compresses well.
//
// A "PXV1" file has no settings: the gzip data starts at byte 12.

/** The layer of a cell. */
export const BG = 0;
export const MID = 1;
export const HIGH = 2;
/** Nothing shows in this cell (a transparent pixel in the source). */
export const EMPTY = 3;

const MAGIC = 'PXV2';
const MAGIC_V1 = 'PXV1';
const HEADER = 16;
const HEADER_V1 = 12;

export interface PixelFrames {
  width: number;
  height: number;
  fps: number;
  /** The number of frames. */
  count: number;
  /** All the frames, `width × height` cells each, with no XOR. */
  cells: Uint8Array;
  /** The suggested player settings (see settings.ts), if the file has them. */
  settings?: Record<string, unknown>;
}

/** The thresholds that sort a pixel into a layer, by brightness (0–255). */
export interface Thresholds {
  tMid: number;
  tHigh: number;
}

export const DEFAULT_THRESHOLDS: Thresholds = { tMid: 105, tHigh: 161 };

/** Pixels with this alpha or less are empty. */
const MIN_ALPHA = 128;

/**
 * Sort RGBA pixels into layers. Write one cell for each pixel into `out`,
 * from `offset`.
 */
export function quantize(
  rgba: Uint8Array | Uint8ClampedArray,
  out: Uint8Array,
  offset: number,
  { tMid, tHigh }: Thresholds = DEFAULT_THRESHOLDS,
): void {
  for (let i = 0, j = offset; i < rgba.length; i += 4, j++) {
    if (rgba[i + 3]! <= MIN_ALPHA) {
      out[j] = EMPTY;
      continue;
    }
    const b = lumaOf(rgba[i]!, rgba[i + 1]!, rgba[i + 2]!);
    out[j] = b < tMid ? BG : b < tHigh ? MID : HIGH;
  }
}

/** The brightness value of an empty pixel in `flatten()`. */
export const NO_LUMA = 256;

/** The brightness (0–255) of a colour, as the original effect computes it (Rec. 709 luma). */
export function lumaOf(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Write the brightness (0–255, rounded down) and the alpha of each pixel
 * into `luma` and `alpha`, from `offset`. `flatten()` then makes the values
 * for `classify()`.
 */
export function readPixels(
  rgba: Uint8Array | Uint8ClampedArray,
  luma: Uint8Array,
  alpha: Uint8Array,
  offset: number,
): void {
  for (let i = 0, j = offset; i < rgba.length; i += 4, j++) {
    luma[j] = Math.floor(lumaOf(rgba[i]!, rgba[i + 1]!, rgba[i + 2]!));
    alpha[j] = rgba[i + 3]!;
  }
}

/**
 * Give the brightness values for `classify()`. With no `matte`, a pixel with
 * a low alpha is empty (NO_LUMA), and `classify()` gives the same cells as
 * `quantize()`. With a `matte` brightness (0–255), each pixel is put on a
 * background of that brightness. The brightness is linear in the colour
 * channels, thus this gives the same value as a colour background.
 */
export function flatten(luma: Uint8Array, alpha: Uint8Array, matte: number | null): Uint16Array {
  const out = new Uint16Array(luma.length);
  for (let i = 0; i < luma.length; i++) {
    const a = alpha[i]!;
    if (matte === null) out[i] = a <= MIN_ALPHA ? NO_LUMA : luma[i]!;
    else out[i] = a === 255 ? luma[i]! : Math.floor((luma[i]! * a + matte * (255 - a)) / 255);
  }
  return out;
}

/** Sort brightness values from `flatten()` into layers. */
export function classify(
  values: Uint16Array,
  { tMid, tHigh }: Thresholds = DEFAULT_THRESHOLDS,
): Uint8Array {
  // A table with the layer of each value is faster than the comparisons.
  // This is important for the live preview of the encoder.
  const layer = new Uint8Array(NO_LUMA + 1);
  for (let b = 0; b < NO_LUMA; b++) layer[b] = b < tMid ? BG : b < tHigh ? MID : HIGH;
  layer[NO_LUMA] = EMPTY;
  const out = new Uint8Array(values.length);
  for (let i = 0; i < values.length; i++) out[i] = layer[values[i]!]!;
  return out;
}

/** Count the pixels of each brightness (0–255). Empty pixels are not counted. */
export function histogram(values: Uint16Array): Float64Array {
  const counts = new Float64Array(256);
  for (let i = 0; i < values.length; i++) if (values[i] !== NO_LUMA) counts[values[i]!]!++;
  return counts;
}

/**
 * Find the two thresholds that split the brightness histogram into the
 * three groups with the least spread in each group (Otsu's method with
 * three classes). If the video has three flat tones, each tone goes into
 * its own layer.
 */
export function autoThresholds(counts: Float64Array): Thresholds {
  // Prefix sums: n[k] pixels and s[k] brightness sum of the values below k.
  const n = new Float64Array(257);
  const s = new Float64Array(257);
  for (let k = 0; k < 256; k++) {
    n[k + 1] = n[k]! + counts[k]!;
    s[k + 1] = s[k]! + k * counts[k]!;
  }
  // The weighted sum of the squared class means. The highest value gives the
  // least spread in the classes.
  const score = (a: number, b: number) => {
    const w = n[b]! - n[a]!;
    return w > 0 ? ((s[b]! - s[a]!) * (s[b]! - s[a]!)) / w : 0;
  };
  let best = { tMid: DEFAULT_THRESHOLDS.tMid, tHigh: DEFAULT_THRESHOLDS.tHigh };
  let bestScore = -1;
  for (let t1 = 1; t1 < 255; t1++) {
    for (let t2 = t1 + 1; t2 < 256; t2++) {
      const v = score(0, t1) + score(t1, t2) + score(t2, 256);
      if (v > bestScore) {
        bestScore = v;
        best = { tMid: t1, tHigh: t2 };
      }
    }
  }
  // A threshold in a gap with no pixels gives the same score at all points
  // of the gap. Move it to the middle of the gap.
  const centre = (t: number) => {
    let lo = t;
    let hi = t;
    while (lo > 0 && counts[lo - 1] === 0) lo--;
    while (hi < 256 && counts[hi] === 0) hi++;
    return lo > 0 && hi < 256 ? Math.round((lo + hi) / 2) : t;
  };
  return { tMid: centre(best.tMid), tHigh: centre(best.tHigh) };
}

async function pipe(
  data: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const body = new Blob([data as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(body).arrayBuffer());
}

/** Make a .pxv file from frames. */
export async function encode(frames: PixelFrames): Promise<Uint8Array> {
  const { width, height, count, cells } = frames;
  const size = width * height;
  if (cells.length !== size * count) throw new Error('cells does not match width × height × count');
  const packed = new Uint8Array(Math.ceil(cells.length / 4));
  for (let i = 0; i < cells.length; i++) {
    const v = i < size ? cells[i]! : cells[i]! ^ cells[i - size]!;
    packed[i >> 2]! |= (v & 3) << ((i & 3) * 2);
  }
  const body = await pipe(packed, new CompressionStream('gzip'));
  const json =
    frames.settings && Object.keys(frames.settings).length
      ? new TextEncoder().encode(JSON.stringify(frames.settings))
      : new Uint8Array(0);
  const out = new Uint8Array(HEADER + json.length + body.length);
  const view = new DataView(out.buffer);
  for (let i = 0; i < 4; i++) out[i] = MAGIC.charCodeAt(i);
  view.setUint16(4, width, true);
  view.setUint16(6, height, true);
  view.setUint16(8, count, true);
  view.setUint16(10, Math.round(frames.fps * 100), true);
  view.setUint32(12, json.length, true);
  out.set(json, HEADER);
  out.set(body, HEADER + json.length);
  return out;
}

/** The byte where the gzip data starts. */
function dataStart(data: Uint8Array): number {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const magic = String.fromCharCode(...data.subarray(0, 4));
  if (magic === MAGIC_V1) return HEADER_V1;
  if (magic !== MAGIC) throw new Error('not a .pxv file');
  return HEADER + view.getUint32(12, true);
}

/** Read the header and the settings of a .pxv file, with no decompression. */
export function readHeader(data: Uint8Array): Omit<PixelFrames, 'cells'> {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const start = dataStart(data);
  const header: Omit<PixelFrames, 'cells'> = {
    width: view.getUint16(4, true),
    height: view.getUint16(6, true),
    count: view.getUint16(8, true),
    fps: view.getUint16(10, true) / 100,
  };
  if (start > HEADER) {
    const json = new TextDecoder().decode(data.subarray(HEADER, start));
    const settings: unknown = JSON.parse(json);
    if (settings && typeof settings === 'object' && !Array.isArray(settings))
      header.settings = settings as Record<string, unknown>;
  }
  return header;
}

/** Read a .pxv file. */
export async function decode(data: Uint8Array): Promise<PixelFrames> {
  const header = readHeader(data);
  const packed = await pipe(data.subarray(dataStart(data)), new DecompressionStream('gzip'));
  const size = header.width * header.height;
  const cells = new Uint8Array(size * header.count);
  if (packed.length !== Math.ceil(cells.length / 4))
    throw new Error('the .pxv data is not complete');
  for (let i = 0; i < cells.length; i++) {
    const v = (packed[i >> 2]! >> ((i & 3) * 2)) & 3;
    cells[i] = i < size ? v : v ^ cells[i - size]!;
  }
  return { ...header, cells };
}
