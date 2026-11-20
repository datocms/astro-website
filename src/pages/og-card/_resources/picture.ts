import wordmarkSvg from '~/assets/logo/wordmark.svg?raw';
import type { OgPalette } from './palette';
import { dataUri, pngSize, pngToPixels, trimBox, type Pixels } from './raster';

/*
 * The picture of the OG card: the right half of the split, on the full
 * height of the card. A mark is always drawn as it is: the DatoCMS wordmark
 * as a vector, the logo of a partner as its own file. Never as cells.
 *
 * - With the logo of a partner, the half is a white plate, as the hero of a
 *   partner page (`LogoPlate`). The logo keeps its own colours, at the
 *   centre. A hairline separates the plate from the paper.
 * - Without a logo, the half is a band of the accent, with the DatoCMS
 *   wordmark in the text colour of the accent. The top row of the card
 *   then has no wordmark: the name is in the band.
 */
export interface PictureOptions {
  width: number;
  height: number;
  palette: OgPalette;
  /** A PNG of the logo of a partner. Without it, the picture shows the wordmark. */
  logo?: Uint8Array | null;
}

/**
 * The size of a logo. Logos have different shapes, thus a box of a fixed
 * width makes a wide logo small and a square logo large. The logo gets an
 * area, and the sides come from its ratio, in the limits of the box.
 */
const LOGO_AREA = 300 * 120;
const LOGO_MAX = { w: 336, h: 200 };

/** The space between the wordmark and the left and right edges of the band. */
const WORDMARK_INSET = 56;

/**
 * The border of a logo file that the picture removes: see-through pixels,
 * or a white ground. The test is on the top left pixel. A logo on a ground
 * of a different colour (a dark tile) keeps the ground: it is part of the
 * logo.
 */
function cropOf(pixels: Pixels) {
  const [r, g, b, a] = pixels.data;
  const clear = a! < 16;
  const white = a! > 240 && r! > 240 && g! > 240 && b! > 240;
  return clear || white ? trimBox(pixels, 20) : undefined;
}

/** The logo at the centre of the half, at the size that its shape gives. */
async function logo(png: Uint8Array, width: number, height: number): Promise<string> {
  const size = pngSize(png);
  const crop = cropOf(await pngToPixels(png)) ?? { left: 0, top: 0, ...size };
  const ratio = crop.width / crop.height;
  let w = Math.sqrt(LOGO_AREA * ratio);
  let h = w / ratio;
  const scale = Math.min(1, LOGO_MAX.w / w, LOGO_MAX.h / h);
  w = Math.round(w * scale);
  h = Math.round(h * scale);
  const x = Math.round((width - w) / 2);
  const y = Math.round((height - h) / 2);
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${crop.left} ${crop.top} ${crop.width} ${crop.height}" preserveAspectRatio="xMidYMid meet"><image href="${dataUri(png)}" width="${size.width}" height="${size.height}"/></svg>`;
}

/** The wordmark at the centre of the band, in one colour, as wide as the insets permit. */
function wordmark(color: string, width: number, height: number): string {
  const w = width - WORDMARK_INSET * 2;
  // The ratio of the view box of the wordmark.
  const [, , vw, vh] = wordmarkSvg
    .match(/viewBox="([^"]+)"/)![1]!
    .split(/\s+/)
    .map(Number);
  const h = Math.round((w * vh!) / vw!);
  return wordmarkSvg
    .replace(/currentColor/g, color)
    .replace(
      '<svg ',
      `<svg x="${WORDMARK_INSET}" y="${Math.round((height - h) / 2)}" width="${w}" height="${h}" `,
    );
}

/**
 * The picture, as an SVG. The card puts it inline: resvg does not draw a
 * picture inside an image, thus the picture must not be an image.
 */
export async function picture({
  width,
  height,
  palette,
  logo: png,
}: PictureOptions): Promise<string> {
  const body = png
    ? `<rect width="${width}" height="${height}" fill="${palette.plate}"/>
  <rect width="1" height="${height}" fill="${palette.border}"/>
  ${await logo(png, width, height)}`
    : `<rect width="${width}" height="${height}" fill="${palette.accent}"/>
  ${wordmark(palette.onAccent, width, height)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${body}
</svg>`;
}
