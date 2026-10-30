// The <pixel-image> element: an image that shows a pixel version of itself
// when the pointer is on the card link around it (see Component.astro).
//
// - When the image is near the viewport, the element reads the loaded image
//   into a small grid (one canvas pixel for each cell), with the same cover
//   crop as the image. quantize() of format.ts puts each cell in one of
//   three layers by brightness. The element then draws the cells one time
//   into a 2D canvas, in the colours of the Tint + highlight style. Two more
//   tones are only here: pure white replaces the colour of the brightest
//   cells, and a shadow tone (--pixel-shadow in style.module.css) replaces
//   the colour of the lighter half of the dark cells. The format of the
//   pixel videos has only three layers.
// - While the card is hovered, the image breathes: all the brightness
//   limits of the tones go down and up together, slowly. Thus the tone
//   areas grow and shrink a little, as if the light in the photo pulses.
//   The breath starts and ends at the static drawing. With reduced motion
//   the image is static.
// - A 2D canvas, not WebGL2: the cells are flat squares with no grid, thus
//   the result is the same, and a page with many cards uses no GPU context.
// - CSS shows the canvas (see style.module.css). The script only sets
//   data-ready when the canvas has a drawing.
// - No effect on a device with no hover (touch screens), when the image
//   does not load, or when the browser does not let the page read the image
//   (an image from a different origin with no CORS headers).

import { onEnterViewport, prefersReducedMotion } from '~/lib/motion/inView';
import { resolveColor } from '~/lib/pixel-video/color';
import { EMPTY, lumaOf, quantize, type Thresholds } from '~/lib/pixel-video/format';
import type { Rgba } from '~/lib/pixel-video/renderer';
import { tintHighlight } from '~/lib/pixel-video/styles';

export const TAG = 'pixel-image';

// 160 cells on the width: about 3.5 px cells on a 560 px image. Larger
// cells show the image less clearly. The value is a percentage of the width,
// like the sizes of the pixel video, thus the look is the same at each size.
export const DEFAULT_CELL_SIZE = 100 / 160;
export const DEFAULT_THRESHOLDS: Thresholds = { tMid: 60, tHigh: 160 };
// The brightness limits (0–255) of the shadow cells and of the white cells.
export const SHADOW_THRESHOLD = 45;
export const WHITE_THRESHOLD = 215;

// The breath. The limits move by this much brightness (0–255) up and down,
// in one breath of this duration. A step is 125 ms: 8 steps a second, like
// pixel art.
const BREATH_AMPLITUDE = 8;
const BREATH_PERIOD_MS = 4000;
const BREATH_STEP_MS = 125;

// The tones, from dark to light: dark, shadow, accent, highlight, white.
// EMPTY_TONE is a see-through cell.
const EMPTY_TONE = 255;

const Base = typeof HTMLElement === 'undefined' ? (class {} as typeof HTMLElement) : HTMLElement;

export class PixelImageElement extends Base {
  #stop: (() => void) | null = null;
  #resize: ResizeObserver | null = null;
  #width = 0;
  #height = 0;

  // The drawing, kept for the breath.
  #ctx: CanvasRenderingContext2D | null = null;
  #cols = 0;
  #cell = 0;
  #offsetX = 0;
  #offsetY = 0;
  #fills: string[] = [];
  // The brightness of each cell, the limits of the tones, the tone of each
  // cell in the static drawing and the tone that the canvas shows now.
  #lumas = new Uint8Array(0);
  #limits: number[] = [];
  #tones = new Uint8Array(0);
  #shown = new Uint8Array(0);
  #timer: ReturnType<typeof setInterval> | null = null;
  #startTime = 0;
  // The element that the pointer goes on: the card link, else this element.
  #hoverTarget: Element | null = null;

  connectedCallback() {
    if (!matchMedia('(hover: hover)').matches) return;
    // Start before the image comes into view, thus the drawing is ready
    // when the pointer comes.
    this.#stop = onEnterViewport(this, () => this.#start(), { rootMargin: '200px' });
    document.documentElement.addEventListener('colorschemechange', this.#onSchemeChange);
    this.#hoverTarget = this.closest('a') ?? this;
    this.#hoverTarget.addEventListener('pointerenter', this.#play);
    this.#hoverTarget.addEventListener('pointerleave', this.#pause);
    this.#hoverTarget.addEventListener('focusin', this.#play);
    this.#hoverTarget.addEventListener('focusout', this.#pause);
  }

  disconnectedCallback() {
    document.documentElement.removeEventListener('colorschemechange', this.#onSchemeChange);
    this.#hoverTarget?.removeEventListener('pointerenter', this.#play);
    this.#hoverTarget?.removeEventListener('pointerleave', this.#pause);
    this.#hoverTarget?.removeEventListener('focusin', this.#play);
    this.#hoverTarget?.removeEventListener('focusout', this.#pause);
    this.#hoverTarget = null;
    this.#pause();
    this.#stop?.();
    this.#stop = null;
    this.#resize?.disconnect();
    this.#resize = null;
  }

  // The tokens change with the colour scheme: draw again in the new colours.
  #onSchemeChange = () => {
    const img = this.querySelector('img');
    if (!img || !this.#resize) return;
    this.#width = 0;
    this.#draw(img);
  };

  async #start() {
    const img = this.querySelector('img');
    if (!img) return;
    try {
      // decode() waits for the load. It fails if the image does not load.
      await img.decode();
    } catch {
      return;
    }
    if (!this.isConnected) return;
    this.#draw(img);
    // Draw again when the size of the image changes (a breakpoint).
    this.#resize = new ResizeObserver(() => this.#draw(img));
    this.#resize.observe(this);
  }

  #draw(img: HTMLImageElement) {
    const canvas = this.querySelector('canvas');
    if (!canvas || !img.naturalWidth) return;
    const dpr = Math.min(devicePixelRatio, 2);
    const W = Math.round(this.clientWidth * dpr);
    const H = Math.round(this.clientHeight * dpr);
    if (!W || !H || (W === this.#width && H === this.#height)) return;
    this.#width = W;
    this.#height = H;

    // Cells are whole device px, thus all the cells have the same size.
    const cellSize = Number(this.dataset.cellSize) || DEFAULT_CELL_SIZE;
    const cell = Math.max(1, Math.round((cellSize / 100) * W));
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);

    // 1. The image, with a cover crop, at one pixel for each cell. The grid
    //    can be a little larger than the element: it is centred, as the
    //    cover crop of the image.
    const grid = document.createElement('canvas');
    grid.width = cols;
    grid.height = rows;
    const g = grid.getContext('2d', { willReadFrequently: true });
    if (!g) return;
    const scale = Math.max((cols * cell) / img.naturalWidth, (rows * cell) / img.naturalHeight);
    const sw = (cols * cell) / scale;
    const sh = (rows * cell) / scale;
    g.imageSmoothingQuality = 'high';
    g.drawImage(
      img,
      (img.naturalWidth - sw) / 2,
      (img.naturalHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      cols,
      rows,
    );
    let pixels: ImageData;
    try {
      pixels = g.getImageData(0, 0, cols, rows);
    } catch {
      // The canvas is tainted: the image comes from a different origin
      // with no CORS headers. Show no effect.
      return;
    }

    // 2. Give each cell a tone by its brightness, then the colour of its
    //    tone. quantize() finds the empty cells (see-through pixels of the
    //    image): they stay empty, thus the image under the canvas shows.
    this.#pause();
    const cells = new Uint8Array(cols * rows);
    quantize(pixels.data, cells, 0);
    const { tMid, tHigh } = this.#thresholds();
    const limits = [SHADOW_THRESHOLD, tMid, tHigh, WHITE_THRESHOLD];
    const style = getComputedStyle(this);
    const palette: Rgba[] = [
      tintHighlight.bgFill ?? '',
      'var(--pixel-shadow)',
      tintHighlight.midFill ?? '',
      tintHighlight.highFill ?? '',
      'var(--surface-pixel-white)',
    ].map((value) => resolveColor(value, style));
    const lumas = new Uint8Array(cells.length);
    const tones = new Uint8Array(cells.length);
    const out = pixels.data;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === EMPTY) {
        tones[i] = EMPTY_TONE;
        out.fill(0, i * 4, i * 4 + 4);
        continue;
      }
      lumas[i] = lumaOf(out[i * 4]!, out[i * 4 + 1]!, out[i * 4 + 2]!);
      const tone = toneOf(lumas[i]!, limits, 0);
      tones[i] = tone;
      const [r, gr, b, a] = palette[tone]!;
      out[i * 4] = r * 255;
      out[i * 4 + 1] = gr * 255;
      out[i * 4 + 2] = b * 255;
      out[i * 4 + 3] = a * 255;
    }
    g.putImageData(pixels, 0, 0);

    // 3. Scale the grid up to the canvas, with no smoothing.
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const offsetX = Math.floor((W - cols * cell) / 2);
    const offsetY = Math.floor((H - rows * cell) / 2);
    ctx.drawImage(grid, offsetX, offsetY, cols * cell, rows * cell);

    // 4. Keep what the breath needs.
    this.#ctx = ctx;
    this.#cols = cols;
    this.#cell = cell;
    this.#offsetX = offsetX;
    this.#offsetY = offsetY;
    this.#fills = palette.map(([r, gr, b, a]) => `rgb(${r * 255} ${gr * 255} ${b * 255} / ${a})`);
    this.#lumas = lumas;
    this.#limits = limits;
    this.#tones = tones;
    this.#shown = tones.slice();
    this.dataset.ready = '';
    if (this.#hoverTarget?.matches(':hover, :focus-within')) this.#play();
  }

  // Start the breath. Not with reduced motion, and not before the drawing.
  #play = () => {
    if (this.#timer || !this.#ctx || prefersReducedMotion()) return;
    this.#startTime = performance.now();
    this.#timer = setInterval(this.#step, BREATH_STEP_MS);
  };

  // Stop the breath and put back the static drawing.
  #pause = () => {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
    this.#show(0);
  };

  #step = () => {
    // A sine from 0, thus the breath starts at the static drawing. The
    // limits go up first: the image gets darker, then lighter.
    const phase = ((performance.now() - this.#startTime) / BREATH_PERIOD_MS) * 2 * Math.PI;
    this.#show(Math.round(BREATH_AMPLITUDE * Math.sin(phase)));
  };

  // Show each cell in its tone for the limits moved by this offset. Paint
  // only the cells that change.
  #show(offset: number) {
    for (let i = 0; i < this.#tones.length; i++) {
      if (this.#tones[i] === EMPTY_TONE) continue;
      const tone = toneOf(this.#lumas[i]!, this.#limits, offset);
      if (tone === this.#shown[i]) continue;
      this.#shown[i] = tone;
      this.#paint(i, tone);
    }
  }

  #paint(i: number, tone: number) {
    const ctx = this.#ctx;
    if (!ctx) return;
    ctx.fillStyle = this.#fills[tone]!;
    ctx.fillRect(
      this.#offsetX + (i % this.#cols) * this.#cell,
      this.#offsetY + Math.floor(i / this.#cols) * this.#cell,
      this.#cell,
      this.#cell,
    );
  }

  #thresholds(): Thresholds {
    const tMid = Number(this.dataset.tMid);
    const tHigh = Number(this.dataset.tHigh);
    return {
      tMid: Number.isFinite(tMid) && this.dataset.tMid ? tMid : DEFAULT_THRESHOLDS.tMid,
      tHigh: Number.isFinite(tHigh) && this.dataset.tHigh ? tHigh : DEFAULT_THRESHOLDS.tHigh,
    };
  }
}

/** The tone (0–4) of a brightness: the number of limits at or below it. */
function toneOf(luma: number, limits: number[], offset: number) {
  let tone = 0;
  for (const limit of limits) if (luma >= limit + offset) tone++;
  return tone;
}

export function definePixelImage() {
  if (typeof customElements !== 'undefined' && !customElements.get(TAG))
    customElements.define(TAG, PixelImageElement);
}
