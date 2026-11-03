// The partners globe as cells of a pixel video. For a camera (the point at
// the centre of the frame and the radius of the globe), rasterize() gives
// the layer of each cell of the frame: the sea, the land, the land of a
// country with partners, the country of the tour, or empty (the space round the globe). The server
// uses it for the still globe (an SVG), and <partners-globe> for each frame
// of the canvas.
//
// `land.json` comes from `scripts/partners-globe/land.ts`. Make it again
// with that script, not by hand.

import { BG, EMPTY, HIGH, MID, TOP } from '~/lib/pixel-video/format';
import data from './land.json';

export type Camera = {
  /** The longitude at the centre of the frame, in degrees. */
  lon: number;
  /** The latitude at the centre of the frame, in degrees. */
  lat: number;
  /** The radius of the globe, as a part of the height of the frame. */
  zoom: number;
};

/**
 * The wide view: the Americas at the left, Europe and Africa at the right.
 * The globe is higher than the frame: the frame cuts its top and bottom.
 */
export const WIDE: Camera = { lon: -25, lat: 30, zoom: 0.78 };

/**
 * The zoom on a country of the tour, from its size: CLOSE_ZOOM for a
 * country of REFERENCE_RADIUS (as large as the USA), more for a smaller
 * country, up to MAX_ZOOM. The zoom grows with the square root of the
 * ratio of the radii, not with the ratio: thus a small country fills less
 * of the frame than a large one, and Europe is not a set of jumps from
 * very close to very far.
 */
const CLOSE_ZOOM = 1.7;
const REFERENCE_RADIUS = 15;
// At this zoom, one sample of land.json is approximately 2.5 cells.
const MAX_ZOOM = 5;

export function closeZoom(country: number) {
  const zoom = CLOSE_ZOOM * Math.sqrt(REFERENCE_RADIUS / countries[country]!.radius);
  return Math.min(MAX_ZOOM, Math.max(CLOSE_ZOOM, zoom));
}

/**
 * The side of a cell, in CSS px. The squares of the pixel videos in the
 * page closer have approximately the same size.
 */
export const CELL_PX = 6;

/** The centre of each country, and its radius in degrees (see land.ts). */
export const countries: { code: string; lon: number; lat: number; radius: number }[] =
  data.countries;

const RAD = Math.PI / 180;
const STEP = data.step;
const FIRST_LAT = data.rows[0]![0]!;

// For each row of latitude of the land: the country of each sample (-1 for
// the sea). A row with no land is null.
const land: (Int16Array | null)[] = [];
for (const row of data.rows) {
  const samples = new Int16Array(row[1]!).fill(-1);
  for (let i = 2; i < row.length; i += 3) {
    samples.fill(row[i + 2]!, row[i]!, row[i]! + row[i + 1]!);
  }
  land[Math.round((row[0]! - FIRST_LAT) / STEP)] = samples;
}

function countryAt(lat: number, lon: number): number {
  const samples = land[Math.round((lat - FIRST_LAT) / STEP)];
  if (!samples) return -1;
  const n = samples.length;
  return samples[Math.min(n - 1, Math.floor(((lon + 180) / 360) * n))]!;
}

export type Frame = {
  cols: number;
  rows: number;
  /** The layer of each cell (BG, MID, HIGH or EMPTY of the pixel videos). */
  cells: Uint8Array;
};

export function createFrame(cols: number, rows: number): Frame {
  return { cols, rows, cells: new Uint8Array(cols * rows) };
}

/**
 * Fill the frame for a camera. The sea is BG, the land is MID, the land of
 * a country with partners is HIGH, and the `focus` country (-1 for none)
 * is TOP.
 */
export function rasterize(
  camera: Camera,
  isPartner: (country: number) => boolean,
  focus: number,
  out: Frame,
) {
  const { cols, rows, cells } = out;
  const radius = camera.zoom * rows;
  const cosLon = Math.cos(camera.lon * RAD);
  const sinLon = Math.sin(camera.lon * RAD);
  const cosLat = Math.cos(camera.lat * RAD);
  const sinLat = Math.sin(camera.lat * RAD);

  for (let j = 0; j < rows; j++) {
    // Up is positive.
    const sy = (rows / 2 - (j + 0.5)) / radius;
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      const sx = (i + 0.5 - cols / 2) / radius;
      const r2 = sx * sx + sy * sy;
      if (r2 > 1) {
        cells[k] = EMPTY;
        continue;
      }
      // The point on the sphere: the turn of the camera backwards.
      const depth = Math.sqrt(1 - r2);
      const x1 = depth * cosLat - sy * sinLat;
      const z = depth * sinLat + sy * cosLat;
      const x = x1 * cosLon - sx * sinLon;
      const y = x1 * sinLon + sx * cosLon;
      const country = countryAt(Math.asin(z) / RAD, Math.atan2(y, x) / RAD);
      cells[k] = country < 0 ? BG : country === focus ? TOP : isPartner(country) ? HIGH : MID;
    }
  }
}

/** The angle between two points of the sphere, in degrees. */
export function distance(a: { lon: number; lat: number }, b: { lon: number; lat: number }) {
  const cos =
    Math.sin(a.lat * RAD) * Math.sin(b.lat * RAD) +
    Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.cos((b.lon - a.lon) * RAD);
  return Math.acos(Math.min(1, Math.max(-1, cos))) / RAD;
}
