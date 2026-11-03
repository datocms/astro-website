// The pixel frame format (.pxv): a short video, already sorted into the
// three layers of the pixel effect, at a low resolution. The site shows it
// with <pixel-video>. It does not use a <video> element, because some
// browsers (Firefox on Android) cannot copy video frames into a canvas.
//
// This module has no imports, so that it runs in the browser and in Node.
//
// Layout (little-endian):
//   0   4 bytes  "PXV3"
//   4   u16      width, in cells
//   6   u16      height, in cells
//   8   u16      number of frames
//   10  u16      frames per second × 100
//   12  u32      length of the JSON, in bytes (0 = no JSON)
//   16  u8       the edges that cut the subject (see `Edge`): bit 0 left,
//                bit 1 right, bit 2 top, bit 3 bottom
//   17  ...      UTF-8 JSON: the settings of the video (see settings.ts:
//                the palette and the focus), and `source`, the URL of the
//                footage. The `palette` attribute of the element replaces
//                the palette of the file.
//   ... ...      gzip data: the frames one after the other, row by row
//                from the top, 2 bits for each cell (4 cells in a byte,
//                the first cell in the low bits). Each frame is XOR'd with
//                the frame before it, so a cell that does not change is 0
//                and compresses well.

/** The layer of a cell. */
export const BG = 0;
export const MID = 1;
export const HIGH = 2;
/** Nothing shows in this cell (a transparent pixel in the source). */
export const EMPTY = 3;
/**
 * A fourth layer over the highlight, only for frames that a page makes
 * live (a file has 2 bits for each cell, thus no TOP). The renderer draws
 * it in the `top` colours of the settings, or as HIGH without them.
 */
export const TOP = 4;

const MAGIC = 'PXV3';
const HEADER = 17;

/**
 * An edge of the video that cuts the subject: for example, an arm that comes
 * in from the right. Out of the video there is no subject, thus a player
 * that shows a ground around the video (`extend`) must keep this edge on the
 * edge of its area. Else the cut shows as a straight line in the ground.
 */
export type Edge = 'left' | 'right' | 'top' | 'bottom';
export const EDGES: readonly Edge[] = ['left', 'right', 'top', 'bottom'];

export interface PixelFrames {
  width: number;
  height: number;
  fps: number;
  /** The number of frames. */
  count: number;
  /** All the frames, `width × height` cells each, with no XOR. */
  cells: Uint8Array;
  /** The settings of the video (see settings.ts), if the file has them. */
  settings?: Record<string, unknown>;
  /**
   * The edges that cut the subject. `encode()` finds them with
   * `findEdges()` when this is not set.
   */
  edges?: Edge[];
  /**
   * The URL of the footage, to find it again (for example a YouTube video
   * at the start of the take). It is not a recipe: no tool makes the file
   * again from it.
   */
  source?: string;
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

/**
 * For each edge, the part (0–1) of its cells that are not empty, in all the
 * frames. A video with no empty cell (an opaque video) gives 1 for each edge.
 */
export function edgeShares(frames: PixelFrames): Record<Edge, number> {
  const { width: w, height: h, count, cells } = frames;
  const hits = { left: 0, right: 0, top: 0, bottom: 0 };
  for (let n = 0; n < count; n++) {
    const o = n * w * h;
    for (let y = 0; y < h; y++) {
      if (cells[o + y * w] !== EMPTY) hits.left++;
      if (cells[o + y * w + w - 1] !== EMPTY) hits.right++;
    }
    for (let x = 0; x < w; x++) {
      if (cells[o + x] !== EMPTY) hits.top++;
      if (cells[o + (h - 1) * w + x] !== EMPTY) hits.bottom++;
    }
  }
  const n = Math.max(1, count);
  return {
    left: hits.left / (h * n),
    right: hits.right / (h * n),
    top: hits.top / (w * n),
    bottom: hits.bottom / (w * n),
  };
}

/**
 * A subject that touches an edge in this part of the cells of the edge, or
 * more, is cut by the edge. Less is noise (a pixel of the key, a finger tip
 * for a frame).
 */
export const EDGE_LIMIT = 0.005;

/**
 * Find the edges that cut the subject. An opaque video has no subject
 * shape (the background is part of the picture): it gives no edges. Set
 * the edges by hand for it.
 */
export function findEdges(frames: PixelFrames): Edge[] {
  if (!frames.cells.includes(EMPTY)) return [];
  const shares = edgeShares(frames);
  return EDGES.filter((e) => shares[e] >= EDGE_LIMIT);
}

/**
 * The source cells under each cell of a smaller axis, with the part (0–1)
 * of each source cell that the cell covers.
 */
function boxWeights(from: number, to: number): { index: number; weight: number }[][] {
  const step = from / to;
  return Array.from({ length: to }, (_, i) => {
    const a = i * step;
    const b = a + step;
    const out: { index: number; weight: number }[] = [];
    for (let k = Math.floor(a); k < Math.min(from, Math.ceil(b)); k++)
      out.push({ index: k, weight: Math.min(b, k + 1) - Math.max(a, k) });
    return out;
  });
}

/**
 * Give the frames at a lower resolution, as the encoder gives them from a
 * smaller video. Each cell covers a box of source cells. The layers are in
 * the order of the brightness, thus a cell gets the mean layer of the cells
 * of its box that are not empty, rounded. It is empty when more than half
 * of its box is empty (an alpha of 50% or less, as in `quantize()`).
 */
export function downscale(frames: PixelFrames, width: number, height: number): PixelFrames {
  const { width: w, height: h, count, cells } = frames;
  if (width > w || height > h || width < 1 || height < 1)
    throw new Error(`downscale: ${width}×${height} is not smaller than ${w}×${h}`);
  const xs = boxWeights(w, width);
  const ys = boxWeights(h, height);
  const area = (w / width) * (h / height);
  const out = new Uint8Array(width * height * count);
  for (let n = 0; n < count; n++) {
    const src = n * w * h;
    const dst = n * width * height;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        let full = 0;
        let sum = 0;
        for (const { index: sy, weight: wy } of ys[y]!)
          for (const { index: sx, weight: wx } of xs[x]!) {
            const c = cells[src + sy * w + sx]!;
            if (c === EMPTY) continue;
            full += wx * wy;
            sum += c * wx * wy;
          }
        out[dst + y * width + x] = full * 2 <= area ? EMPTY : Math.round(sum / full);
      }
  }
  return { ...frames, width, height, cells: out };
}

const edgeBits = (edges: Edge[]) => edges.reduce((bits, e) => bits | (1 << EDGES.indexOf(e)), 0);

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
  const fields = { ...frames.settings, ...(frames.source ? { source: frames.source } : {}) };
  const json = Object.keys(fields).length
    ? new TextEncoder().encode(JSON.stringify(fields))
    : new Uint8Array(0);
  const out = new Uint8Array(HEADER + json.length + body.length);
  const view = new DataView(out.buffer);
  for (let i = 0; i < 4; i++) out[i] = MAGIC.charCodeAt(i);
  view.setUint16(4, width, true);
  view.setUint16(6, height, true);
  view.setUint16(8, count, true);
  view.setUint16(10, Math.round(frames.fps * 100), true);
  view.setUint32(12, json.length, true);
  out[16] = edgeBits(frames.edges ?? findEdges(frames));
  out.set(json, HEADER);
  out.set(body, HEADER + json.length);
  return out;
}

/** The byte where the gzip data starts. */
function dataStart(data: Uint8Array): number {
  if (String.fromCharCode(...data.subarray(0, 4)) !== MAGIC) throw new Error('not a .pxv file');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return HEADER + view.getUint32(12, true);
}

/** Read the header, the settings and the source of a .pxv file, with no decompression. */
export function readHeader(data: Uint8Array): Omit<PixelFrames, 'cells'> {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const start = dataStart(data);
  const header: Omit<PixelFrames, 'cells'> = {
    width: view.getUint16(4, true),
    height: view.getUint16(6, true),
    count: view.getUint16(8, true),
    fps: view.getUint16(10, true) / 100,
    edges: EDGES.filter((_, i) => data[16]! & (1 << i)),
  };
  if (start > HEADER) {
    const json = new TextDecoder().decode(data.subarray(HEADER, start));
    const fields: unknown = JSON.parse(json);
    if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
      const { source, ...settings } = fields as Record<string, unknown>;
      if (typeof source === 'string') header.source = source;
      if (Object.keys(settings).length) header.settings = settings;
    }
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
