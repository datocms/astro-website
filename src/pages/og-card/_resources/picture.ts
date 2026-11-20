import type { OgPalette } from './palette';
import { dataUri, pngSize, pngToPixels, trimBox, type Pixels } from './raster';

/*
 * The logo half of the card: the logo of a customer or a partner on a
 * white half, on the full height of the card, as the hero of a partner
 * page (`LogoPlate`). A mark is always drawn as it is: the logo keeps its
 * own colours, at the centre. The half touches the accent half with a
 * hard cut.
 */
export interface PictureOptions {
  width: number;
  height: number;
  palette: OgPalette;
  /** A PNG of the logo. */
  logo: Uint8Array;
}

/**
 * The size of a logo. Logos have different shapes, thus a box of a fixed
 * width makes a wide logo small and a square logo large. The logo gets an
 * area, and the sides come from its ratio, in the limits of the box.
 */
const LOGO_AREA = 300 * 120;
const LOGO_MAX = { w: 336, h: 200 };

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

/**
 * The half, as an SVG. The card puts it inline: resvg does not draw a
 * picture inside an image, thus the half must not be an image.
 */
export async function picture({
  width,
  height,
  palette,
  logo: png,
}: PictureOptions): Promise<string> {
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
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${palette.plate}"/>
  <svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${crop.left} ${crop.top} ${crop.width} ${crop.height}" preserveAspectRatio="xMidYMid meet"><image href="${dataUri(png)}" width="${size.width}" height="${size.height}"/></svg>
</svg>`;
}
