import { bubblePath, photoBox, photoPath, type Bubble } from '~/components/ChatCover/layout';
import {
  COLS,
  isGrounded,
  palettes,
  paletteOf,
  pixelsToGrid,
  ROWS,
  SEAM,
  type Rgb,
} from '~/lib/pixel-cover/cover';
import type { OgPalette } from './palette';
import { dataUri, pngToPixels, rgbToPng, svgToPng } from './raster';

/*
 * The proof of the card of an article of the blog, as a PNG: the pixel
 * cover of a post, or the portraits of the guests of a casual chat, with
 * the shapes of the covers of the site: the cells of `src/lib/pixel-cover`
 * and the speech bubbles of `ChatCover`.
 */

const hexToRgb = (hex: string): Rgb => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

/** The part of the width of the subject that the right edge of the card cuts. */
const CROP = 0.15;

/** The space above the subject, and below a subject that is not on the ground. */
const PIXEL_INSET = 32;

/**
 * The subject of a pixel cover, across the seam of the two grounds, as on
 * the page of the post. The cells at the left of the seam of the cover
 * (column 50) are on the accent, with the tones of the left half. The cells
 * at the right are on the ink, with the tones of the right half.
 *
 * The result is a strip at the right of the card, from the left edge of the
 * subject (`left`) to the right edge of the card. The strip paints the
 * accent up to the seam, thus it continues the ground of the title. The
 * subject is as large as the half of the card permits, and the right edge
 * of the card cuts a part of it (`CROP`): then it is larger. The cells
 * touch. A narrower
 * subject gives more width to the title. A subject on the ground stands on
 * the bottom edge of the card.
 */
export async function pixelProof(
  file: Uint8Array,
  palette: OgPalette,
  card: { width: number; height: number },
): Promise<{ left: number; png: Uint8Array }> {
  const source = await pngToPixels(file);
  const { grid, error } = pixelsToGrid(source.data, source.width, source.height);
  if (!grid) throw new Error(`The OG card cannot read the pixel cover: ${error}`);

  // The box of the subject, in cells.
  let x0 = COLS;
  let x1 = -1;
  let y0 = ROWS;
  let y1 = -1;
  for (let i = 0; i < COLS * ROWS; i++) {
    if (grid[i]! < 0) continue;
    x0 = Math.min(x0, i % COLS);
    x1 = Math.max(x1, i % COLS);
    y0 = Math.min(y0, Math.floor(i / COLS));
    y1 = Math.max(y1, Math.floor(i / COLS));
  }
  if (x1 < 0) throw new Error('The pixel cover has no subject.');
  const cols = x1 - x0 + 1;
  const rows = y1 - y0 + 1;

  const grounded = isGrounded(grid);
  const boxWidth = card.width / 2;
  const boxHeight = card.height - PIXEL_INSET * (grounded ? 1 : 2);
  const pitch = Math.max(1, Math.floor(Math.min(boxWidth / (cols * (1 - CROP)), boxHeight / rows)));

  // The right edge of the card cuts the subject: the card shows the subject
  // less `CROP`.
  const width = Math.round(pitch * cols * (1 - CROP));
  const left = card.width - width;
  const seamInSubject = (SEAM - x0) * pitch;
  const { height } = card;
  const top = grounded
    ? height - pitch * rows
    : PIXEL_INSET + Math.round((boxHeight - pitch * rows) / 2);
  // The seam, in the strip. A subject on one side of the seam only has the
  // seam at an edge of the strip.
  const seam = Math.min(width, Math.max(0, seamInSubject));

  const pal = palettes({
    accent: hexToRgb(palette.accent),
    ink: hexToRgb(palette.inverse),
    paper: hexToRgb(palette.paper),
    highlight: hexToRgb(palette.highlight),
  });
  const pixels = new Uint8Array(width * height * 3);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      pixels.set(col < seam ? pal.accent.ground : pal.inverse.ground, (row * width + col) * 3);
    }
  }
  // The cells touch: a card in a feed is a third of its size, and a gap
  // between the cells then makes a moiré.
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const tone = grid[y * COLS + x]!;
      if (tone < 0) continue;
      const colour = paletteOf(pal, x).tones[tone]!;
      const px = (x - x0) * pitch;
      const py = top + (y - y0) * pitch;
      for (let row = py; row < Math.min(height, py + pitch); row++) {
        for (let col = px; col < Math.min(width, px + pitch); col++) {
          pixels.set(colour, (row * width + col) * 3);
        }
      }
    }
  }
  return { left, png: await rgbToPng(pixels, width, height) };
}

/**
 * The bubbles in the half, for a number of guests, and the side of a cell
 * in px. A smaller bubble has smaller cells: then the stepped corners and
 * the tail have the same part of each bubble. One guest has a large bubble
 * (cells of 12 px, the half is 50 × 52 cells). Two guests have two bubbles
 * on a diagonal, with the tails pointing outward (cells of 10 px, 60 × 63).
 * Three guests have three bubbles in a zigzag (cells of 8 px, 75 × 78).
 */
function halfBubbles(count: number): { cell: number; bubbles: Bubble[] } {
  if (count <= 1) return { cell: 12, bubbles: [{ x: 7, y: 7, size: 36, tail: 'left' }] };
  if (count === 2) {
    return {
      cell: 10,
      bubbles: [
        { x: 4, y: 5, size: 26, tail: 'left' },
        { x: 31, y: 25, size: 26, tail: 'right' },
      ],
    };
  }
  return {
    cell: 8,
    bubbles: [
      { x: 6, y: 6, size: 28, tail: 'left' },
      { x: 39, y: 22, size: 28, tail: 'right' },
      { x: 8, y: 42, size: 28, tail: 'left' },
    ],
  };
}

/**
 * The portraits of the guests of a chat in speech bubbles, on the inverse.
 * A portrait is in black and white, as the CSS of `ChatCover` gives it:
 * `grayscale(1) contrast(1.05)`. The filter of the SVG does the same. A chat
 * with more than three guests shows the first three.
 */
export async function portraitsHalf(
  files: Uint8Array[],
  palette: OgPalette,
  size: { width: number; height: number },
): Promise<Uint8Array> {
  const { cell, bubbles: all } = halfBubbles(files.length);
  const bubbles = all.slice(0, files.length);
  const shapes = bubbles
    .map((bubble, index) => {
      const photo = photoBox(bubble);
      return `<path d="${bubblePath(bubble)}" fill="${palette.paper}"/>
<clipPath id="photo-${index}"><path d="${photoPath(bubble)}"/></clipPath>
<image href="${dataUri(files[index]!)}" x="${photo.x}" y="${photo.y}" width="${photo.size}" height="${photo.size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-${index})" filter="url(#portrait)"/>`;
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width / cell} ${size.height / cell}" shape-rendering="crispEdges">
<filter id="portrait" color-interpolation-filters="sRGB">
<feColorMatrix type="saturate" values="0"/>
<feComponentTransfer>
<feFuncR type="linear" slope="1.05" intercept="-0.025"/>
<feFuncG type="linear" slope="1.05" intercept="-0.025"/>
<feFuncB type="linear" slope="1.05" intercept="-0.025"/>
</feComponentTransfer>
</filter>
<rect width="100%" height="100%" fill="${palette.inverse}"/>
${shapes}
</svg>`;
  return svgToPng(svg);
}
