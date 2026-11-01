// Make a .pxv file from a video, with no browser. This does the same as
// /dev/pxv-editor: it reads the frames, sorts the pixels into the three
// layers by brightness, and writes the file with `encode()`.
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
//   --auto             find the thresholds with `autoThresholds()`
//   --style <label>    the style of the settings in the file (default: the
//                      first style of src/lib/pixel-video/styles.ts)
//   --same-size        one size for the three tones: one square for each
//                      cell (100 / width, in % of the drawn width)
//   --settings <json> extra settings, as a JSON object, on top of the style
//
// The script needs `ffmpeg` and `ffprobe` on the PATH.

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import {
  autoThresholds,
  classify,
  decode,
  DEFAULT_THRESHOLDS,
  encode,
  flatten,
  histogram,
  readPixels,
} from '../../src/lib/pixel-video/format.ts';
import { pixelStyles as styles } from '../../src/lib/pixel-video/styles.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    fps: { type: 'string' },
    'max-side': { type: 'string', default: '160' },
    height: { type: 'string' },
    't-mid': { type: 'string' },
    't-high': { type: 'string' },
    auto: { type: 'boolean', default: false },
    style: { type: 'string' },
    'same-size': { type: 'boolean', default: false },
    settings: { type: 'string' },
  },
});
const [input, output] = positionals;
if (!input || !output) {
  console.error('Usage: encode.ts <in.mp4> <out.pxv> [options]');
  process.exit(1);
}

const maxSide = Number(values['max-side']);

// The size of the cells: the same rule as `extractFrames()`.
const [vw, vh, rate] = execFileSync(
  'ffprobe',
  [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height,r_frame_rate',
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
const flat = flatten(luma, alpha, null);

const thresholds = values.auto
  ? autoThresholds(histogram(flat))
  : {
      tMid: values['t-mid'] ? Number(values['t-mid']) : DEFAULT_THRESHOLDS.tMid,
      tHigh: values['t-high'] ? Number(values['t-high']) : DEFAULT_THRESHOLDS.tHigh,
    };
const cells = classify(flat, thresholds);

const style = values.style ? styles.find((s) => s.label === values.style) : styles[0];
if (!style) throw new Error(`no style "${values.style}"`);
// One size for the three tones: one square for each cell of the file. The
// sizes are a % of the drawn width (see settings.ts), thus a cell is
// 100 / width.
const cellSize = Math.round((100 / width) * 1000) / 1000;
const sizes = values['same-size']
  ? { bgSize: cellSize, midSize: cellSize, highSize: cellSize }
  : {};
const settings = {
  ...style.settings,
  ...sizes,
  ...(values.settings ? JSON.parse(values.settings) : {}),
};

const bytes = await encode({ width, height, fps, count, cells, settings });

// Check that the decoder gives back the same cells.
const back = await decode(bytes);
if (back.cells.length !== cells.length || back.cells.some((v, i) => v !== cells[i]))
  throw new Error('round trip FAILED: the decoder gives other cells');

writeFileSync(output, bytes);

const share = [0, 0, 0];
for (const c of cells) if (c < 3) share[c]!++;
const pct = (n: number) => `${Math.round((n / cells.length) * 100)}%`;
console.log(
  `${output}: ${(bytes.length / 1024).toFixed(1)} KB, ${width}×${height} cells, ${count} frames at ${fps} fps, ` +
    `thresholds ${thresholds.tMid}/${thresholds.tHigh}, bg ${pct(share[0]!)} mid ${pct(share[1]!)} high ${pct(share[2]!)}, round trip OK`,
);
