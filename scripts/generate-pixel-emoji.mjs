// @ts-check
// Writes src/components/PixelEmoji/drawings.json, the pixel emojis of
// SerenityOS as SVG paths, and the licence of the set next to it.
// Usage: npm run generate-pixel-emoji
//
// To use a newer version of the set, change COMMIT and run the script again.
// The run replaces drawings.json: do not edit that file by hand.

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const COMMIT = 'd2d78ed7156a9e2a4d7ba1678fde412e347ffa82';
const API = 'https://api.github.com/repos/SerenityOS/serenity';
const RAW = `https://raw.githubusercontent.com/SerenityOS/serenity/${COMMIT}`;
const OUT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/components/PixelEmoji',
);

/** The side of the drawing, in cells. The component uses the same value. */
const GRID = 10;
const CONCURRENCY = 16;

/** @param {string} url */
async function fetchOrThrow(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response;
}

/**
 * Gets the names of the PNG files of the set. The API of the directory
 * contents stops at 1000 files, thus this call reads the git tree.
 * @returns {Promise<string[]>}
 */
async function listFiles() {
  const contents = await fetchOrThrow(`${API}/contents/Base/res?ref=${COMMIT}`);
  const folders = /** @type {{ name: string; sha: string }[]} */ (await contents.json());
  const folder = folders.find((entry) => entry.name === 'emoji');
  if (!folder) throw new Error('Base/res has no emoji directory');

  const response = await fetchOrThrow(`${API}/git/trees/${folder.sha}`);
  const tree = /** @type {{ truncated: boolean; tree: { path: string }[] }} */ (
    await response.json()
  );
  if (tree.truncated) throw new Error('GitHub truncated the list of files');
  return tree.tree.map((entry) => entry.path).filter((name) => name.endsWith('.png'));
}

/**
 * Gets the key of a file: U+1F9D9_U+200D_U+2642.png gives 1f9d9-200d-2642.
 * @param {string} file
 */
function keyOf(file) {
  return file
    .replace('.png', '')
    .split('_')
    .map((part) => part.replace('U+', '').replace(/^0+/, '').toLowerCase())
    .join('-');
}

/**
 * Tells if a key contains a private code point. SerenityOS uses these code
 * points for its own symbols, and they are not emojis.
 * @param {string} key
 */
function isPrivate(key) {
  return key.split('-').some((hex) => {
    const codePoint = parseInt(hex, 16);
    return (codePoint >= 0xe000 && codePoint <= 0xf8ff) || codePoint >= 0xf0000;
  });
}

/**
 * Makes the SVG content of a PNG: one path for each colour.
 * A narrow image goes to the centre of the grid, on whole cells.
 * @param {Buffer} png
 */
async function drawingOf(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  if (width > GRID || height > GRID) return null;

  const left = Math.floor((GRID - width) / 2);
  const top = Math.floor((GRID - height) / 2);

  /** @param {number} x @param {number} y */
  const colourAt = (x, y) => {
    const offset = (y * width + x) * 4;
    if ((data[offset + 3] ?? 0) < 128) return null;
    return (
      '#' +
      [0, 1, 2]
        .map((channel) => (data[offset + channel] ?? 0).toString(16).padStart(2, '0'))
        .join('')
    );
  };

  /** @type {Map<string, string>} */
  const paths = new Map();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width;) {
      const colour = colourAt(x, y);
      if (!colour) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < width && colourAt(x + run, y) === colour) run++;
      const cells = `M${x + left} ${y + top}h${run}v1h-${run}z`;
      paths.set(colour, (paths.get(colour) ?? '') + cells);
      x += run;
    }
  }

  return [...paths].map(([colour, d]) => `<path fill="${colour}" d="${d}"/>`).join('');
}

const files = (await listFiles()).filter((file) => !isPrivate(keyOf(file)));
console.log(`${files.length} emojis at ${COMMIT.slice(0, 7)}`);

/** @type {[string, string][]} */
const entries = [];
/** @type {string[]} */
const skipped = [];
const queue = [...files];

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let file = queue.shift(); file; file = queue.shift()) {
      const response = await fetchOrThrow(`${RAW}/Base/res/emoji/${file}`);
      const drawing = await drawingOf(Buffer.from(await response.arrayBuffer()));
      if (drawing) entries.push([keyOf(file), drawing]);
      else skipped.push(file);
    }
  }),
);

// The sort keeps the diff of a new version small.
entries.sort(([a], [b]) => a.localeCompare(b));

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  path.join(OUT_DIR, 'drawings.json'),
  `{\n${entries.map(([key, body]) => `${JSON.stringify(key)}:${JSON.stringify(body)}`).join(',\n')}\n}\n`,
);
const licence = await fetchOrThrow(`${RAW}/LICENSE`);
writeFileSync(path.join(OUT_DIR, 'LICENSE'), await licence.text());

console.log(`${entries.length} drawings written`);
if (skipped.length > 0) console.log(`Skipped, larger than the grid: ${skipped.join(' ')}`);
