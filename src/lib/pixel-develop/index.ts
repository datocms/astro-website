// The pixel development of an image: the image starts as large square
// cells, and the cells get smaller in steps until the image is sharp. The
// logo plate of a partner and the image of a showcase project use it.
//
// - The function reads the image into a canvas, at the size of the canvas
//   on the screen, with the fit and the position of the image (`contain`
//   and centred, or `cover` from the top left corner).
// - Each step divides the image into square cells. A cell gets the mean of
//   the most frequent colour in it (pixels go into buckets of similar
//   colours, 4 bits for each channel). A mean of all the pixels would mix
//   two colours of the image into a colour that the image does not have
//   (black on yellow gives olive). This is the rule of the pixel pictures
//   of the site (the OG card).
// - Each mode has a ground: white in the `ink` mode (a logo on white), and
//   the most frequent colour of the image in the `photo` mode (the
//   background of an illustration, the white of a web page). Only the
//   pixels that are far from the ground are ink. A cell where the ink
//   covers enough of the area gets the colour of the ink. Else, the cell
//   stays empty in the `ink` mode, and gets the ground in the `photo` mode.
//   Thus the subject shows from the first step, also when it is a thin
//   line on a large background.
// - The size of the cells comes from the area of the image (the square
//   root of width times height), thus a wide image and a square image
//   develop the same. The cells start at a quarter of that size, then they
//   get half as large at each step. The steps do not fade: a change of
//   step is one frame, as in pixel art.
// - The element gets `data-state`: `pending` until it comes into view,
//   `loading` while the image loads (the CSS shows the spinner),
//   `developing` while the canvas shows the cells, `sharp` at the end. The
//   CSS of the element shows the spinner, the canvas or the image for each
//   state.
// - Without motion (no `data-motion="on"` on the root), when the image
//   does not load, or when the browser does not let the page read it, the
//   state is `sharp` at once.
// - The CSS of each element has a failsafe: an animation with a name that
//   contains `failsafe` shows the sharp image after a short time, also when
//   the script does not run. When that animation is at its end before the
//   image is ready, the image does not develop: it is already on the
//   screen. The time of the failsafe starts when the element shows, not
//   when the navigation starts, thus a slow server does not stop the
//   development.

import { onEnterViewport } from '~/lib/motion/inView';

export type DevelopMode = 'ink' | 'photo';
export type DevelopFit = 'contain' | 'cover';

export interface DevelopOptions {
  /** The address of the image that the canvas reads. It must allow CORS. */
  src: string;
  /** The canvas that shows the cells. The CSS gives it its size on the screen. */
  canvas: HTMLCanvasElement;
  mode: DevelopMode;
  /** `contain`: centred in the canvas. `cover`: fills the canvas from its top left corner. */
  fit: DevelopFit;
}

type State = 'pending' | 'loading' | 'developing' | 'sharp';

// The size of the cells at each step, as a part of the side of a square
// with the area of the image.
const STEPS = [1 / 4, 1 / 8, 1 / 16, 1 / 32];
// The time of each step, in ms. The first step stays longer: the eye sees
// the large cells first, then the image comes quickly into focus.
const STEP_MS = [260, 140, 110, 90];
// The time from the entry in view to the first step.
const DELAY_MS = 150;
// A pixel is ink when it is this far from the ground (the sum of the
// differences of the three channels, 0–765).
const INK_DISTANCE = 60;
// A cell gets the colour of the ink when the ink covers this part of its
// area or more. A logo is solid, thus it needs much ink. An illustration
// can be thin lines, thus a photo needs less.
const INK_COVERAGE: Record<DevelopMode, number> = { ink: 0.3, photo: 0.08 };

/** The visible part of the image, drawn on white, in device pixels. */
interface Source {
  pixels: Uint8ClampedArray;
  /** The colour that is not ink. */
  ground: Rgb;
  width: number;
  height: number;
  /** The position of this part in the canvas, in device pixels. */
  x: number;
  y: number;
}

/**
 * Develops the image when `element` comes into view. The state goes on
 * `element.dataset.state`.
 */
export function developWhenInView(element: HTMLElement, options: DevelopOptions) {
  const setState = (state: State) => {
    element.dataset.state = state;
  };

  if (document.documentElement.dataset.motion !== 'on') {
    setState('sharp');
    return;
  }
  setState('pending');
  // The image loads at once, not when the element comes into view: the
  // failsafe of the CSS does not wait.
  const image = loadImage(options.src);
  onEnterViewport(
    element,
    async () => {
      setState('loading');
      const source = await image.then((loaded) => readSource(loaded, options)).catch(() => null);
      if (!source || failsafeIsOver(element)) {
        setState('sharp');
        return;
      }
      setState('developing');
      await wait(DELAY_MS);
      for (const [index, step] of STEPS.entries()) {
        drawCells(options.canvas, source, step, options.mode);
        await wait(STEP_MS[index]!);
      }
      setState('sharp');
    },
    { threshold: 0.3 },
  );
}

// Draws the image on white into a canvas of the size of the canvas on the
// screen, with the fit of the image, and keeps the part that is visible.
function readSource(image: HTMLImageElement, { canvas, fit, mode }: DevelopOptions): Source {
  const dpr = window.devicePixelRatio || 1;
  const box = canvas.getBoundingClientRect();
  const width = Math.round(box.width * dpr);
  const height = Math.round(box.height * dpr);
  if (width === 0 || height === 0) throw new Error('The canvas has no size');

  const ratioX = width / image.naturalWidth;
  const ratioY = height / image.naturalHeight;
  const scale = fit === 'contain' ? Math.min(ratioX, ratioY) : Math.max(ratioX, ratioY);
  const drawWidth = Math.round(image.naturalWidth * scale);
  const drawHeight = Math.round(image.naturalHeight * scale);
  // `contain` centres the image. `cover` starts at the top left corner, and
  // the edges of the canvas cut the image at the right and at the bottom.
  const drawX = fit === 'contain' ? Math.round((width - drawWidth) / 2) : 0;
  const drawY = fit === 'contain' ? Math.round((height - drawHeight) / 2) : 0;

  const x = Math.max(0, drawX);
  const y = Math.max(0, drawY);
  const visibleWidth = Math.min(width, drawX + drawWidth) - x;
  const visibleHeight = Math.min(height, drawY + drawHeight) - y;

  const work = document.createElement('canvas');
  work.width = visibleWidth;
  work.height = visibleHeight;
  const context = work.getContext('2d', { willReadFrequently: true })!;
  context.fillStyle = '#fff';
  context.fillRect(0, 0, visibleWidth, visibleHeight);
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, drawX - x, drawY - y, drawWidth, drawHeight);
  // This throws when the image comes from a different origin with no CORS headers.
  const { data } = context.getImageData(0, 0, visibleWidth, visibleHeight);

  canvas.width = width;
  canvas.height = height;
  const ground = mode === 'ink' ? { r: 255, g: 255, b: 255 } : mostFrequentColour(data);
  return { pixels: data, ground, width: visibleWidth, height: visibleHeight, x, y };
}

// Draws one step: square cells of `step` times the side of the image. The
// grid has its centre at the centre of the image, thus the cells at the
// two sides are equal.
function drawCells(canvas: HTMLCanvasElement, source: Source, step: number, mode: DevelopMode) {
  const context = canvas.getContext('2d')!;
  context.clearRect(0, 0, canvas.width, canvas.height);

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
      const pixels: number[] = [];
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) pixels.push((y * source.width + x) * 4);
      }
      const isInk = (i: number) => distance(source.pixels, i, source.ground) >= INK_DISTANCE;
      const ink = pixels.filter(isInk);
      const colour =
        ink.length > 0 && ink.length >= pixels.length * INK_COVERAGE[mode]
          ? mostFrequentColour(source.pixels, ink)
          : mode === 'photo'
            ? source.ground
            : null;
      if (!colour) continue;
      const { r, g, b } = colour;
      context.fillStyle = `rgb(${r} ${g} ${b})`;
      context.fillRect(source.x + left + col * cell, source.y + top + row * cell, cell, cell);
    }
  }
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

// The sum of the differences of the three channels between the pixel at
// `i` and `colour`.
function distance(pixels: Uint8ClampedArray, i: number, colour: Rgb) {
  return (
    Math.abs(pixels[i]! - colour.r) +
    Math.abs(pixels[i + 1]! - colour.g) +
    Math.abs(pixels[i + 2]! - colour.b)
  );
}

// The pixels go into buckets of similar colours (4 bits for each channel).
// The result is the mean colour of the largest bucket. `indexes` are the
// pixels to read; without it, all the pixels.
function mostFrequentColour(pixels: Uint8ClampedArray, indexes?: number[]): Rgb {
  const buckets = new Map<number, Rgb & { n: number }>();
  const add = (i: number) => {
    const r = pixels[i]!;
    const g = pixels[i + 1]!;
    const b = pixels[i + 2]!;
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
  };
  if (indexes) for (const i of indexes) add(i);
  else for (let i = 0; i < pixels.length; i += 4) add(i);
  let largest = { r: 255, g: 255, b: 255, n: 0 };
  for (const bucket of buckets.values()) if (bucket.n > largest.n) largest = bucket;
  if (largest.n === 0) return largest;
  return {
    r: Math.round(largest.r / largest.n),
    g: Math.round(largest.g / largest.n),
    b: Math.round(largest.b / largest.n),
  };
}

async function loadImage(src: string) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;
  await image.decode();
  return image;
}

// True when the failsafe animation of the CSS (see the top of the file) is
// at its end. Without a failsafe animation, false.
function failsafeIsOver(element: HTMLElement) {
  const failsafe = element
    .getAnimations({ subtree: true })
    .find(
      (animation) =>
        animation instanceof CSSAnimation && animation.animationName.includes('failsafe'),
    );
  return failsafe?.playState === 'finished';
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
