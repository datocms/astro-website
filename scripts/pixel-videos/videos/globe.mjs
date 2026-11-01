// A spinning globe. Space is the background, the ocean is the midtone and
// the land is the highlight. The globe turns eastward, like the Earth.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { BG, HIGH, MID } from '../tones.mjs';

const SIZE = 480;
// Tilt the globe to show more of the northern hemisphere.
const TILT = -18;

// Use the coarse map. The pixel grid does not show more detail.
const topo = JSON.parse(
  readFileSync(createRequire(import.meta.url).resolve('world-atlas/land-110m.json')),
);
const land = feature(topo, topo.objects.land);

const projection = geoOrthographic().fitExtent(
  [
    [SIZE * 0.06, SIZE * 0.06],
    [SIZE * 0.94, SIZE * 0.94],
  ],
  { type: 'Sphere' },
);

export default {
  width: SIZE,
  height: SIZE,
  fps: 30,
  seconds: 10,
  draw(ctx, progress) {
    const path = geoPath(projection, ctx);
    projection.rotate([progress * 360, TILT]);

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = MID;
    ctx.fill();

    ctx.beginPath();
    path(land);
    ctx.fillStyle = HIGH;
    ctx.fill();
  },
};
