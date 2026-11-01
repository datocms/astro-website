// Make a .pxv file from a video: it reads the frames, sorts the pixels into
// the three layers by brightness, and writes the file with `encode()`.
//
// Usage:
//   npx tsx scripts/pixel-videos/encode.ts <in.mp4> <out.pxv> [options]
//
// Options:
//   --fps <n>          frames per second (default: the rate of the video)
//   --max-side <n>     longest side, in cells (default 160)
//   --height <n>       the height, in cells (replaces --max-side). The footer
//                      draws each video at the same height, thus the same
//                      height gives the same size of square on screen
//   --t-mid <n>        midtone threshold, 0-256 (default 105)
//   --t-high <n>       highlight threshold, 0-256 (default 161)
//   --tones otsu       thresholds from the opaque pixels of the video: the
//                      three most distinct groups of tones (Otsu, 3 classes)
//   --tones thirds     thresholds from the opaque pixels: a third of them in
//                      each layer
//   --skin             thresholds from the opaque pixels: the darkest 5% in
//                      the background layer, the median as the highlight
//                      threshold. Only for a bare hand: dark clothes pull the
//                      median down
//   --auto            find the thresholds with `autoThresholds()`
//   --palette <name>   the palette of the file (`palettes` in
//                      src/lib/pixel-video/styles.ts, default `tonal`)
//   --focus <0-1>      the point of the subject, from the left, that stays
//                      in the centre when a container cuts the sides
//                      (default 0.5)
//   --matte <#rrggbb>  put the transparent pixels of the video on this colour
//                      (default: they are empty cells, nothing shows)
//   --preview <png>    also write a PNG with 8 frames of the cells
//   --palettes <png>   also write a PNG with 8 frames in the colours of the
//                      footer (purple theme): one row for each palette of
//                      a keyed clip (`tonal`, `onAccent`). Look at it to
//                      choose the palette
//   --source <url>     the URL of the footage, written in the file to find
//                      it again (for a YouTube video, add `&t=` for the start
//                      of the take)
//   --edges <list>     the edges that cut the subject (see `Edge` in
//                      src/lib/pixel-video/format.ts): `left,right`, `none`
//                      or `auto` (the default: `findEdges()`)
//
// A line gives the edges, and the part of the cells of each edge that the
// subject touches. The last line gives `dark`: the share of the subject (the cells that are
// not empty) in the background layer. With the `tonal` palette this part
// has the colour of the ground and does not show.
//
// The script needs `ffmpeg` and `ffprobe` on the PATH.

import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import {
  autoThresholds,
  EDGES,
  edgeShares,
  type Edge,
  classify,
  decode,
  DEFAULT_THRESHOLDS,
  encode,
  findEdges,
  flatten,
  histogram,
  lumaOf,
  readPixels,
} from '../../src/lib/pixel-video/format.ts';
import { findPalette } from '../../src/lib/pixel-video/styles.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    fps: { type: 'string' },
    'max-side': { type: 'string', default: '160' },
    height: { type: 'string' },
    't-mid': { type: 'string' },
    't-high': { type: 'string' },
    auto: { type: 'boolean', default: false },
    skin: { type: 'boolean', default: false },
    palette: { type: 'string', default: 'tonal' },
    focus: { type: 'string' },
    matte: { type: 'string' },
    preview: { type: 'string' },
    palettes: { type: 'string' },
    tones: { type: 'string' },
    edges: { type: 'string', default: 'auto' },
    source: { type: 'string' },
  },
});
const [input, output] = positionals;
if (!input || !output) {
  console.error('Usage: encode.ts <in.mp4> <out.pxv> [options]');
  process.exit(1);
}

const maxSide = Number(values['max-side']);

// The size of the cells.
const [vw, vh, rate] = execFileSync(
  'ffprobe',
  [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height,avg_frame_rate',
    '-of',
    'csv=p=0',
    input,
  ],
  { encoding: 'utf8' },
)
  .trim()
  .split(',') as [string, string, string];
const [num, den] = rate.split('/').map(Number) as [number, number];
const fps = values.fps ? Number(values.fps) : num / den;
const scale = values.height
  ? Number(values.height) / Number(vh)
  : Math.min(1, maxSide / Math.max(Number(vw), Number(vh)));
const width = Math.max(1, Math.round(Number(vw) * scale));
const height = Math.max(1, Math.round(Number(vh) * scale));

// ffmpeg gives all the frames as raw RGBA bytes.
const rgba = execFileSync(
  'ffmpeg',
  [
    '-v',
    'error',
    // The native VP9 decoder of ffmpeg drops the alpha of a webm.
    ...(input.endsWith('.webm') ? ['-c:v', 'libvpx-vp9'] : []),
    '-i',
    input,
    '-vf',
    `fps=${fps},scale=${width}:${height}:flags=bicubic`,
    '-f',
    'rawvideo',
    '-pix_fmt',
    'rgba',
    '-',
  ],
  { maxBuffer: 2 ** 31 - 1 },
);
const frameBytes = width * height * 4;
const count = Math.floor(rgba.length / frameBytes);
if (count < 1) throw new Error('ffmpeg gave no frames');
if (count > 0xffff) throw new Error('the video has too many frames');

const luma = new Uint8Array(width * height * count);
const alpha = new Uint8Array(width * height * count);
for (let i = 0; i < count; i++) {
  const frame = new Uint8Array(rgba.buffer, rgba.byteOffset + i * frameBytes, frameBytes);
  readPixels(frame, luma, alpha, i * width * height);
}
// A transparent pixel is an empty cell (nothing shows), or with `--matte` it
// is put on a background colour.
const matte = values.matte
  ? Math.round(
      lumaOf(
        parseInt(values.matte.slice(1, 3), 16),
        parseInt(values.matte.slice(3, 5), 16),
        parseInt(values.matte.slice(5, 7), 16),
      ),
    )
  : null;
const flat = flatten(luma, alpha, matte);

// The brightness of the opaque pixels (alpha above 128), for `--skin`.
const opaque = new Float64Array(256);
if (values.skin || values.tones)
  for (let i = 0; i < luma.length; i++) if (alpha[i]! > 128) opaque[luma[i]!]!++;
const opaqueTotal = opaque.reduce((a, b) => a + b, 0);
const percentile = (q: number) => {
  let sum = 0;
  for (let b = 0; b < 256; b++) if ((sum += opaque[b]!) >= q * opaqueTotal) return b;
  return 255;
};

// Otsu with three classes on the opaque pixels: the two thresholds that make
// the three groups of tones as distinct as possible (the largest variance
// between the classes).
const otsu = () => {
  const n = new Float64Array(257);
  const s = new Float64Array(257);
  for (let b = 0; b < 256; b++) {
    n[b + 1] = n[b]! + opaque[b]!;
    s[b + 1] = s[b]! + b * opaque[b]!;
  }
  const part = (a: number, b: number) => {
    const c = n[b]! - n[a]!;
    return c > 0 ? (s[b]! - s[a]!) ** 2 / c : 0;
  };
  let best = { tMid: 0, tHigh: 0 };
  let max = -1;
  for (let t1 = 1; t1 < 255; t1++)
    for (let t2 = t1 + 1; t2 < 256; t2++) {
      const v = part(0, t1) + part(t1, t2) + part(t2, 256);
      if (v > max) [max, best] = [v, { tMid: t1, tHigh: t2 }];
    }
  return best;
};

// `--t-mid` and `--t-high` replace the value that `--tones` finds.
const tones = values.skin ? 'skin' : values.tones;
const base =
  tones === 'skin'
    ? { tMid: percentile(0.05), tHigh: percentile(0.5) }
    : tones === 'thirds'
      ? { tMid: percentile(1 / 3), tHigh: percentile(2 / 3) }
      : tones === 'otsu'
        ? otsu()
        : values.auto
          ? autoThresholds(histogram(flat))
          : DEFAULT_THRESHOLDS;
const thresholds = {
  tMid: values['t-mid'] ? Number(values['t-mid']) : base.tMid,
  tHigh: values['t-high'] ? Number(values['t-high']) : base.tHigh,
};
const cells = classify(flat, thresholds);

if (!findPalette(values.palette!)) throw new Error(`no palette "${values.palette}"`);
// The settings of the file: only the palette and the focus (see
// src/lib/pixel-video/settings.ts).
const focus = values.focus === undefined ? undefined : Number(values.focus);
if (focus !== undefined && !(focus >= 0 && focus <= 1)) throw new Error('--focus: 0 to 1');
const settings = { palette: values.palette, ...(focus === undefined ? {} : { focus }) };

const frames = { width, height, fps, count, cells, settings };
const edges: Edge[] =
  values.edges === 'auto'
    ? findEdges(frames)
    : values.edges === 'none'
      ? []
      : values.edges!.split(',').map((e) => {
          if (!EDGES.includes(e as Edge)) throw new Error(`--edges: no edge "${e}"`);
          return e as Edge;
        });
const bytes = await encode({ ...frames, edges, source: values.source });

// Check that the decoder gives back the same cells.
const back = await decode(bytes);
if (back.cells.length !== cells.length || back.cells.some((v, i) => v !== cells[i]))
  throw new Error('round trip FAILED: the decoder gives other cells');

writeFileSync(output, bytes);

// The sheets: 8 frames of cells, side by side. Each cell is a square of
// S x S pixels.
const S = 4;
const picks = Array.from({ length: Math.min(8, count) }, (_, i) =>
  Math.round((i * (count - 1)) / Math.max(1, Math.min(8, count) - 1)),
);
type Rgb = [number, number, number];
// `colour(layer, x, y)` gives the colour of a pixel; x and y are in the
// frame, in sheet pixels.
const writeSheet = (file: string, rows: ((c: number, x: number, y: number) => Rgb)[]) => {
  const pw = width * S * picks.length;
  const rowH = height * S;
  const img = Buffer.alloc(pw * rowH * rows.length * 3);
  rows.forEach((colour, r) =>
    picks.forEach((frame, t) => {
      for (let y = 0; y < rowH; y++)
        for (let x = 0; x < width * S; x++) {
          const c = cells[frame * width * height + Math.floor(y / S) * width + Math.floor(x / S)]!;
          img.set(colour(c, x, y), ((r * rowH + y) * pw + t * width * S + x) * 3);
        }
    }),
  );
  // A file, not stdin: ffmpeg cuts a large raw frame that comes from a pipe.
  const raw = `${file}.rgb`;
  writeFileSync(raw, img);
  execFileSync('ffmpeg', [
    '-v',
    'error',
    '-y',
    '-f',
    'rawvideo',
    '-pix_fmt',
    'rgb24',
    '-s',
    `${pw}x${rowH * rows.length}`,
    '-i',
    raw,
    '-frames:v',
    '1',
    file,
  ]);
  rmSync(raw);
};

// `--preview`: background layer dark grey, midtone layer grey, highlight
// layer white, empty cell a checkerboard.
if (values.preview) {
  const tone = [70, 150, 235];
  writeSheet(values.preview, [
    (c, x, y) => {
      const v = c === 3 ? (((x >> 3) + (y >> 3)) % 2 ? 175 : 200) : tone[c]!;
      return [v, v, v];
    },
  ]);
}

// `--palettes`: the colours of the footer in the purple theme
// (src/styles/tokens.css). An empty cell shows the ground. The squares of
// the midtone and highlight layers have a stroke of the inverse surface, as
// in the footer; the squares of the background layer have no stroke.
if (values.palettes) {
  const inverse: Rgb = [0x1d, 0x22, 0x29];
  const accent: Rgb = [0x9e, 0x8e, 0xf5];
  const light: Rgb = [0xf6, 0xf5, 0xff];
  // color-mix(in oklab, inverse 50%, accent), approximately.
  const darkAccent: Rgb = [0x5a, 0x55, 0x86];
  const palette =
    (ground: Rgb, fills: [Rgb, Rgb, Rgb]) =>
    (c: number, x: number, y: number): Rgb =>
      c === 3 ? ground : c > 0 && (x % S === S - 1 || y % S === S - 1) ? inverse : fills[c]!;
  writeSheet(values.palettes, [
    palette(inverse, [inverse, accent, light]),
    palette(accent, [inverse, darkAccent, light]),
  ]);
}

const share = [0, 0, 0, 0];
for (const c of cells) share[c]!++;
const pct = (n: number) => `${Math.round((n / cells.length) * 100)}%`;
console.log(
  `${output}: ${(bytes.length / 1024).toFixed(1)} KB, ${width}×${height} cells, ${count} frames at ${fps} fps, ` +
    `thresholds ${thresholds.tMid}/${thresholds.tHigh}, bg ${pct(share[0]!)} mid ${pct(share[1]!)} high ${pct(share[2]!)} empty ${pct(share[3]!)}, round trip OK`,
);
const shares = edgeShares(frames);
console.log(
  `edges ${edges.join(',') || 'none'} (${values.edges}; touched: ` +
    EDGES.map((e) => `${e} ${(shares[e] * 100).toFixed(1)}%`).join(', ') +
    ')',
);
const subject = share[0]! + share[1]! + share[2]!;
console.log(`dark ${subject ? Math.round((share[0]! / subject) * 100) : 0}%`);
