import symbolSvg from '~/assets/logo/symbol.svg?raw';
import type { OgPalette } from './palette';
import { containToPixels, dataUri, pngSize, pngToPixels, trimBox } from './raster';

/**
 * The picture of the OG card: a figure drawn as flat square cells on the
 * accent, in the pixel language of the site. The picture is the right half
 * of a split: a band of the accent on the full height of the card.
 *
 * The figure is the DatoCMS symbol, or the logo of a partner.
 * - The symbol is a pixel video: big cells, each one a square with a thin
 *   stroke in the line colour, and the grid goes on across the ground.
 * - A logo is a pixel image: small cells with no grid, as the pixel version
 *   of a photo on the site, thus the logo stays legible. It has three
 *   tones: a dark pixel is the ink, a mid pixel is the muted ink of the
 *   accent and a light pixel is the paper.
 * A see-through pixel is the accent ground.
 */
export interface PixelPictureOptions {
  width: number;
  height: number;
  palette: OgPalette;
  /** A PNG of a logo. Without it, the picture shows the DatoCMS symbol. */
  logo?: Uint8Array | null;
}

type Tone = 'ground' | 'ink' | 'mid' | 'paper';

const SYMBOL_CELL = 16;
const LOGO_CELL = 8;
/** The pixels of the source for each cell, on each side. */
const SUPERSAMPLE = 8;

/**
 * The cells of the figure. The source is drawn at `SUPERSAMPLE` pixels for
 * each cell, and a cell is in the figure when the source covers half of it
 * or more. The tone of a cell comes from the mean brightness of the pixels
 * of the source in it.
 */
async function rasterize(
  source: Uint8Array | string,
  cols: number,
  rows: number,
  tones: 'one' | 'three',
): Promise<Tone[][]> {
  const width = cols * SUPERSAMPLE;
  const height = rows * SUPERSAMPLE;
  let info;
  if (typeof source === 'string') {
    // The symbol is an SVG: it has no pixels of its own, thus its size here
    // is only the ratio of its sides.
    const uri = dataUri(new TextEncoder().encode(source), true);
    info = await containToPixels({ uri, width, height }, width, height);
  } else {
    // A logo can have a border of empty pixels, or a white ground: cut both.
    const size = pngSize(source);
    const box = tones === 'three' ? trimBox(await pngToPixels(source), 20) : undefined;
    info = await containToPixels({ uri: dataUri(source), ...size }, width, height, box);
  }
  const { data } = info;

  const gridCols = Math.floor(info.width / SUPERSAMPLE);
  const gridRows = Math.floor(info.height / SUPERSAMPLE);
  const grid: Tone[][] = [];
  for (let cy = 0; cy < gridRows; cy++) {
    const row: Tone[] = [];
    for (let cx = 0; cx < gridCols; cx++) {
      let coverage = 0;
      let luma = 0;
      for (let y = 0; y < SUPERSAMPLE; y++) {
        for (let x = 0; x < SUPERSAMPLE; x++) {
          const i = ((cy * SUPERSAMPLE + y) * info.width + cx * SUPERSAMPLE + x) * 4;
          const alpha = data[i + 3]! / 255;
          coverage += alpha;
          luma += alpha * (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!);
        }
      }
      if (coverage < SUPERSAMPLE * SUPERSAMPLE * 0.5) {
        row.push('ground');
      } else if (tones === 'one') {
        row.push('ink');
      } else {
        const mean = luma / coverage;
        row.push(mean < 96 ? 'ink' : mean < 190 ? 'mid' : 'paper');
      }
    }
    grid.push(row);
  }
  return grid;
}

/** The picture, as an SVG. */
export async function pixelPicture({
  width,
  height,
  palette,
  logo,
}: PixelPictureOptions): Promise<string> {
  const cell = logo ? LOGO_CELL : SYMBOL_CELL;
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);

  // The figure is a square at the centre of the band, in a box with a
  // margin of 40px around it. A logo is wider than tall: it takes the width
  // of the box.
  const margin = Math.round(40 / cell);
  const side = Math.min(cols, rows) - margin * 2;
  const figure = logo
    ? await rasterize(logo, side, side, 'three')
    : await rasterize(symbolSvg, side, side, 'one');
  const top = Math.floor((rows - figure.length) / 2);
  const left = Math.floor((cols - (figure[0]?.length ?? 0)) / 2);

  const fills: Record<Tone, string> = {
    ground: palette.accent,
    ink: palette.ink,
    mid: palette.inkOnAccentMuted,
    paper: palette.paper,
  };

  const rects: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tone = figure[y - top]?.[x - left] ?? 'ground';
      if (tone === 'ground') continue;
      rects.push(
        `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fills[tone]}"/>`,
      );
    }
  }

  // The grid of the pixel video: one thin line on each edge between two
  // cells. A pixel image has no grid.
  const lines: string[] = [];
  if (!logo) {
    for (let x = 1; x < cols; x++) {
      lines.push(`M${x * cell + 0.5} 0V${height}`);
    }
    for (let y = 1; y < rows; y++) {
      lines.push(`M0 ${y * cell + 0.5}H${width}`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges">
  <rect width="${width}" height="${height}" fill="${palette.accent}"/>
  <path d="${lines.join('')}" stroke="${palette.frameLine}" stroke-width="1"/>
  ${rects.join('')}
</svg>`;
}
