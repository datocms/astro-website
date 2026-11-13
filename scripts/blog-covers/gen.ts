// Make and check the covers of the blog (src/assets/blog-covers/). Read
// src/components/PixelCover/AGENTS.md (the rules and the process) and
// scripts/blog-covers/README.md (the commands) first.
//
//   npx tsx scripts/blog-covers/gen.ts render <slug>... [--try]
//   npx tsx scripts/blog-covers/gen.ts list
//   npx tsx scripts/blog-covers/gen.ts set <slug> <key=value>...
//   npx tsx scripts/blog-covers/gen.ts recolor <slug>...
//   npx tsx scripts/blog-covers/gen.ts sheet

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { blogCoverThemes } from '../../src/data/blogCoverThemes';
import { asciiJson, readText, writeText } from './png';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const COVERS = path.join(ROOT, 'src/assets/blog-covers');
const WORK = path.join(ROOT, 'tmp/blog-covers');
const SPECS = path.join(WORK, 'specs');
const PHOTOS = path.join(WORK, 'photos');
const PREVIEWS = path.join(WORK, 'preview');

const COLS = 100;
const ROWS = 58;
const SEAM = 50;
const KEYWORD = 'datocms-cover';

// ---- The spec and the record.

type Key = {
  /** A pixel lighter than this (0-255) can be ground. Default 222. */
  light?: number;
  /** A pixel with less chroma than this can be ground. Default 30. */
  chroma?: number;
  /** Remove this many px of light rim around the subject. Default 0. */
  erode?: number;
  /** Keep only this part of the photo: [x0, y0, x1, y1], fractions. */
  crop?: [number, number, number, number];
};

type Layer = {
  /** The file in tmp/blog-covers/photos/. */
  photo: string;
  /** The height of the subject in cells. */
  h: number;
  /** The left column of the subject. Give `x` or `cx`. */
  x?: number;
  /** The centre column of the subject. The seam is column 50. */
  cx?: number;
  /** The top row of the subject. */
  y: number;
  /** Mirror the photo. */
  flip?: boolean;
  key?: Key;
  /** The part of a cell that must be subject. Default 0.5. */
  coverage?: number;
  /** The luminance quantiles of the three tones. Default [0.4, 0.8]. */
  split?: [number, number];
};

/** The file tmp/blog-covers/specs/<slug>.json. */
type Spec = {
  slug: string;
  /** The animal, in plain words: "beagle", "red fox + hedgehog". */
  animal: string;
  /** The page of the photo on Envato (the item, not the search). */
  source?: string;
  layers: Layer[];
  /** Remove lone cells. Default true. */
  despeckle?: boolean;
};

/** The record in the PNG of a cover. */
type CoverRecord = {
  animal: string;
  source?: string;
  /** True when the photo has a licence and the cover uses the licensed file. */
  licensed: boolean;
  /** The theme of the colours of the file. */
  theme: string;
  layers: Layer[];
  despeckle?: boolean;
};

// ---- The colours.

type ThemeColours = { accent: string; ink: string; paper: string; hi: string };

// The colours of each theme, from src/styles/tokens.css (light scheme):
// `--theme-accent`, `--theme-ink`, the paper of the theme, and a light
// highlight. Change them here when the tokens change, then run `recolor`.
const THEMES: Record<string, ThemeColours> = {
  yellow: { accent: '#e8d855', ink: '#351615', paper: '#fdfff5', hi: '#f8f2c2' },
  orange: { accent: '#f07a3d', ink: '#42180f', paper: '#fffbf5', hi: '#e8d855' },
  green: { accent: '#93d44b', ink: '#1a4731', paper: '#f5fff5', hi: '#eef0a8' },
  purple: { accent: '#9d75f7', ink: '#18032e', paper: '#f6f5ff', hi: '#d1c4ff' },
  blue: { accent: '#50c9ed', ink: '#1a3a47', paper: '#edfeff', hi: '#cbf5ee' },
  pink: { accent: '#f28497', ink: '#3f0e16', paper: '#fff7f8', hi: '#ffd6b3' },
};

const hexToUnit = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function toOklab(hex: string) {
  const [r, g, b] = hexToUnit(hex).map(linear) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ] as const;
}

function fromOklab([L, a, b]: readonly [number, number, number]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const byte = (c: number) =>
    Math.round(Math.min(1, Math.max(0, gamma(c))) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${rgb.map(byte).join('')}`;
}

/** Mix two colours in OKLab, as CSS `color-mix(in oklab)`. `t` is the part of `b`. */
function mix(a: string, b: string, t: number) {
  const A = toOklab(a);
  const B = toOklab(b);
  return fromOklab([0, 1, 2].map((i) => A[i]! + (B[i]! - A[i]!) * t) as [number, number, number]);
}

type Palette = { ground: string; tones: [string, string, string] };

/**
 * The two palettes of a theme. Tone 0 is dark, 1 is the midtone, 2 is the
 * highlight.
 */
function palettes(theme: string) {
  const t = THEMES[theme];
  if (!t) throw new Error(`No colours for the theme "${theme}"`);
  return {
    // The left half, on the accent.
    accent: { ground: t.accent, tones: [t.ink, mix(t.ink, t.accent, 0.5), t.paper] } as Palette,
    // The right half, on the ink. The dark tone is a little lighter than the
    // ground, thus the dark parts of the animal show.
    inverse: { ground: t.ink, tones: [mix(t.ink, t.accent, 0.3), t.accent, t.hi] } as Palette,
  };
}

const paletteOf = (pal: ReturnType<typeof palettes>, column: number) =>
  column < SEAM ? pal.accent : pal.inverse;

// ---- Keying and sampling.

type Photo = { data: Buffer; w: number; h: number };
const photos = new Map<string, Photo>();

async function loadPhoto(file: string) {
  const cached = photos.get(file);
  if (cached) return cached;
  const full = path.join(PHOTOS, file);
  if (!fs.existsSync(full)) throw new Error(`No photo ${full}`);
  const { data, info } = await sharp(full)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const photo = { data, w: info.width, h: info.height };
  photos.set(file, photo);
  return photo;
}

/**
 * The mask of the subject. A pixel is ground when it is light, has low chroma,
 * and touches the edge of the photo through other ground pixels.
 */
function keyMask({ data, w, h }: Photo, key: Key) {
  const light = key.light ?? 222;
  const chroma = key.chroma ?? 30;
  const isGround = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3]!;
    const g = data[i * 3 + 1]!;
    const b = data[i * 3 + 2]!;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    if (min >= light && max - min <= chroma) isGround[i] = 1;
  }

  // A flood fill from the edge.
  const ground = new Uint8Array(w * h);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    const i = y * w + x;
    if (isGround[i] && !ground[i]) {
      ground[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % w;
    const y = (i - x) / w;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  // `erode` grows the ground: it removes the light rim of the backdrop.
  for (let e = 0; e < (key.erode ?? 0); e++) {
    const grown = ground.slice();
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (!ground[i] && (ground[i - 1] || ground[i + 1] || ground[i - w] || ground[i + w]))
          grown[i] = 1;
      }
    ground.set(grown);
  }

  // `crop` keeps only a part of the photo: it removes a branch or a shadow.
  const [cx0, cy0, cx1, cy1] = key.crop ?? [0, 0, 1, 1];
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const inside = x >= cx0 * w && x < cx1 * w && y >= cy0 * h && y < cy1 * h;
      mask[y * w + x] = !ground[y * w + x] && inside ? 1 : 0;
    }
  return mask;
}

function boundingBox(mask: Uint8Array, w: number, h: number) {
  let x0 = w;
  let y0 = h;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (mask[y * w + x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
  return { x0, y0, x1: x1 + 1, y1: y1 + 1 };
}

type Cell = { gx: number; gy: number; lum: number; tone: number };

/** Cut one subject into cells, each with the mean luminance of the subject in it. */
async function sample(layer: Layer) {
  const photo = await loadPhoto(layer.photo);
  const mask = keyMask(photo, layer.key ?? {});
  const box = boundingBox(mask, photo.w, photo.h);
  const step = (box.y1 - box.y0) / layer.h; // the px of the photo for each cell
  const width = Math.round((box.x1 - box.x0) / step);
  const left = layer.cx !== undefined ? Math.round(layer.cx - width / 2) : (layer.x ?? 0);
  const cells: Cell[] = [];
  for (let j = 0; j < layer.h; j++)
    for (let i = 0; i < width; i++) {
      const sx0 = Math.floor(box.x0 + i * step);
      const sy0 = Math.floor(box.y0 + j * step);
      const sx1 = Math.min(photo.w, Math.floor(box.x0 + (i + 1) * step));
      const sy1 = Math.min(photo.h, Math.floor(box.y0 + (j + 1) * step));
      let all = 0;
      let inside = 0;
      let lum = 0;
      for (let y = sy0; y < sy1; y++)
        for (let x = sx0; x < sx1; x++) {
          all++;
          const k = y * photo.w + x;
          if (!mask[k]) continue;
          inside++;
          lum +=
            0.2126 * photo.data[k * 3]! +
            0.7152 * photo.data[k * 3 + 1]! +
            0.0722 * photo.data[k * 3 + 2]!;
        }
      if (all === 0 || inside / all < (layer.coverage ?? 0.5)) continue;
      const column = layer.flip ? width - 1 - i : i;
      cells.push({ gx: left + column, gy: layer.y + j, lum: lum / inside, tone: 0 });
    }

  // The three tones. The limits are quantiles of the luminance of this
  // subject, thus each subject uses the three tones.
  const sorted = cells.map((c) => c.lum).sort((a, b) => a - b);
  const [q1, q2] = layer.split ?? [0.4, 0.8];
  const t1 = sorted[Math.floor(q1 * (sorted.length - 1))]!;
  const t2 = sorted[Math.floor(q2 * (sorted.length - 1))]!;
  for (const c of cells) c.tone = c.lum < t1 ? 0 : c.lum < t2 ? 1 : 2;
  return cells;
}

/** The grid: for each cell, -1 (ground) or the tone 0, 1 or 2. */
type Grid = Int8Array;

async function buildGrid(spec: Spec) {
  const grid: Grid = new Int8Array(COLS * ROWS).fill(-1);
  let cut = 0; // the cells of a subject out of the frame at the top or the sides
  for (const layer of spec.layers) {
    for (const c of await sample(layer)) {
      // The bottom edge can cut the subject. The other edges cannot.
      if (c.gy >= ROWS) continue;
      if (c.gx < 0 || c.gx >= COLS || c.gy < 0) {
        cut++;
        continue;
      }
      grid[c.gy * COLS + c.gx] = c.tone;
    }
  }

  // Despeckle: a cell with no neighbour of its tone takes the most common
  // tone of its neighbours. One lone cell is noise at feed size.
  if (spec.despeckle !== false) {
    const copy = grid.slice();
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const tone = copy[y * COLS + x]!;
        if (tone < 0) continue;
        const near: number[] = [];
        for (const [dx, dy] of NEIGHBOURS) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= COLS || yy >= ROWS) continue;
          const v = copy[yy * COLS + xx]!;
          if (v >= 0) near.push(v);
        }
        if (near.length >= 3 && !near.includes(tone)) {
          const count = [0, 0, 0];
          for (const v of near) count[v]!++;
          grid[y * COLS + x] = count.indexOf(Math.max(...count));
        }
      }
  }
  return { grid, cut };
}

const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

// ---- The file of the site: one pixel for each cell.

function cellsOf(grid: Grid, theme: string) {
  const pal = palettes(theme);
  const buffer = Buffer.alloc(COLS * ROWS * 3);
  for (let i = 0; i < COLS * ROWS; i++) {
    const p = paletteOf(pal, i % COLS);
    const tone = grid[i]!;
    buffer.set(hexToRgb(tone < 0 ? p.ground : p.tones[tone]!), i * 3);
  }
  return buffer;
}

/** The grid of a cover file, from its colours and the theme of its colours. */
async function readGrid(file: string, theme: string) {
  const pal = palettes(theme);
  const { data } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const grid: Grid = new Int8Array(COLS * ROWS).fill(-1);
  for (let i = 0; i < COLS * ROWS; i++) {
    const p = paletteOf(pal, i % COLS);
    const hex = `#${[0, 1, 2].map((k) => data[i * 3 + k]!.toString(16).padStart(2, '0')).join('')}`;
    if (hex === p.ground) continue;
    const tone = p.tones.indexOf(hex);
    if (tone < 0) throw new Error(`${file}: the colour ${hex} is not of the theme "${theme}"`);
    grid[i] = tone;
  }
  return grid;
}

async function writeCover(slug: string, grid: Grid, record: CoverRecord) {
  const png = await sharp(cellsOf(grid, record.theme), {
    raw: { width: COLS, height: ROWS, channels: 3 },
  })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  fs.writeFileSync(path.join(COVERS, `${slug}.png`), writeText(png, KEYWORD, asciiJson(record)));
}

function readRecord(slug: string): CoverRecord | undefined {
  const file = path.join(COVERS, `${slug}.png`);
  const text = readText(fs.readFileSync(file), KEYWORD);
  return text ? (JSON.parse(text) as CoverRecord) : undefined;
}

// ---- Drawing, as src/components/PixelCover draws it: a box of `bw` × `bh`
// device px, a pitch of whole device px, a gap of 1 device px when the
// pitch is 6 or more, the grid in the middle of the box. With `flat`, the
// subject is one colour: the test of the silhouette.

function draw(grid: Grid, theme: string, bw: number, bh: number, { flat = false } = {}) {
  const pal = palettes(theme);
  const pitch = Math.max(1, Math.round(Math.min(bw / COLS, bh / ROWS)));
  const gap = pitch >= 6 ? 1 : 0;
  const left = Math.floor((bw - pitch * COLS) / 2);
  const top = Math.floor((bh - pitch * ROWS) / 2);
  const seam = left + pitch * SEAM;
  const buffer = Buffer.alloc(bw * bh * 3);
  const accent = hexToRgb(pal.accent.ground);
  const ink = hexToRgb(pal.inverse.ground);
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) buffer.set(x < seam ? accent : ink, (y * bw + x) * 3);
  for (let gy = 0; gy < ROWS; gy++)
    for (let gx = 0; gx < COLS; gx++) {
      const tone = grid[gy * COLS + gx]!;
      const p = paletteOf(pal, gx);
      const colour = hexToRgb(
        tone < 0 ? p.ground : flat ? p.tones[gx < SEAM ? 0 : 2] : p.tones[tone]!,
      );
      for (let yy = 0; yy < pitch - gap; yy++)
        for (let xx = 0; xx < pitch - gap; xx++) {
          const X = left + gx * pitch + xx;
          const Y = top + gy * pitch + yy;
          if (X >= 0 && Y >= 0 && X < bw && Y < bh) buffer.set(colour, (Y * bw + X) * 3);
        }
    }
  return sharp(buffer, { raw: { width: bw, height: bh, channels: 3 } });
}

/**
 * The preview of a cover:
 *   top left: a feed card on a 2× screen (733 × 428 device px)
 *   top right: the same card on a 1× screen (366 × 214), shown at 2×
 *   bottom left: the silhouette on a 2× card
 *   bottom right: the post header on a 2× screen (1424 × 1120), at half size
 *   bottom strip: the cover at 20 px high, shown at 4×
 */
async function writePreview(file: string, grid: Grid, theme: string) {
  const feed2 = await draw(grid, theme, 733, 428).png().toBuffer();
  const feed1 = await draw(grid, theme, 366, 214)
    .resize(732, 428, { kernel: 'nearest' })
    .png()
    .toBuffer();
  const flat = await draw(grid, theme, 733, 428, { flat: true }).png().toBuffer();
  const header = await draw(grid, theme, 1424, 1120)
    .resize(712, 560, { kernel: 'nearest' })
    .png()
    .toBuffer();
  // The site draws a cover of 20 px with a pitch of 1 device px: the
  // browser shows the cells smaller than one px. Here the large drawing is
  // scaled down, as a browser scales a small image.
  const tiny = await draw(grid, theme, 1200, 700)
    .resize(34, 20, { kernel: 'lanczos3' })
    .resize(136, 80, { kernel: 'nearest' })
    .png()
    .toBuffer();
  const g = 16;
  await sharp({
    create: {
      width: 733 * 2 + g * 3,
      height: 428 + 560 + 80 + g * 4,
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite([
      { input: feed2, left: g, top: g },
      { input: feed1, left: 733 + g * 2, top: g },
      { input: flat, left: g, top: 428 + g * 2 },
      { input: header, left: 733 + g * 2, top: 428 + g * 2 },
      { input: tiny, left: g, top: 428 + 560 + g * 3 },
    ])
    .png()
    .toFile(file);
}

// ---- The checks. See "Checks" in src/components/PixelCover/AGENTS.md.

function checks(grid: Grid, cut: number, layers: number) {
  let x0 = COLS;
  let y0 = ROWS;
  let x1 = -1;
  let y1 = -1;
  let n = 0;
  let left = 0;
  let lone = 0;
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const tone = grid[y * COLS + x]!;
      if (tone < 0) continue;
      n++;
      if (x < SEAM) left++;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      let same = 0;
      for (const [dx, dy] of NEIGHBOURS) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < COLS && yy < ROWS && grid[yy * COLS + xx] === tone) same++;
      }
      if (same <= 1) lone++;
    }

  const lines: { ok: boolean; text: string }[] = [];
  const add = (ok: boolean, text: string) => lines.push({ ok, text });
  add(cut === 0, `no subject cell out of the frame at the top or the sides (${cut})`);
  add(x0 >= 5 && COLS - 1 - x1 >= 5, `margin left/right >= 5 cells (${x0} / ${COLS - 1 - x1})`);
  const bottom = ROWS - 1 - y1;
  add(
    y0 >= 3 && (bottom >= 3 || bottom === 0),
    `margin top >= 3, bottom >= 3 or 0 (cut) cells (${y0} / ${bottom})`,
  );
  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;
  add(
    bh >= 44 || bw >= 82,
    `subject fills the frame: ${bw} × ${bh} cells (height >= 44 or width >= 82)`,
  );
  const share = n ? left / n : 0;
  add(
    share >= 0.2 && share <= 0.8,
    `subject crosses the seam: ${Math.round(share * 100)}% on the accent (20-80%)`,
  );
  const noise = n ? lone / n : 1;
  add(
    noise <= 0.3,
    `noise: ${Math.round(noise * 100)}% of the cells have 0 or 1 neighbour of their tone (<= 30%)`,
  );

  // The parts of the silhouette: groups of subject cells that touch (8
  // neighbours). A clear subject is one large part. Small loose parts (legs,
  // antennae, leaves) are noise at feed size.
  const seen = new Uint8Array(COLS * ROWS);
  const sizes: number[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    if (grid[i]! < 0 || seen[i]) continue;
    let size = 0;
    const stack = [i];
    seen[i] = 1;
    while (stack.length) {
      const k = stack.pop()!;
      size++;
      const x = k % COLS;
      const y = (k - x) / COLS;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= COLS || yy >= ROWS) continue;
          const j = yy * COLS + xx;
          if (grid[j]! >= 0 && !seen[j]) {
            seen[j] = 1;
            stack.push(j);
          }
        }
    }
    sizes.push(size);
  }
  sizes.sort((p, q) => q - p);
  const loose = sizes.filter((s) => s < 0.05 * n).length;
  // A pair (two layers) can be two parts.
  const main = sizes.slice(0, layers).reduce((p, q) => p + q, 0);
  add(
    n > 0 && main >= 0.9 * n,
    `main parts: the ${layers} largest part(s) are ${n ? Math.round((main / n) * 100) : 0}% of the subject (>= 90%)`,
  );
  add(loose <= 4, `loose bits: ${loose} small parts (<= 4)`);
  return lines;
}

// ---- The commands.

function themeOf(slug: string) {
  const theme = blogCoverThemes[slug];
  if (!theme) throw new Error(`${slug} has no theme: add it to src/data/blogCoverThemes.ts`);
  return theme;
}

async function render(slugs: string[], { tryOnly }: { tryOnly: boolean }) {
  fs.mkdirSync(PREVIEWS, { recursive: true });
  let failed = false;
  for (const slug of slugs) {
    const file = path.join(SPECS, `${slug}.json`);
    if (!fs.existsSync(file)) throw new Error(`No spec ${file}`);
    const spec = JSON.parse(fs.readFileSync(file, 'utf8')) as Spec;
    if (!spec.animal) throw new Error(`${file}: give the animal`);
    const theme = themeOf(slug);
    const { grid, cut } = await buildGrid(spec);
    const preview = path.join(PREVIEWS, `${slug}.png`);
    await writePreview(preview, grid, theme);
    const lines = checks(grid, cut, Math.min(2, spec.layers.length));
    const ok = lines.every((l) => l.ok);
    if (!ok) failed = true;

    console.log(`\n${slug} (${spec.animal}, ${theme})`);
    for (const l of lines) console.log(`  ${l.ok ? 'ok  ' : 'FAIL'} ${l.text}`);
    console.log(`  preview: ${path.relative(ROOT, preview)}`);
    if (tryOnly) continue;
    if (!ok) {
      console.log('  The cover file did not change: a check failed.');
      continue;
    }
    // A new photo has no licence. The same photo keeps the licence.
    const before = fs.existsSync(path.join(COVERS, `${slug}.png`)) ? readRecord(slug) : undefined;
    const samePhotos =
      before?.layers.map((l) => l.photo).join() === spec.layers.map((l) => l.photo).join();
    await writeCover(slug, grid, {
      animal: spec.animal,
      source: spec.source,
      licensed: samePhotos ? (before?.licensed ?? false) : false,
      theme,
      layers: spec.layers,
      despeckle: spec.despeckle,
    });
    console.log(`  cover: src/assets/blog-covers/${slug}.png`);
  }
  if (failed) process.exitCode = 1;
}

function slugsOnDisk() {
  return fs
    .readdirSync(COVERS)
    .filter((f) => f.endsWith('.png'))
    .map((f) => f.slice(0, -4));
}

function list() {
  const animals = new Map<string, string[]>();
  for (const slug of slugsOnDisk()) {
    const record = readRecord(slug);
    const theme = blogCoverThemes[slug];
    const notes: string[] = [];
    if (!record) notes.push('NO RECORD');
    if (!theme) notes.push('NO THEME in blogCoverThemes.ts');
    if (record && theme && record.theme !== theme)
      notes.push(`COLOURS OF ${record.theme}: recolor`);
    if (record && !record.licensed) notes.push('not licensed');
    if (record && !record.source) notes.push('no source');
    console.log(
      `${slug}\n  ${record?.animal ?? '?'} · ${theme ?? '?'}${notes.length ? ` · ${notes.join(' · ')}` : ''}${record?.source ? `\n  ${record.source}` : ''}`,
    );
    for (const animal of (record?.animal ?? '').split('+').map((a) => a.trim().toLowerCase())) {
      if (animal) animals.set(animal, [...(animals.get(animal) ?? []), slug]);
    }
  }
  for (const [animal, slugs] of animals)
    if (slugs.length > 1) console.log(`\nTWICE: ${animal} (${slugs.join(', ')})`);
  for (const slug of Object.keys(blogCoverThemes))
    if (!slugsOnDisk().includes(slug)) console.log(`\nNO FILE: ${slug} has a theme but no cover`);
}

async function set(slug: string, pairs: string[]) {
  const record = readRecord(slug);
  if (!record) throw new Error(`${slug} has no record: render it from a spec`);
  for (const pair of pairs) {
    const [key, ...rest] = pair.split('=');
    const value = rest.join('=');
    if (key === 'animal') record.animal = value;
    else if (key === 'source') record.source = value || undefined;
    else if (key === 'licensed') record.licensed = value === 'true';
    else throw new Error(`Unknown key "${key}": use animal, source or licensed`);
  }
  const file = path.join(COVERS, `${slug}.png`);
  fs.writeFileSync(file, writeText(fs.readFileSync(file), KEYWORD, asciiJson(record)));
  console.log(`${slug}: ${JSON.stringify({ ...record, layers: undefined })}`);
}

async function recolor(slugs: string[]) {
  for (const slug of slugs) {
    const record = readRecord(slug);
    if (!record) throw new Error(`${slug} has no record`);
    const theme = themeOf(slug);
    const grid = await readGrid(path.join(COVERS, `${slug}.png`), record.theme);
    await writeCover(slug, grid, { ...record, theme });
    console.log(`${slug}: ${record.theme} → ${theme}`);
  }
}

/** All the covers at feed size on a 2× screen, three in each row, in the order of the themes. */
async function sheet() {
  const cw = 732;
  const ch = 428;
  const g = 24;
  const slugs = Object.keys(blogCoverThemes).filter((s) => slugsOnDisk().includes(s));
  const inputs = [];
  for (const [i, slug] of slugs.entries()) {
    const record = readRecord(slug);
    if (!record) continue;
    const grid = await readGrid(path.join(COVERS, `${slug}.png`), record.theme);
    inputs.push({
      input: await draw(grid, record.theme, cw, ch).png().toBuffer(),
      left: g + (i % 3) * (cw + g),
      top: g + Math.floor(i / 3) * (ch + g),
    });
  }
  const rows = Math.ceil(slugs.length / 3);
  const file = path.join(WORK, 'sheet.png');
  fs.mkdirSync(WORK, { recursive: true });
  await sharp({
    create: {
      width: g + 3 * (cw + g),
      height: g + rows * (ch + g),
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite(inputs)
    .png()
    .toFile(file);
  console.log(path.relative(ROOT, file));
}

const [command, ...args] = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const words = args.filter((a) => !a.startsWith('--'));

switch (command) {
  case 'render':
    await render(words, { tryOnly: flags.includes('--try') });
    break;
  case 'list':
    list();
    break;
  case 'set':
    await set(words[0]!, words.slice(1));
    break;
  case 'recolor':
    await recolor(words.length ? words : slugsOnDisk());
    break;
  case 'sheet':
    await sheet();
    break;
  default:
    console.log(
      'Usage: gen.ts render <slug>... [--try] | list | set <slug> key=value... | recolor [<slug>...] | sheet',
    );
    process.exitCode = 1;
}
