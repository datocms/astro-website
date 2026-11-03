// Make the land of the partners globe (`src/pages/partners/_PartnersGlobe/land.json`)
// from the Natural Earth countries (1:110m) in `world-110m.json`.
//
// Usage:
//   npx tsx scripts/partners-globe/land.ts
//
// The land is a grid of samples in rows of latitude, STEP degrees apart.
// Each row has a number of samples that follows the length of the parallel
// (cos of the latitude), thus the samples have approximately the same
// distance on all the sphere. The file keeps each row as runs of samples of
// the same country: [start, length, country]. The sea has no runs.
//
// The map at 1:110m has no small countries (Singapore, Hong Kong, the
// Channel Islands). SMALL_COUNTRIES gives each of them a block of 2 × 2
// samples at its place: a cell of the globe is larger than one sample, thus
// one sample can fall between two cells.
//
// The file also gives each country its centre and its size, from its
// largest polygon (the mainland of France, the 48 states of the USA): the
// centroid, and the radius of a circle of the same area, in degrees. The
// tour turns the globe to the centre, and zooms in more on a small country.
// A small country of SMALL_COUNTRIES has the radius SMALL_RADIUS.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoArea, geoBounds, geoCentroid, geoContains } from 'd3-geo';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import { feature } from 'topojson-client';
import world from './world-110m.json' with { type: 'json' };

// A camera close to a small country (approximately 4.5 × the wide zoom)
// shows one sample as approximately 2 cells: at this step, the coasts of
// the near view are not steps of large blocks.
const STEP = 0.4;
// No land below this latitude: Antarctica has no partners, and the globe
// tilts to the north.
const MIN_LAT = -58;
const MAX_LAT = 84;

// [ISO code, longitude, latitude]
const SMALL_COUNTRIES: [string, number, number][] = [
  ['AD', 1.5, 42.5],
  ['AX', 19.9, 60.2],
  ['BH', 50.6, 26.1],
  // Guernsey and Jersey are near: they move a little to the west and the east.
  ['GG', -3.6, 49.5],
  ['HK', 114.2, 22.3],
  ['IM', -4.5, 54.2],
  ['JE', -1.4, 49.2],
  ['LI', 9.6, 47.2],
  ['MC', 7.4, 43.7],
  ['MT', 14.4, 35.9],
  ['MU', 57.6, -20.3],
  ['SG', 103.8, 1.4],
  ['SM', 12.5, 43.9],
];

const SMALL_RADIUS = 0.5;

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../src/pages/partners/_PartnersGlobe/land.json');

type Country = Feature<Polygon | MultiPolygon, { ISO_A2: string; NAME: string }>;

const topology = world as unknown as Parameters<typeof feature>[0];
const collection = feature(
  topology,
  (world as any).objects.ne_110m_admin_0_countries,
) as unknown as { features: Country[] };

// A country with no ISO code (N. Cyprus, Somaliland) has no partners.
const countries = collection.features.filter((c) => /^[A-Z]{2}$/.test(c.properties.ISO_A2));

const boxes = countries.map((c) => geoBounds(c));

function countryAt(lon: number, lat: number): number {
  for (let i = 0; i < countries.length; i++) {
    const [[w, s], [e, n]] = boxes[i]!;
    if (lat < s || lat > n) continue;
    // A box that crosses the antimeridian has w > e.
    if (w <= e ? lon < w || lon > e : lon < w && lon > e) continue;
    if (geoContains(countries[i]!, [lon, lat])) return i;
  }
  return -1;
}

function largestPolygon(c: Country): Feature<Polygon> {
  const polygons =
    c.geometry.type === 'Polygon' ? [c.geometry.coordinates] : c.geometry.coordinates;
  const features = polygons.map((coordinates): Feature<Polygon> => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates },
  }));
  return features.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
}

// The grid: for each row, its latitude and the country of each sample (-1 for the sea).
const grid: { lat: number; cells: number[] }[] = [];
for (let lat = MIN_LAT + STEP / 2; lat < MAX_LAT; lat += STEP) {
  const n = Math.max(1, Math.round((360 / STEP) * Math.cos((lat * Math.PI) / 180)));
  const cells = Array.from({ length: n }, (_, i) => countryAt(-180 + ((i + 0.5) * 360) / n, lat));
  grid.push({ lat, cells });
}

const small = SMALL_COUNTRIES.filter(
  ([code]) => !countries.some((c) => c.properties.ISO_A2 === code),
);
const smallCentres = small.map(([code, lon, lat], index) => {
  const country = countries.length + index;
  const r = grid.reduce(
    (best, row, i) => (Math.abs(row.lat - lat) < Math.abs(grid[best]!.lat - lat) ? i : best),
    0,
  );
  for (const row of [grid[r]!, grid[Math.min(r + 1, grid.length - 1)]!]) {
    const n = row.cells.length;
    const i = Math.min(n - 1, Math.max(0, Math.floor(((lon + 180) / 360) * n)));
    for (const j of [i, (i + 1) % n]) {
      // A sample of an other small country stays.
      if (row.cells[j]! < countries.length) row.cells[j] = country;
    }
  }
  return { code, lon, lat, radius: SMALL_RADIUS };
});

const rows: number[][] = [];
let total = 0;
for (const { lat, cells } of grid) {
  const row: number[] = [Number(lat.toFixed(2)), cells.length];
  let runStart = -1;
  let runCountry = -1;
  for (let i = 0; i <= cells.length; i++) {
    const country = i < cells.length ? cells[i]! : -1;
    if (country === runCountry) continue;
    if (runCountry >= 0) {
      row.push(runStart, i - runStart, runCountry);
      total += i - runStart;
    }
    runStart = i;
    runCountry = country;
  }
  if (row.length > 2) rows.push(row);
}

const data = {
  step: STEP,
  countries: [
    ...countries.map((c) => {
      const polygon = largestPolygon(c);
      const [lon, lat] = geoCentroid(polygon);
      // A spherical cap of radius r has the area 2π (1 - cos r).
      const radius = Math.acos(1 - geoArea(polygon) / (2 * Math.PI)) * (180 / Math.PI);
      return {
        code: c.properties.ISO_A2,
        lon: round1(lon),
        lat: round1(lat),
        radius: round1(radius),
      };
    }),
    ...smallCentres,
  ],
  rows,
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

writeFileSync(out, `${JSON.stringify(data)}\n`);
console.log(
  `${total} samples of land in ${rows.length} rows, ${countries.length + small.length} countries: ${out}`,
);
