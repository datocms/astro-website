// The <partners-globe> element: the globe of Component.astro as a live
// pixel video that tours the countries of the partners.
//
// - For each frame, rasterize() of globe.ts gives the cells for the
//   current camera, and the renderer of the pixel videos draws them
//   (WebGL2): one square for each cell and the grid, in the
//   `partnersGlobe` palette (src/lib/pixel-video/styles.ts). The globe has
//   no lens: it is a thing to watch, not to touch.
// - The tour: the wide view, then a flight to each country of the stops
//   (the countries with the most partners). A flight follows the great
//   circle to the country, on the smooth zoom and pan path of van Wijk and
//   Nuij (the path of d3.interpolateZoom): a long flight pulls back first,
//   thus the speed on the screen stays approximately the same. At the
//   country, the camera holds and pushes in slowly: the
//   country is light (the TOP layer, in the pixel highlight), and the
//   readout shows its name and number of partners. The other countries
//   with partners stay deep. After the last stop, the camera goes back to the
//   wide view, and the tour starts again.
// - During a flight, the country of the next stop is light already.
// - Each leg starts and stops at zero speed, thus the camera never jumps
//   from one leg to the next.
// - The clock of the tour runs only when the globe is in view.
// - With reduced motion, or without WebGL2, the globe stays in the wide
//   view (the still SVG of the server without WebGL2).

import { onVisibilityChange, prefersReducedMotion } from '~/lib/motion/inView';
import { resolveColor } from '~/lib/pixel-video/color';
import { createRenderer, type DrawSettings, type Renderer } from '~/lib/pixel-video/renderer';
import { findPalette } from '~/lib/pixel-video/styles';
import { WebComponent } from '~/lib/WebComponent';
import {
  type Camera,
  CELL_PX,
  closeZoom,
  countries,
  createFrame,
  type Frame,
  rasterize,
  WIDE,
} from './globe';

const PALETTE = 'partnersGlobe';
// The number of countries in the tour.
const STOPS = 8;
// The flight path: a large RHO pulls back more on a long flight. With
// 1.2, the longest flights of the tour show the full globe at the middle.
const RHO = 1.2;
// The time of a flight: a base time and a time for each unit of the length
// of the path, between a minimum and a maximum. The base time is long, thus
// a flight to a near country is a slow glide, not a jump.
const FLIGHT_MS = 1600;
const FLIGHT_MS_PER_UNIT = 500;
const FLIGHT_MIN_MS = 2000;
const FLIGHT_MAX_MS = 3400;
// The ease of the legs is smootherstep: at the two ends, the speed and the
// acceleration are zero, thus the camera leaves a hold and arrives at a
// country with no jolt. It is not the strong ease-in-out of DESIGN.md: a
// strong curve makes the middle of the flight too fast, and then the cells
// of the pixel video flicker.
const ease = (t: number) => t * t * t * (t * (6 * t - 15) + 10);
// The hold at a country, and at the wide view.
const HOLD_MS = 3000;
const WIDE_HOLD_MS = 2000;
// During a hold, the camera pushes in by this part of the zoom. It does not
// pan: a pan in a hold can go against the next flight.
const HOLD_PUSH = 0.05;
// The readout shows a little after the camera stops, and goes a little
// before it leaves.
const READOUT_DELAY_MS = 150;
// The readout goes up from the centre by this part of the radius of the
// country on the screen, thus it does not cover a small country. It stays
// in the top quarter of the stage at most.
const READOUT_LIFT = 0.7;
const READOUT_MAX_LIFT = 0.25;
// The latitudes of the camera stay between these limits: the frame cuts
// the poles.
const MIN_LAT = -35;
const MAX_LAT = 60;

type Leg =
  | { kind: 'flight'; path: (s: number) => Camera; duration: number; stop: number }
  | { kind: 'hold'; from: Camera; duration: number; stop: number };

export class PartnersGlobeElement extends WebComponent {
  #stage!: HTMLElement;
  #canvas!: HTMLCanvasElement;
  #readout!: HTMLElement;
  #readoutLabel!: HTMLElement;
  #readoutCount!: HTMLElement;
  #renderer: Renderer | null = null;
  #settings!: DrawSettings;

  // Two frames: the renderer uploads the cells when the array changes.
  #frames: [Frame, Frame] = [createFrame(1, 1), createFrame(1, 1)];
  #front = 0;
  #partner: boolean[] = countries.map(() => false);
  // The stops: an index in `countries`, the label and the count of each one.
  #stops: { country: number; label: string; count: string }[] = [];

  #camera: Camera = { ...WIDE };
  #focus = -1;
  // The leg of the tour, and the time in it (ms). -1 is the wide view.
  #leg: Leg = { kind: 'hold', from: { ...WIDE }, duration: WIDE_HOLD_MS, stop: -1 };
  #legTime = 0;

  #visible = false;
  #raf = 0;
  #lastTime = 0;

  parsedCallback() {
    this.#stage = this.$('[data-stage]');
    this.#canvas = this.$<HTMLCanvasElement>('canvas');
    this.#readout = this.$('[data-readout]');
    this.#readoutLabel = this.$('[data-readout-label]');
    this.#readoutCount = this.$('[data-readout-count]');

    const indexOfCode = new Map(countries.map((c, i) => [c.code, i]));
    for (const item of this.$$('[data-code]')) {
      const country = indexOfCode.get(item.dataset.code!);
      if (country === undefined) continue;
      this.#partner[country] = true;
      if (this.#stops.length < STOPS) {
        this.#stops.push({
          country,
          label: item.dataset.label ?? '',
          count: item.dataset.count ?? '',
        });
      }
    }

    this.#readColors();
    try {
      this.#renderer = createRenderer(this.#canvas, () => this.#settings, this.#draw);
    } catch (error) {
      console.warn(`[partners-globe] ${error instanceof Error ? error.message : error}`);
      return;
    }

    const refresh = () => {
      this.#readColors();
      this.#draw();
    };
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refresh);
    this.on(document.documentElement, 'colorschemechange', refresh);

    new ResizeObserver(() => this.#resize()).observe(this.#stage);
    this.#resize();

    if (!prefersReducedMotion() && this.#stops.length > 0) {
      onVisibilityChange(this, (visible) => {
        this.#visible = visible;
        if (visible) this.#start();
      });
    }

    this.dataset.ready = '';
  }

  // The colours of the palette come from the tokens of the band.
  #readColors() {
    const style = getComputedStyle(this);
    const resolve = (value: string) => resolveColor(value, style);
    const palette = findPalette(PALETTE)!;
    const c = palette.colors;
    this.#settings = {
      colors: {
        fill: [resolve(c.bgFill), resolve(c.midFill), resolve(c.highFill)],
        stroke: [resolve(c.bgStroke), resolve(c.midStroke), resolve(c.highStroke)],
        ground: c.groundFill ? resolve(c.groundFill) : null,
        top:
          c.topFill && c.topStroke
            ? { fill: resolve(c.topFill), stroke: resolve(c.topStroke) }
            : undefined,
      },
      noStroke: [palette.flatBackground ?? false, false, false],
      extend: palette.extend ?? true,
      hover: false,
    };
  }

  // One cell is CELL_PX on the screen: the frame has as many cells as the
  // stage has room for.
  #resize() {
    const cols = Math.max(1, Math.round(this.#stage.clientWidth / CELL_PX));
    const rows = Math.max(1, Math.round(this.#stage.clientHeight / CELL_PX));
    const frame = this.#frames[this.#front]!;
    if (frame.cols === cols && frame.rows === rows) return;
    this.#frames = [createFrame(cols, rows), createFrame(cols, rows)];
    this.#draw();
  }

  // The loop.

  #start() {
    if (this.#raf || !this.#visible) return;
    this.#lastTime = performance.now();
    this.#raf = requestAnimationFrame(this.#tick);
  }

  #tick = (now: number) => {
    this.#raf = 0;
    // A long frame (a tab in the background) does not make a jump.
    const dt = Math.min(now - this.#lastTime, 50);
    this.#lastTime = now;
    this.#step(dt);
    this.#draw();
    if (this.#visible) this.#raf = requestAnimationFrame(this.#tick);
  };

  /** Move the tour by `dt` ms. */
  #step(dt: number) {
    this.#legTime += dt;
    let leg = this.#leg;

    if (this.#legTime >= leg.duration) {
      this.#legTime -= leg.duration;
      leg = this.#leg = this.#nextLeg(leg);
    }

    const e = ease(Math.min(this.#legTime / leg.duration, 1));
    if (leg.kind === 'flight') {
      // The country of the next stop is light for all the flight: the eye
      // has a target.
      this.#camera = leg.path(e);
      this.#focus = this.#stops[leg.stop]?.country ?? -1;
      this.#showReadout(null);
    } else {
      const { from } = leg;
      this.#camera = {
        lon: from.lon,
        lat: from.lat,
        zoom: from.zoom * (1 + HOLD_PUSH * e),
      };
      const stop = this.#stops[leg.stop];
      const show =
        stop && this.#legTime > READOUT_DELAY_MS && this.#legTime < leg.duration - READOUT_DELAY_MS;
      this.#focus = stop ? stop.country : -1;
      this.#showReadout(show ? stop : null);
    }
  }

  /** The leg after `leg`: a hold after a flight, a flight after a hold. */
  #nextLeg(leg: Leg): Leg {
    if (leg.kind === 'flight') {
      return {
        kind: 'hold',
        from: { ...this.#camera },
        duration: leg.stop < 0 ? WIDE_HOLD_MS : HOLD_MS,
        stop: leg.stop,
      };
    }
    // After the last stop, the wide view.
    const stop = leg.stop + 1 < this.#stops.length ? leg.stop + 1 : -1;
    const from = { ...this.#camera };
    let to: Camera;
    if (stop < 0) {
      to = { ...WIDE };
    } else {
      const index = this.#stops[stop]!.country;
      const country = countries[index]!;
      to = {
        lon: country.lon,
        lat: Math.min(MAX_LAT, Math.max(MIN_LAT, country.lat)),
        zoom: closeZoom(index),
      };
    }
    const { path, length } = zoomPath(from, to);
    const duration = FLIGHT_MS + length * FLIGHT_MS_PER_UNIT;
    return {
      kind: 'flight',
      path,
      stop,
      duration: Math.min(FLIGHT_MAX_MS, Math.max(FLIGHT_MIN_MS, duration)),
    };
  }

  #showReadout(stop: { country: number; label: string; count: string } | null) {
    if (!stop) {
      delete this.#readout.dataset.visible;
      return;
    }
    if (this.#readoutLabel.textContent !== stop.label) {
      this.#readoutLabel.textContent = stop.label;
      this.#readoutCount.textContent = stop.count;
      const height = this.#stage.clientHeight;
      const radius = countries[stop.country]!.radius * RAD * this.#camera.zoom * height;
      const lift = Math.min(radius * READOUT_LIFT, height * READOUT_MAX_LIFT);
      this.#readout.style.setProperty('--readout-lift', `${Math.round(lift)}px`);
    }
    this.#readout.dataset.visible = '';
  }

  #draw = () => {
    const renderer = this.#renderer;
    if (!renderer) return;
    this.#front = 1 - this.#front;
    const frame = this.#frames[this.#front]!;
    rasterize(this.#camera, (country) => this.#partner[country]!, this.#focus, frame);
    renderer.setFrame(frame.cells, frame.cols, frame.rows);
    renderer.render(0);
  };
}

const RAD = Math.PI / 180;

type Vector = [number, number, number];

function toVector({ lon, lat }: { lon: number; lat: number }): Vector {
  const cosLat = Math.cos(lat * RAD);
  return [cosLat * Math.cos(lon * RAD), cosLat * Math.sin(lon * RAD), Math.sin(lat * RAD)];
}

/**
 * The smooth zoom and pan path of van Wijk and Nuij ("Smooth and efficient
 * zooming and panning", 2003), on the sphere. The unit of length is the
 * radius of the globe: the width of the view is 1 / zoom, and the pan is
 * the angle of the great circle (radians). `path(s)` gives the camera for
 * s from 0 to 1. `length` is the length of the path in the units of the
 * paper: a longer path takes more time.
 */
function zoomPath(from: Camera, to: Camera): { path: (s: number) => Camera; length: number } {
  const a = toVector(from);
  const b = toVector(to);
  const cos = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const d = Math.acos(cos);
  const w0 = 1 / from.zoom;
  const w1 = 1 / to.zoom;
  const rho2 = RHO * RHO;

  // No pan: only a zoom.
  if (d < 1e-6) {
    const length = Math.abs(Math.log(w1 / w0)) / RHO;
    return {
      length,
      path: (s) => ({ lon: to.lon, lat: to.lat, zoom: 1 / (w0 * (w1 / w0) ** s) }),
    };
  }

  const b0 = (w1 * w1 - w0 * w0 + rho2 * rho2 * d * d) / (2 * w0 * rho2 * d);
  const b1 = (w1 * w1 - w0 * w0 - rho2 * rho2 * d * d) / (2 * w1 * rho2 * d);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const length = (r1 - r0) / RHO;
  const sin = Math.sin(d);

  return {
    length,
    path: (s) => {
      const r = RHO * s * length + r0;
      // The part of the way (0 to 1), and the width of the view.
      const u = (w0 / (rho2 * d)) * (Math.cosh(r0) * Math.tanh(r) - Math.sinh(r0));
      const w = (w0 * Math.cosh(r0)) / Math.cosh(r);
      // The point at the part u of the great circle (slerp).
      const f = Math.min(1, Math.max(0, u));
      const ka = Math.sin((1 - f) * d) / sin;
      const kb = Math.sin(f * d) / sin;
      const x = ka * a[0] + kb * b[0];
      const y = ka * a[1] + kb * b[1];
      const z = ka * a[2] + kb * b[2];
      return {
        lon: Math.atan2(y, x) / RAD,
        lat: Math.asin(Math.min(1, Math.max(-1, z))) / RAD,
        zoom: 1 / w,
      };
    },
  };
}
