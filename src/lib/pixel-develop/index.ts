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
//   `loading` while the image loads (the CSS shows the working mark),
//   `developing` while the canvas shows the cells, `sharp` at the end. The
//   CSS of the element shows the mark, the canvas or the image for each
//   state.
// - The HTML can have the first step already, from the thumbhash of the
//   image (`./thumbhash.ts`). Then the canvas starts at the second step
//   (`fromStep: 1`).
// - The cells come from `./cells.ts`, which has no DOM: the server uses it
//   too.
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
import { cellsOf, groundOf, STEPS, type DevelopMode, type Pixels } from './cells';

export type { DevelopMode };
export type DevelopFit = 'contain' | 'cover';

export interface DevelopOptions {
  /** The address of the image that the canvas reads. It must allow CORS. */
  src: string;
  /** The canvas that shows the cells. The CSS gives it its size on the screen. */
  canvas: HTMLCanvasElement;
  mode: DevelopMode;
  /** `contain`: centred in the canvas. `cover`: fills the canvas from its top left corner. */
  fit: DevelopFit;
  /** The first step that the canvas draws. 1 when the HTML has the first step. */
  fromStep?: number;
}

type State = 'pending' | 'loading' | 'developing' | 'sharp';

// The time of each step, in ms. The first step stays longer: the eye sees
// the large cells first, then the image comes quickly into focus.
const STEP_MS = [260, 140, 110, 90];
// The time from the entry in view to the first step.
const DELAY_MS = 150;
/** The visible part of the image, drawn on white, in device pixels. */
interface Source extends Pixels {
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
        if (index < (options.fromStep ?? 0)) continue;
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
  const ground = groundOf(data, mode);
  return { pixels: data, ground, width: visibleWidth, height: visibleHeight, x, y };
}

// Draws one step of `./cells.ts` into the canvas.
function drawCells(canvas: HTMLCanvasElement, source: Source, step: number, mode: DevelopMode) {
  const context = canvas.getContext('2d')!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const { x, y, size, colour } of cellsOf(source, step, mode)) {
    context.fillStyle = `rgb(${colour.r} ${colour.g} ${colour.b})`;
    context.fillRect(source.x + x, source.y + y, size, size);
  }
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
