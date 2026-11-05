// Show or set the edges, the source, the frame rate and the settings of .pxv files. The cells do not
// change.
//
// Usage:
//   npx tsx scripts/pixel-videos/meta.ts <file.pxv> ...                    show
//   npx tsx scripts/pixel-videos/meta.ts <file.pxv> ... --set <key=value> ...
//
// Keys:
//   edges=<list>   the edges that cut the subject (see `Edge` in
//                  src/lib/pixel-video/format.ts): `left,right`, `none`, or
//                  `auto` (`findEdges()`). Use a list for an opaque video:
//                  `auto` gives no edges for it
//   source=<url>   the URL of the footage, to find it again. `source=`
//                  removes it
//   palette=<name> a palette of src/lib/pixel-video/styles.ts. `palette=`
//                  removes it: the default (`tonal`) applies
//   fps=<n>        the frames per second. A lower value plays the same
//                  frames slower
//   focus=<0-1>    the point of the subject, from the left, that stays in
//                  the centre when a container cuts the sides. `focus=`
//                  removes it: the default (0.5) applies
//
// The file keeps only these settings: `--set` removes the other keys.

import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import {
  decode,
  EDGES,
  edgeShares,
  type Edge,
  encode,
  findEdges,
} from '../../src/lib/pixel-video/format.ts';
import { DEFAULTS } from '../../src/lib/pixel-video/settings.ts';
import { findPalette, palettes } from '../../src/lib/pixel-video/styles.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { set: { type: 'string', multiple: true, default: [] } },
});
if (!positionals.length) throw new Error('usage: meta.ts <file.pxv> ... [--set key=value ...]');

// Read a setting from the text of `--set`.
function settingValue(key: string, text: string): unknown {
  if (key === 'focus') {
    const value = Number(text);
    if (!(value >= 0 && value <= 1)) throw new Error('--set: "focus" is a number from 0 to 1');
    return value;
  }
  if (key === 'palette') {
    if (!findPalette(text))
      throw new Error(`--set: no palette "${text}" (${palettes.map((p) => p.name).join(', ')})`);
    return text;
  }
  throw new Error(`--set: no setting "${key}" (${Object.keys(DEFAULTS).join(', ')})`);
}

function parseEdges(text: string, frames: Parameters<typeof findEdges>[0]): Edge[] {
  if (text === 'auto') return findEdges(frames);
  if (text === 'none') return [];
  return text.split(',').map((e) => {
    if (!EDGES.includes(e as Edge)) throw new Error(`--set: no edge "${e}"`);
    return e as Edge;
  });
}

for (const file of positionals) {
  let frames = await decode(new Uint8Array(readFileSync(file)));
  if (values.set.length) {
    // Keep only the known settings of the file.
    const settings: Record<string, unknown> = Object.fromEntries(
      Object.entries(frames.settings ?? {}).filter(([key]) => key in DEFAULTS),
    );
    let edges = frames.edges ?? [];
    let source = frames.source;
    let fps = frames.fps;
    for (const pair of values.set) {
      const [key, ...rest] = pair.split('=');
      const text = rest.join('=');
      if (!key || !pair.includes('=')) throw new Error(`--set: "${pair}" is not key=value`);
      if (key === 'edges') edges = parseEdges(text, frames);
      else if (key === 'source') source = text || undefined;
      else if (key === 'fps') {
        fps = Number(text);
        if (!(fps > 0 && fps <= 600)) throw new Error('--set: "fps" is a number from 0 to 600');
      } else if (text === '') delete settings[key];
      else settings[key] = settingValue(key, text);
    }
    const bytes = await encode({ ...frames, fps, settings, edges, source });
    const back = await decode(bytes);
    if (back.cells.some((v, i) => v !== frames.cells[i]))
      throw new Error(`${file}: round trip FAILED, the file did not change`);
    writeFileSync(file, bytes);
    frames = back;
  }
  const shares = edgeShares(frames);
  console.log(
    `${file}: ${frames.width}×${frames.height} cells, ${frames.count} frames at ${frames.fps} fps\n` +
      `  edges ${frames.edges?.join(',') || 'none'} (touched: ` +
      EDGES.map((e) => `${e} ${(shares[e] * 100).toFixed(1)}%`).join(', ') +
      `)\n  source ${frames.source ?? 'none'}\n  settings ${JSON.stringify(frames.settings ?? {})}`,
  );
}
