// Make and check the covers of the blog. The CMS keeps them: the field
// `pixel_cover` of a blog post has the file, and the field `theme` has the
// theme. Read src/components/PixelCover/AGENTS.md (the rules and the
// process) and scripts/blog-covers/README.md (the commands) first.
//
// The script runs with the datocms CLI, which gives it a client of the CMS
// with the login of the user (`npx datocms login`). covers.sh starts it:
//
//   scripts/blog-covers/covers.sh render <slug>... [--try] [--theme=<theme>] [--variant=<name>]
//   scripts/blog-covers/covers.sh list
//   scripts/blog-covers/covers.sh set <slug> <key=value>...
//   scripts/blog-covers/covers.sh sheet

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Client } from 'datocms/lib/cma-client-node';
import sharp from 'sharp';
import {
  COLS,
  gridToPixels,
  layout,
  paletteOf,
  palettes,
  pixelsToGrid,
  ROWS,
  SEAM,
  type Grid,
  type Rgb,
  type ThemeColours,
} from '../../src/lib/pixel-cover/cover';
import { asciiJson, readText, writeText } from './png';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WORK = path.join(ROOT, 'tmp/blog-covers');
const SPECS = path.join(WORK, 'specs');
const PHOTOS = path.join(WORK, 'photos');
const PREVIEWS = path.join(WORK, 'preview');
// The files of the covers: `render` and `set` write them and send them to the CMS.
const COVERS = path.join(WORK, 'covers');

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
  /**
   * Make holes in the subject: an area of ground colour that the subject
   * closes (the inside of a shackle, of a handle, of a ring) becomes ground.
   * The value is the smallest area of a hole, a fraction of the photo.
   * `true` is 0.001. Default: no holes, because a white area of a subject is
   * not a hole.
   */
  holes?: boolean | number;
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
  /** The subject, in plain words: "beagle", "claw hammer + key". */
  subject: string;
  /** The page of the photo on Envato (the item, not the search). */
  source?: string;
  layers: Layer[];
  /** Remove lone cells. Default true. */
  despeckle?: boolean;
};

/** The record in the PNG of a cover. The theme is not in it: the CMS has the theme. */
type CoverRecord = {
  subject: string;
  source?: string;
  /** True when the photo has a licence and the cover uses the licensed file. */
  licensed: boolean;
  layers: Layer[];
  despeckle?: boolean;
};

// ---- The colours.

// The colours of each theme, from src/styles/tokens.css (light scheme):
// `--theme-accent`, `--theme-ink`, `--theme-paper` and
// `--theme-pixel-highlight`. The previews use them. The site reads the
// tokens: change this table when the tokens change.
const THEME_HEX: Record<string, { accent: string; ink: string; paper: string; highlight: string }> =
  {
    yellow: { accent: '#e8d855', ink: '#351615', paper: '#fdfff5', highlight: '#f8f2c2' },
    orange: { accent: '#f07a3d', ink: '#42180f', paper: '#fffbf5', highlight: '#e8d855' },
    green: { accent: '#93d44b', ink: '#1a4731', paper: '#f5fff5', highlight: '#eef0a8' },
    purple: { accent: '#9d75f7', ink: '#18032e', paper: '#f6f5ff', highlight: '#d1c4ff' },
    blue: { accent: '#50c9ed', ink: '#1a3a47', paper: '#edfeff', highlight: '#cbf5ee' },
    pink: { accent: '#f28497', ink: '#3f0e16', paper: '#fff7f8', highlight: '#ffd6b3' },
  };

const hexToRgb = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

function coloursOf(theme: string): ThemeColours {
  const hex = THEME_HEX[theme];
  if (!hex) throw new Error(`No theme "${theme}": use ${Object.keys(THEME_HEX).join(', ')}`);
  return {
    accent: hexToRgb(hex.accent),
    ink: hexToRgb(hex.ink),
    paper: hexToRgb(hex.paper),
    highlight: hexToRgb(hex.highlight),
  };
}

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

  // `holes`: the areas of ground colour that do not touch the edge.
  if (key.holes) {
    const smallest = (key.holes === true ? 0.001 : key.holes) * w * h;
    const seen = new Uint8Array(w * h);
    for (let start = 0; start < w * h; start++) {
      if (!isGround[start] || ground[start] || seen[start]) continue;
      const area = [start];
      seen[start] = 1;
      for (let n = 0; n < area.length; n++) {
        const i = area[n]!;
        const x = i % w;
        const near = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w];
        for (const k of near)
          if (k >= 0 && k < w * h && isGround[k] && !ground[k] && !seen[k]) {
            seen[k] = 1;
            area.push(k);
          }
      }
      if (area.length >= smallest) for (const i of area) ground[i] = 1;
    }
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
/** The photos that cut their subject at the top or at a side. */
const photoCuts = new Set<string>();

async function sample(layer: Layer) {
  const photo = await loadPhoto(layer.photo);
  const mask = keyMask(photo, layer.key ?? {});
  // The subject must not touch the top or a side of the photo: there the
  // photo cuts it. The bottom of the photo can cut it.
  let atEdge = 0;
  for (let x = 0; x < photo.w; x++) atEdge += mask[x]!;
  for (let y = 0; y < photo.h; y++) atEdge += mask[y * photo.w]! + mask[y * photo.w + photo.w - 1]!;
  if (atEdge > 3) photoCuts.add(layer.photo);
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

// ---- The file of a cover: one pixel for each cell, with only tones.

/** The PNG of a cover, with its record. */
async function encodeCover(grid: Grid, record: CoverRecord) {
  const png = await sharp(Buffer.from(gridToPixels(grid)), {
    raw: { width: COLS, height: ROWS, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  return writeText(png, KEYWORD, asciiJson(record));
}

/** The grid and the record of the PNG of a cover. */
async function decodeCover(png: Buffer, name: string) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { grid, error } = pixelsToGrid(data, info.width, info.height);
  if (!grid) throw new Error(`${name}: ${error}`);
  const text = readText(png, KEYWORD);
  return { grid, record: text ? (JSON.parse(text) as CoverRecord) : undefined };
}

// ---- Drawing, as src/components/PixelCover draws it (`layout` gives the
// pitch, the gap and the place of the grid in a box of `bw` × `bh` device
// px). With `flat`, the subject is one colour: the test of the silhouette.

function draw(grid: Grid, theme: string, bw: number, bh: number, { flat = false } = {}) {
  const pal = palettes(coloursOf(theme));
  const { pitch, gap, left, top, seam } = layout(bw, bh, grid);
  const buffer = Buffer.alloc(bw * bh * 3);
  const accent = pal.accent.ground;
  const ink = pal.inverse.ground;
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) buffer.set(x < seam ? accent : ink, (y * bw + x) * 3);
  for (let gy = 0; gy < ROWS; gy++)
    for (let gx = 0; gx < COLS; gx++) {
      const tone = grid[gy * COLS + gx]!;
      const p = paletteOf(pal, gx);
      const colour = tone < 0 ? p.ground : flat ? p.tones[gx < SEAM ? 0 : 2] : p.tones[tone]!;
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

function checks(grid: Grid, cut: number, layers: number, photos: string[]) {
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
  const cutPhotos = photos.filter((photo) => photoCuts.has(photo));
  add(
    cutPhotos.length === 0,
    `the photo does not cut the subject at the top or at a side${cutPhotos.length ? ` (${cutPhotos.join(', ')}: use a different photo, or key.crop to remove a corner that is not ground)` : ''}`,
  );
  add(x0 >= 5 && COLS - 1 - x1 >= 5, `margin left/right >= 5 cells (${x0} / ${COLS - 1 - x1})`);
  const bottom = ROWS - 1 - y1;
  add(
    y0 >= 3 && (bottom >= 3 || bottom === 0),
    `margin top >= 3, bottom >= 3 or 0 (cut) cells (${y0} / ${bottom})`,
  );
  const bw = x1 - x0 + 1;
  add(bw >= 32, `subject is not narrow: ${bw} columns wide (>= 32)`);
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

// ---- The CMS.

/** A blog post of the CMS: the fields that this script uses. */
type Post = {
  id: string;
  slug: string;
  theme?: string;
  /** The ID of the file of the cover. */
  coverId?: string;
  category?: string;
  /** True when the post has no changes that are not published. */
  published: boolean;
  /** True when the post was never published, or is not published now. */
  draft: boolean;
  date: string;
};

type Item = Awaited<ReturnType<Client['items']['find']>>;

function toPost(item: Item): Post {
  const cover = item.pixel_cover as { upload_id: string } | null;
  return {
    id: item.id,
    slug: String(item.slug),
    theme: (item.theme as string | null) || undefined,
    coverId: cover?.upload_id,
    category: (item.category as string | null) ?? undefined,
    published: item.meta.status === 'published',
    draft: item.meta.status === 'draft',
    date: item.meta.first_published_at ?? item.meta.created_at,
  };
}

/** All the blog posts, the newest first. */
async function allPosts(client: Client) {
  const posts: Post[] = [];
  for await (const item of client.items.listPagedIterator({
    filter: { type: 'blog_post' },
    version: 'current',
  }))
    posts.push(toPost(item as Item));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

async function findPost(client: Client, slug: string) {
  const [item] = await client.items.list({
    filter: { type: 'blog_post', fields: { slug: { eq: slug } } },
    version: 'current',
  });
  if (!item) throw new Error(`The CMS has no blog post with the slug "${slug}"`);
  return toPost(item as Item);
}

/** The file of the cover of a post, from the CMS. */
async function downloadCover(client: Client, post: Post) {
  if (!post.coverId) return undefined;
  const upload = await client.uploads.find(post.coverId);
  const response = await fetch(upload.url);
  if (!response.ok) throw new Error(`${upload.url}: ${response.status}`);
  return decodeCover(Buffer.from(await response.arrayBuffer()), post.slug);
}

/**
 * Send the file of a cover to the CMS and set the fields of the post. A post
 * that has a cover keeps its asset: the file of the asset changes. A post
 * with no changes that are not published is published again. A post with
 * such changes stays as it is: an editor publishes it.
 */
/**
 * The custom data of the asset of a cover: the subject, the source of the
 * photo and the licence. An editor reads them in the media area of the CMS.
 * The record in the file has the same values. Each locale gets them, and
 * keeps its other metadata.
 */
/** The tag of the asset of a cover. */
const COVER_TAG = 'pixel-cover';

async function writeCustomData(client: Client, uploadId: string, record: CoverRecord) {
  const { locales } = await client.site.find();
  const upload = await client.uploads.find(uploadId);
  const data = {
    subject: record.subject,
    source: record.source ?? '',
    licensed: record.licensed ? 'true' : 'false',
  };
  const customData: Record<string, Record<string, string>> = {};
  for (const locale of locales)
    customData[locale] = { ...upload.default_field_metadata.custom_data[locale], ...data };
  await client.uploads.update(uploadId, {
    // The tag finds all the covers in the media area.
    tags: [...new Set([...upload.tags.filter((tag) => tag !== 'blog-cover'), COVER_TAG])],
    default_field_metadata: { ...upload.default_field_metadata, custom_data: customData },
  });
}

async function saveCover(
  client: Client,
  post: Post,
  png: Buffer,
  theme: string,
  record: CoverRecord,
) {
  fs.mkdirSync(COVERS, { recursive: true });
  const localPath = path.join(COVERS, `${post.slug}.png`);
  fs.writeFileSync(localPath, png);
  const upload = post.coverId
    ? await client.uploads.updateFromLocalFile(post.coverId, { localPath })
    : await client.uploads.createFromLocalFile({
        localPath,
        filename: `cover-${post.slug}.png`,
        tags: [COVER_TAG],
      });
  await writeCustomData(client, upload.id, record);
  if (post.coverId !== upload.id || post.theme !== theme)
    await client.items.update(post.id, { pixel_cover: { upload_id: upload.id }, theme });
  if (post.published) {
    await client.items.publish(post.id);
    return 'published';
  }
  return post.draft
    ? 'saved. The post is a draft: the site shows the cover when an editor publishes the post'
    : 'saved, NOT PUBLISHED: the post has other changes that are not published. An editor publishes it in the CMS';
}

// ---- The commands.

async function render(
  client: Client,
  slugs: string[],
  { tryOnly, theme: newTheme, variant }: { tryOnly: boolean; theme?: string; variant?: string },
) {
  fs.mkdirSync(PREVIEWS, { recursive: true });
  let failed = false;
  for (const slug of slugs) {
    // A variant is a second spec of the same post: <slug>.<variant>.json. It
    // has its own preview and its own cover file, and it never goes to the CMS.
    const name = variant ? `${slug}.${variant}` : slug;
    const file = path.join(SPECS, `${name}.json`);
    if (!fs.existsSync(file)) throw new Error(`No spec ${file}`);
    const spec = JSON.parse(fs.readFileSync(file, 'utf8')) as Spec;
    if (!spec.subject) throw new Error(`${file}: give the subject`);
    // A try with a theme does not use the CMS: the post can be absent.
    const post = (tryOnly || variant) && newTheme ? undefined : await findPost(client, slug);
    const theme = newTheme ?? post?.theme;
    if (!theme) throw new Error(`${slug} has no theme in the CMS: give --theme=<theme>`);
    coloursOf(theme);
    const { grid, cut } = await buildGrid(spec);
    const preview = path.join(PREVIEWS, `${name}.png`);
    await writePreview(preview, grid, theme);
    const lines = checks(
      grid,
      cut,
      Math.min(2, spec.layers.length),
      spec.layers.map((layer) => layer.photo),
    );
    const ok = lines.every((l) => l.ok);
    if (!ok) failed = true;

    console.log(`\n${slug} (${spec.subject}, ${theme})`);
    for (const l of lines) console.log(`  ${l.ok ? 'ok  ' : 'FAIL'} ${l.text}`);
    console.log(`  preview: ${path.relative(ROOT, preview)}`);
    if (!ok) {
      if (!tryOnly) console.log('  The cover in the CMS did not change: a check failed.');
      continue;
    }
    // A new photo has no licence. The same photo keeps the licence.
    const before = post ? (await downloadCover(client, post))?.record : undefined;
    const samePhotos =
      before?.layers.map((l) => l.photo).join() === spec.layers.map((l) => l.photo).join();
    const record: CoverRecord = {
      subject: spec.subject,
      // The same photo keeps a source that `set` gave.
      source: spec.source ?? (samePhotos ? before?.source : undefined),
      licensed: samePhotos ? (before?.licensed ?? false) : false,
      layers: spec.layers,
      despeckle: spec.despeckle,
    };
    const png = await encodeCover(grid, record);
    // A try writes the file of the cover, but does not send it. A person can
    // put this file in the field `pixel_cover` of the post in the CMS.
    if (tryOnly || variant || !post) {
      fs.mkdirSync(COVERS, { recursive: true });
      const local = path.join(COVERS, `${name}.png`);
      fs.writeFileSync(local, png);
      console.log(`  cover file (not sent to the CMS): ${path.relative(ROOT, local)}`);
      continue;
    }
    console.log(`  CMS: ${await saveCover(client, post, png, theme, record)}`);
  }
  if (failed) process.exitCode = 1;
}

/** The posts with a cover, the newest first, each with its grid and its record. */
async function covers(client: Client, posts: Post[]) {
  const list = [];
  for (const post of posts.filter((p) => p.coverId)) {
    list.push({ post, ...(await downloadCover(client, post))! });
  }
  return list;
}

async function list(client: Client) {
  const posts = await allPosts(client);
  const subjects = new Map<string, string[]>();
  for (const { post, record } of await covers(client, posts)) {
    const notes: string[] = [];
    if (!record) notes.push('NO RECORD');
    if (!post.theme) notes.push('NO THEME in the CMS: the site does not show the cover');
    if (!post.published) notes.push('the post has changes that are not published');
    if (record && !record.licensed) notes.push('not licensed');
    if (record && !record.source) notes.push('no source');
    console.log(
      `${post.slug}\n  ${record?.subject ?? '?'} · ${post.theme ?? '?'}${notes.length ? ` · ${notes.join(' · ')}` : ''}${record?.source ? `\n  ${record.source}` : ''}`,
    );
    for (const subject of (record?.subject ?? '').split('+').map((a) => a.trim().toLowerCase())) {
      if (subject) subjects.set(subject, [...(subjects.get(subject) ?? []), post.slug]);
    }
  }
  for (const [subject, slugs] of subjects)
    if (slugs.length > 1) console.log(`\nTWICE: ${subject} (${slugs.join(', ')})`);

  // The featured row of a feed is its three newest posts: three different themes.
  const categories = await client.items.list({ filter: { type: 'blog_post_category' } });
  const feeds = [
    { name: 'all posts', posts },
    ...categories.map((category) => ({
      name: String(category.name),
      posts: posts.filter((post) => post.category === category.id),
    })),
  ];
  console.log('\nThe featured rows (the three newest posts of each feed):');
  for (const feed of feeds) {
    const three = feed.posts.slice(0, 3);
    if (three.length === 0) continue;
    console.log(`  ${feed.name}`);
    for (const post of three)
      console.log(
        `    ${post.theme ?? 'no theme'}${post.coverId ? '' : ' · no cover'}${post.published ? '' : ' · not published'} · ${post.slug}`,
      );
    const row = three.filter((post) => post.coverId && post.theme);
    if (new Set(row.map((post) => post.theme)).size < row.length)
      console.log(
        `\nSAME THEME IN A ROW (${feed.name}): ${row.map((post) => `${post.slug} · ${post.theme}`).join(', ')}`,
      );
  }
}

async function set(client: Client, slug: string, pairs: string[]) {
  const post = await findPost(client, slug);
  const cover = await downloadCover(client, post);
  if (!cover?.record) throw new Error(`${slug} has no cover with a record: render it from a spec`);
  const { grid, record } = cover;
  let theme = post.theme;
  for (const pair of pairs) {
    const [key, ...rest] = pair.split('=');
    const value = rest.join('=');
    if (key === 'subject') record.subject = value;
    else if (key === 'source') record.source = value || undefined;
    else if (key === 'licensed') record.licensed = value === 'true';
    else if (key === 'theme') theme = value;
    else throw new Error(`Unknown key "${key}": use subject, source, licensed or theme`);
  }
  if (!theme) throw new Error(`${slug} has no theme in the CMS: give theme=<theme>`);
  coloursOf(theme);
  const status = await saveCover(client, post, await encodeCover(grid, record), theme, record);
  console.log(
    `${slug}: ${JSON.stringify({ ...record, layers: undefined })}\n  theme (the field of the post): ${theme}\n  CMS: ${status}`,
  );
}

/** All the covers at feed size on a 2× screen, three in each row, the newest first. */
async function sheet(client: Client) {
  const cw = 732;
  const ch = 428;
  const g = 24;
  const all = (await covers(client, await allPosts(client))).filter(({ post }) => post.theme);
  const inputs = [];
  for (const [i, { post, grid }] of all.entries()) {
    inputs.push({
      input: await draw(grid, post.theme!, cw, ch).png().toBuffer(),
      left: g + (i % 3) * (cw + g),
      top: g + Math.floor(i / 3) * (ch + g),
    });
  }
  const rows = Math.ceil(all.length / 3);
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

/**
 * The datocms CLI calls this function with its client. covers.sh gives the
 * words of the command in COVERS_ARGS, a JSON list.
 */
export default async function (client: Client): Promise<void> {
  const [command, ...args] = JSON.parse(process.env.COVERS_ARGS ?? '[]') as string[];
  const flags = args.filter((a) => a.startsWith('--'));
  const words = args.filter((a) => !a.startsWith('--'));

  switch (command) {
    case 'render':
      await render(client, words, {
        tryOnly: flags.includes('--try'),
        theme: flags.find((f) => f.startsWith('--theme='))?.slice('--theme='.length),
        variant: flags.find((f) => f.startsWith('--variant='))?.slice('--variant='.length),
      });
      break;
    case 'list':
      await list(client);
      break;
    case 'set':
      await set(client, words[0]!, words.slice(1));
      break;
    case 'sheet':
      await sheet(client);
      break;
    default:
      console.log(
        'Usage: covers.sh render <slug>... [--try] [--theme=<theme>] [--variant=<name>] | list | set <slug> key=value... | sheet',
      );
      process.exitCode = 1;
  }
}
