import type { APIRoute } from 'astro';
import sharp from 'sharp';
import {
  bubbleLayout,
  bubblePath,
  COLUMNS as CHAT_COLUMNS,
  photoBox,
  photoPath,
  ROWS as CHAT_ROWS,
} from '~/components/ChatCover/layout';
import { ogCoverHeight, ogCoverWidth } from '~/lib/datocms/seo';
import type { OgCoverData } from '~/lib/ogCardUrl';
import { drawCover, pixelsToGrid, type Rgb, type ThemeColours } from '~/lib/pixel-cover/cover';
import type { Theme } from '~/lib/theme';
import { toArrayBuffer } from '~/lib/toArrayBuffer';
import { handleUnexpectedError, invalidRequestResponse } from '~/pages/api/_utils';
import { type OgPalette, palettes } from './_resources/palette';

/*
 * The OG image of an article: its cover, with no text. A social feed shows
 * the title below the image.
 *
 * The cover is the grid of 100 × 58 cells, with cells of 12 px. A post draws
 * its pixel cover with the rules of the site (`src/lib/pixel-cover/cover.ts`).
 * A chat draws the speech bubbles of its guests, as `ChatCover` does when it
 * does not move.
 */

/** The endpoint loads files only from the asset CDN of DatoCMS. */
const ASSET_HOST = 'www.datocms-assets.com';

async function loadAsset(url: string): Promise<Buffer> {
  if (new URL(url).hostname !== ASSET_HOST) {
    throw new Error(`The OG cover loads files only from ${ASSET_HOST}`);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url} for the OG cover: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const hexToRgb = (hex: string): Rgb => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

function themeColours(palette: OgPalette): ThemeColours {
  return {
    accent: hexToRgb(palette.accent),
    ink: hexToRgb(palette.ink),
    paper: hexToRgb(palette.paper),
    highlight: hexToRgb(palette.highlight),
  };
}

/**
 * A pixel cover. `drawCover` uses only `fillStyle` and `fillRect`, thus a
 * small context that fills an RGB buffer is sufficient.
 */
async function postCover(url: string, palette: OgPalette): Promise<Buffer> {
  const { data, info } = await sharp(await loadAsset(url))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { grid, error } = pixelsToGrid(data, info.width, info.height);
  if (!grid) throw new Error(`The OG cover cannot read ${url}: ${error}`);

  const width = ogCoverWidth;
  const height = ogCoverHeight;
  const pixels = Buffer.alloc(width * height * 3);
  let fill: Rgb = [0, 0, 0];
  const context = {
    // drawCover gives the colours as `rgb(r g b)`.
    set fillStyle(value: string) {
      const [r, g, b] = value.match(/\d+/g)!.map(Number);
      fill = [r!, g!, b!];
    },
    get fillStyle() {
      return `rgb(${fill.join(' ')})`;
    },
    fillRect(x: number, y: number, w: number, h: number) {
      const x0 = Math.max(0, x);
      const y0 = Math.max(0, y);
      const x1 = Math.min(width, x + w);
      const y1 = Math.min(height, y + h);
      for (let py = y0; py < y1; py++) {
        for (let px = x0; px < x1; px++) pixels.set(fill, (py * width + px) * 3);
      }
    },
  };
  drawCover(context, grid, themeColours(palette), width, height);

  return sharp(pixels, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();
}

/**
 * A portrait in black and white, as the CSS of `ChatCover` gives it:
 * `grayscale(1) contrast(1.05)`.
 */
async function portraitDataUri(url: string): Promise<string> {
  const jpeg = await sharp(await loadAsset(url))
    .grayscale()
    .linear(1.05, -0.05 * 128)
    .jpeg({ quality: 88 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

/** A chat cover: the speech bubbles of the guests on the two grounds. */
async function chatCover(portraits: string[], palette: OgPalette): Promise<Buffer> {
  const bubbles = bubbleLayout(portraits.length);
  const images = await Promise.all(bubbles.map((_, index) => portraitDataUri(portraits[index]!)));

  const shapes = bubbles
    .map((bubble, index) => {
      const photo = photoBox(bubble);
      return `<path d="${bubblePath(bubble)}" fill="${palette.paper}"/>
<clipPath id="photo-${index}"><path d="${photoPath(bubble)}"/></clipPath>
<image href="${images[index]}" x="${photo.x}" y="${photo.y}" width="${photo.size}" height="${photo.size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-${index})"/>`;
    })
    .join('');

  const seam = CHAT_COLUMNS / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ogCoverWidth}" height="${ogCoverHeight}" viewBox="0 0 ${CHAT_COLUMNS} ${CHAT_ROWS}" shape-rendering="crispEdges">
<rect width="${seam}" height="${CHAT_ROWS}" fill="${palette.accent}"/>
<rect x="${seam}" width="${seam}" height="${CHAT_ROWS}" fill="${palette.ink}"/>
${shapes}
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const rawData = url.searchParams.get('data');
    if (!rawData) return invalidRequestResponse('Missing data URL param', 404);

    let data: OgCoverData;
    try {
      data = JSON.parse(Buffer.from(rawData, 'base64').toString('utf-8'));
    } catch {
      return invalidRequestResponse('Invalid data URL param', 404);
    }

    const palette = palettes[data.theme as Theme] ?? palettes.green;
    const png =
      data.kind === 'post'
        ? await postCover(data.cover, palette)
        : data.kind === 'chat' && data.portraits?.length
          ? await chatCover(data.portraits, palette)
          : null;
    if (!png) return invalidRequestResponse('Invalid data URL param', 404);

    return new Response(toArrayBuffer(png), {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
