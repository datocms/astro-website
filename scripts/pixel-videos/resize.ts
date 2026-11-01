// Make a .pxv file with fewer cells: larger squares, a stronger pixel
// effect. The script reads the cells of the file (no source video), thus
// it only reduces the resolution. When the keyed .mov is in tmp/, encode it
// again with another --height: the cells then come from the footage.
//
// Usage:
//   npx tsx scripts/pixel-videos/resize.ts <in.pxv> <out.pxv> --height <n>
//   npx tsx scripts/pixel-videos/resize.ts <in.pxv> <out.pxv> --scale <0-1>
//
// <out.pxv> can be <in.pxv>. The width keeps the aspect ratio.
//
// Each cell is one square, thus the squares become larger on screen. The
// settings, the source and the edges do not change.

import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { decode, downscale, encode } from '../../src/lib/pixel-video/format.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { height: { type: 'string' }, scale: { type: 'string' } },
});
const [input, output] = positionals;
if (!input || !output || !!values.height === !!values.scale)
  throw new Error('usage: resize.ts <in.pxv> <out.pxv> (--height <n> | --scale <0-1>)');

const original = new Uint8Array(readFileSync(input));
const frames = await decode(original);
const height = values.height
  ? Number(values.height)
  : Math.round(frames.height * Number(values.scale));
const width = Math.max(1, Math.round((frames.width * height) / frames.height));
const small = downscale(frames, width, height);

const bytes = await encode(small);
const back = await decode(bytes);
if (back.cells.some((v, i) => v !== small.cells[i]))
  throw new Error('round trip FAILED: the decoder gives other cells');
writeFileSync(output, bytes);

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
console.log(
  `${output}: ${frames.width}×${frames.height} → ${width}×${height} cells, ` +
    `${kb(original.length)} → ${kb(bytes.length)}, ` +
    `edges ${back.edges?.join(',') || 'none'}`,
);
