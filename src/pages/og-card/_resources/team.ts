import type { OgPalette } from './palette';
import { dataUri, svgToPng } from './raster';

/**
 * The diameter of a photo in the row of the team, in px, for a number of
 * people: the row of three fills the width of the safe box of the half.
 */
const PHOTO = [240, 208, 176];
/** The part of a photo that the next photo covers. */
const OVERLAP = 0.22;
/** The ring of the ground around a photo: it separates two photos that overlap. */
const RING = 8;

/** The size of the row of photos for a number of people, in px. */
export function teamRowSize(count: number): {
  width: number;
  height: number;
  photo: number;
  step: number;
} {
  const photos = Math.min(3, Math.max(1, count));
  const photo = PHOTO[photos - 1]!;
  const step = Math.round(photo * (1 - OVERLAP));
  return { width: RING * 2 + photo + step * (photos - 1), height: RING * 2 + photo, photo, step };
}

/**
 * The row of the photos of the people of a team, as a PNG, on the inverse.
 * The photos overlap, as the row of `ContactPeople` on the page, with a ring
 * of the ground between two photos. A photo takes the hue of the ground and
 * keeps its light and dark (luminosity blend), as `Avatar` with `tint`. The
 * row shows the first three people.
 */
export async function teamRow(files: Uint8Array[], palette: OgPalette): Promise<Uint8Array> {
  const photos = files.slice(0, 3);
  const { width, height, photo, step } = teamRowSize(photos.length);
  const r = photo / 2;
  const shapes = photos
    .map((file, index) => {
      const cx = RING + r + index * step;
      const cy = RING + r;
      return `<circle cx="${cx}" cy="${cy}" r="${r + RING}" fill="${palette.inverse}"/>
<clipPath id="photo-${index}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
<g style="mix-blend-mode:luminosity"><image href="${dataUri(file)}" x="${cx - r}" y="${cy - r}" width="${photo}" height="${photo}" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-${index})"/></g>`;
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="${palette.inverse}"/>
${shapes}
</svg>`;
  return svgToPng(svg);
}
