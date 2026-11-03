// The <logo-plate> element: the logo of a partner on a white plate, that
// develops when the plate comes into view (see Component.astro).
//
// - The element reads the PNG of the logo into a canvas, on white, at the
//   size of the logo on the screen. Each step of the development divides
//   the logo into square cells. A cell where the ink of the logo covers
//   enough of the area gets the most frequent colour of that ink; the
//   other cells stay white. A mean would mix two colours of the logo into
//   a colour that the logo does not have (black on yellow gives olive). This is the rule of the pixel pictures of the site (the OG
//   card). Thus the cells keep the full colours of the logo: the plate does
//   not change them, and the white does not make them pale.
// - The size of the cells comes from the area of the logo (the square root
//   of width times height), thus a wide, thin logo and a square logo
//   develop the same. The cells start at a quarter of that size, then they
//   get half as large at each step. After the last step the canvas goes and
//   the image shows. The steps do not fade: a change of step is one frame,
//   as in pixel art.
// - The canvas is a 2D canvas. The work is one pass over the pixels for
//   each step, and a logo has few pixels.
// - Without motion (no `data-motion="on"` on the root), when the PNG does
//   not load, or when the browser does not let the page read it, the image
//   shows at once.

import { onEnterViewport } from '~/lib/motion/inView';
import { WebComponent } from '~/lib/WebComponent';

export const TAG = 'logo-plate';

// The size of the cells at each step, as a part of the side of a square
// with the area of the logo.
const STEPS = [1 / 4, 1 / 8, 1 / 16, 1 / 32];
// The time of each step, in ms. The first step stays longer: the eye sees
// the large cells first, then the logo comes quickly into focus.
const STEP_MS = [260, 140, 110, 90];
// The time from the entry in view to the first step.
const DELAY_MS = 150;
// A pixel is ink when it is this far from white (the sum of the three
// channels, 0–765).
const INK_DISTANCE = 60;
// A cell shows when the ink covers this part of its area or more.
const INK_COVERAGE = 0.3;
// After this time from the start of the page, the CSS shows the sharp logo
// (see style.module.css). After it, the logo does not develop.
const FAILSAFE_MS = 2200;

type State = 'pending' | 'developing' | 'sharp';

/** The logo drawn on white, at the size of the logo on the screen, in device pixels. */
interface Source {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
  /** The position of the logo in the canvas, in device pixels. */
  x: number;
  y: number;
}

export class LogoPlateElement extends WebComponent {
  #canvas!: HTMLCanvasElement;

  parsedCallback() {
    this.#canvas = this.$<HTMLCanvasElement>('canvas');

    if (document.documentElement.dataset.motion !== 'on') {
      this.#setState('sharp');
      return;
    }
    this.#setState('pending');
    onEnterViewport(this, () => this.#develop(), { threshold: 0.3 });
  }

  #setState(state: State) {
    this.dataset.state = state;
  }

  async #develop() {
    const source = await this.#readSource().catch(() => null);
    if (!source || performance.now() > FAILSAFE_MS) {
      this.#setState('sharp');
      return;
    }
    this.#setState('developing');
    await wait(DELAY_MS);
    for (const [index, step] of STEPS.entries()) {
      this.#drawCells(source, step);
      await wait(STEP_MS[index]!);
    }
    this.#setState('sharp');
  }

  // Draws the PNG of the logo on white into a canvas of the size of the
  // canvas on the screen. The logo has the fit `contain` of the image.
  async #readSource(): Promise<Source> {
    const png = new Image();
    png.crossOrigin = 'anonymous';
    png.src = this.dataset.src!;
    await png.decode();

    const dpr = window.devicePixelRatio || 1;
    const box = this.#canvas.getBoundingClientRect();
    const width = Math.round(box.width * dpr);
    const height = Math.round(box.height * dpr);
    if (width === 0 || height === 0) throw new Error('The plate has no size');

    const scale = Math.min(width / png.naturalWidth, height / png.naturalHeight);
    const logoWidth = Math.round(png.naturalWidth * scale);
    const logoHeight = Math.round(png.naturalHeight * scale);
    const x = Math.round((width - logoWidth) / 2);
    const y = Math.round((height - logoHeight) / 2);

    const work = document.createElement('canvas');
    work.width = logoWidth;
    work.height = logoHeight;
    const context = work.getContext('2d', { willReadFrequently: true })!;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, logoWidth, logoHeight);
    context.imageSmoothingQuality = 'high';
    context.drawImage(png, 0, 0, logoWidth, logoHeight);
    // This throws when the PNG comes from a different origin with no CORS headers.
    const { data } = context.getImageData(0, 0, logoWidth, logoHeight);

    this.#canvas.width = width;
    this.#canvas.height = height;
    return { pixels: data, width: logoWidth, height: logoHeight, x, y };
  }

  // Draws one step: square cells of `step` times the side of the logo.
  // The grid has its centre at the centre of the logo, thus the cells at
  // the two sides are equal.
  #drawCells(source: Source, step: number) {
    const context = this.#canvas.getContext('2d')!;
    context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    const side = Math.sqrt(source.width * source.height);
    const cell = Math.max(2, Math.round(side * step));
    const cols = Math.ceil(source.width / cell);
    const rows = Math.ceil(source.height / cell);
    const left = Math.round((source.width - cols * cell) / 2);
    const top = Math.round((source.height - rows * cell) / 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x0 = Math.max(0, left + col * cell);
        const y0 = Math.max(0, top + row * cell);
        const x1 = Math.min(source.width, left + (col + 1) * cell);
        const y1 = Math.min(source.height, top + (row + 1) * cell);
        // The ink pixels go into buckets of similar colours (4 bits for
        // each channel). The cell takes the mean colour of the largest bucket.
        const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
        let ink = 0;
        let count = 0;
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * source.width + x) * 4;
            const r = source.pixels[i]!;
            const g = source.pixels[i + 1]!;
            const b = source.pixels[i + 2]!;
            count++;
            if (765 - r - g - b < INK_DISTANCE) continue;
            ink++;
            const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
            const bucket = buckets.get(key);
            if (bucket) {
              bucket.r += r;
              bucket.g += g;
              bucket.b += b;
              bucket.n++;
            } else {
              buckets.set(key, { r, g, b, n: 1 });
            }
          }
        }
        if (ink === 0 || ink < count * INK_COVERAGE) continue;
        let largest = { r: 0, g: 0, b: 0, n: 0 };
        for (const bucket of buckets.values()) if (bucket.n > largest.n) largest = bucket;
        const r = Math.round(largest.r / largest.n);
        const g = Math.round(largest.g / largest.n);
        const b = Math.round(largest.b / largest.n);
        context.fillStyle = `rgb(${r} ${g} ${b})`;
        context.fillRect(source.x + left + col * cell, source.y + top + row * cell, cell, cell);
      }
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function defineLogoPlate() {
  if (!customElements.get(TAG)) customElements.define(TAG, LogoPlateElement);
}
