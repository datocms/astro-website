// The <pixel-video> element: plays a .pxv file (see format.ts) with the
// pixel effect.
//
//   <pixel-video src="/videos/globe.pxv" palette="globe">
//
// - It loads the file when it is near the viewport, and plays only when it
//   is on screen and the tab is visible.
// - Under reduced motion it shows the first frame.
// - The attribute `hold="38-47"` plays the video once up to frame 47. Then
//   the video stays in these frames: it goes back and forth between them
//   at a quarter of the speed, and it does not play the frames after them.
//   Under reduced motion it shows the last frame of the range.
// - The .pxv file gives its settings: a palette and a focus (see
//   settings.ts). The `palette` attribute replaces the palette of the file.
// - A lens under the pointer makes the squares smaller. The boolean
//   attribute `no-lens` removes it.
// - The colours of the palettes are theme tokens. Call `refreshColors()`
//   after the page changes its theme.
// - `frames` sets decoded frames directly (for example, an encoder preview).

import { prefersReducedMotion } from '~/lib/motion/inView';
import { resolveColor, TRANSPARENT } from './color';
import { decode, type PixelFrames } from './format';
import { createRenderer, type DrawSettings, type Renderer, type Rgba } from './renderer';
import { resolveSettings, type PixelVideoSettings } from './settings';
import { findPalette } from './styles';

export const TAG = 'pixel-video';

// The defaults of the element. They are in the "base" cascade layer
// (src/styles/global.css), thus the CSS modules of the site win over them.
// Without a layer, these rules would win over all the layers.
const STYLE = `
@layer base {
  ${TAG} {
    display: block;
    position: relative;
    overflow: hidden;
    aspect-ratio: var(--pixel-video-aspect, 1);
  }
  ${TAG}[hidden] { display: none; }
  ${TAG} > canvas { display: block; width: 100%; height: 100%; }
}
`;

// Share two observers between all the elements.
type Watch = {
  near: (e: IntersectionObserverEntry) => void;
  visible: (e: IntersectionObserverEntry) => void;
};
const watchers = new WeakMap<Element, Watch>();
let observers: {
  near: IntersectionObserver;
  visible: IntersectionObserver;
} | null = null;
function observe(el: Element, watch: Watch) {
  observers ??= {
    near: new IntersectionObserver(
      (entries) => entries.forEach((e) => watchers.get(e.target)?.near(e)),
      {
        rootMargin: '100% 0px',
      },
    ),
    visible: new IntersectionObserver((entries) =>
      entries.forEach((e) => watchers.get(e.target)?.visible(e)),
    ),
  };
  watchers.set(el, watch);
  observers.near.observe(el);
  observers.visible.observe(el);
}
function unobserve(el: Element) {
  watchers.delete(el);
  observers?.near.unobserve(el);
  observers?.visible.unobserve(el);
}

// Keep each file one time, also when more elements show it.
const cache = new Map<string, Promise<PixelFrames>>();
function load(url: string): Promise<PixelFrames> {
  let frames = cache.get(url);
  if (!frames) {
    frames = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => decode(new Uint8Array(buffer)));
    frames.catch(() => cache.delete(url));
    cache.set(url, frames);
  }
  return frames;
}

const Base = typeof HTMLElement === 'undefined' ? (class {} as typeof HTMLElement) : HTMLElement;

export class PixelVideoElement extends Base {
  static observedAttributes = ['src', 'palette', 'paused', 'no-lens'];

  #settings: PixelVideoSettings = resolveSettings();
  #draw: DrawSettings = {
    colors: {
      fill: [TRANSPARENT, TRANSPARENT, TRANSPARENT],
      stroke: [TRANSPARENT, TRANSPARENT, TRANSPARENT],
      ground: null,
    },
    noStroke: [false, false, false],
    extend: true,
    hover: true,
  };
  #canvas: HTMLCanvasElement | null = null;
  #renderer: Renderer | null = null;
  #frames: PixelFrames | null = null;
  #loaded: string | null = null;
  #near = false;
  #onScreen = false;
  #raf = 0;
  // Play time in seconds, and the time of the last tick.
  #clock = 0;
  #last = 0;

  /** The decoded frames, from `src` or set directly. */
  get frames(): PixelFrames | null {
    return this.#frames;
  }
  set frames(value: PixelFrames | null) {
    this.#loaded = null;
    this.#setFrames(value);
  }

  get paused(): boolean {
    return this.hasAttribute('paused');
  }
  set paused(value: boolean) {
    this.toggleAttribute('paused', value);
  }

  /** The settings in use: the settings of the file, then the `palette` attribute. */
  get settings(): PixelVideoSettings {
    return this.#settings;
  }

  connectedCallback() {
    if (!document.getElementById(`${TAG}-style`)) {
      const style = Object.assign(document.createElement('style'), {
        id: `${TAG}-style`,
        textContent: STYLE,
      });
      document.head.append(style);
    }
    this.#canvas = document.createElement('canvas');
    this.#canvas.setAttribute('aria-hidden', 'true');
    this.append(this.#canvas);
    this.#applySettings();
    try {
      this.#renderer = createRenderer(this.#canvas, () => this.#draw, this.#requestFrame);
      this.#renderer.setFrame(this.#cellsAt(), this.#frames?.width ?? 0, this.#frames?.height ?? 0);
    } catch (error) {
      console.warn(`[pixel-video] ${error instanceof Error ? error.message : error}`);
    }
    document.addEventListener('visibilitychange', this.#requestFrame);
    document.documentElement.addEventListener('colorschemechange', this.#onSchemeChange);
    observe(this, {
      near: (e) => {
        if (!e.isIntersecting || this.#near) return;
        this.#near = true;
        this.#load();
      },
      visible: (e) => {
        this.#onScreen = e.isIntersecting;
        this.#requestFrame();
      },
    });
  }

  disconnectedCallback() {
    unobserve(this);
    document.removeEventListener('visibilitychange', this.#requestFrame);
    document.documentElement.removeEventListener('colorschemechange', this.#onSchemeChange);
    cancelAnimationFrame(this.#raf);
    this.#raf = 0;
    this.#near = false;
    this.#onScreen = false;
    this.#renderer?.destroy();
    this.#renderer = null;
    this.#canvas?.remove();
    this.#canvas = null;
  }

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    if (old === value || !this.isConnected) return;
    if (name === 'palette' || name === 'no-lens') this.#applySettings();
    else if (name === 'src') this.#load();
    else this.#requestFrame();
  }

  // The tokens change with the colour scheme: read the colours again.
  #onSchemeChange = () => this.refreshColors();

  /** Read the `var()` colours again from the CSS of the page. */
  refreshColors() {
    const style = this.isConnected ? getComputedStyle(this) : null;
    const resolve = (value: string): Rgba => resolveColor(value, style);
    const palette = findPalette(this.#settings.palette)!;
    const c = palette.colors;
    this.#draw = {
      colors: {
        fill: [resolve(c.bgFill), resolve(c.midFill), resolve(c.highFill)],
        stroke: [resolve(c.bgStroke), resolve(c.midStroke), resolve(c.highStroke)],
        ground: c.groundFill ? resolve(c.groundFill) : null,
      },
      noStroke: [palette.flatBackground ?? false, false, false],
      extend: palette.extend ?? true,
      hover: !this.hasAttribute('no-lens'),
    };
    this.#requestFrame();
  }

  #applySettings() {
    const palette = this.getAttribute('palette');
    this.#settings = resolveSettings({
      ...this.#frames?.settings,
      ...(palette ? { palette } : {}),
    });
    this.style.setProperty('--pixel-video-focus', String(this.#settings.focus));
    this.refreshColors();
  }

  #load() {
    const src = this.getAttribute('src');
    if (!this.#near || !src || src === this.#loaded) return;
    this.#loaded = src;
    load(src).then(
      (frames) => {
        if (this.#loaded === src) this.#setFrames(frames);
      },
      (error) => {
        console.warn(`[pixel-video] ${error instanceof Error ? error.message : error}`);
        this.dispatchEvent(
          new CustomEvent('pixel-video-error', {
            detail: { error },
            bubbles: true,
          }),
        );
      },
    );
  }

  #setFrames(frames: PixelFrames | null) {
    const old = this.#frames;
    // New cells for the same video (for example, new thresholds in the
    // encoder) do not start the video again.
    const same =
      old &&
      frames &&
      old.width === frames.width &&
      old.height === frames.height &&
      old.count === frames.count &&
      old.fps === frames.fps;
    this.#frames = frames;
    if (!same) this.#clock = 0;
    if (old?.settings !== frames?.settings) this.#applySettings();
    if (frames)
      this.style.setProperty('--pixel-video-aspect', `${frames.width} / ${frames.height}`);
    // The edges that cut the subject (see `Edge` in format.ts), for the CSS
    // of the page: `pixel-video[data-edges~='right']`.
    if (frames?.edges?.length) this.dataset.edges = frames.edges.join(' ');
    else delete this.dataset.edges;
    this.#renderer?.setFrame(this.#cellsAt(), frames?.width ?? 0, frames?.height ?? 0);
    if (frames) this.dispatchEvent(new Event('load'));
    this.#requestFrame();
  }

  /** The first and the last frame of the `hold` attribute. */
  get #hold(): [number, number] | null {
    const match = this.getAttribute('hold')?.match(/^(\d+)-(\d+)$/);
    return match ? [Number(match[1]), Number(match[2])] : null;
  }

  /** The frame to show at the current time of the clock. */
  #frameIndex(fps: number): number {
    const hold = this.#hold;
    if (prefersReducedMotion()) return hold ? hold[1] : 0;
    const played = this.#clock * fps;
    if (!hold || played < hold[1]) return Math.floor(played);
    const [first, last] = hold;
    const span = last - first;
    const position = ((played - last) / 4) % (2 * span);
    return Math.floor(last - (position < span ? position : 2 * span - position));
  }

  #cellsAt(): Uint8Array | null {
    const f = this.#frames;
    if (!f) return null;
    const size = f.width * f.height;
    const i = this.#frameIndex(f.fps) % f.count;
    return f.cells.subarray(i * size, (i + 1) * size);
  }

  get #live() {
    return this.isConnected && this.#onScreen && !document.hidden && !!this.#renderer;
  }

  get #playing() {
    return this.#live && !this.paused && (this.#frames?.count ?? 0) > 1 && !prefersReducedMotion();
  }

  #requestFrame = () => {
    if (!this.#raf && this.#live) this.#raf = requestAnimationFrame(this.#tick);
  };

  #tick = (now: number) => {
    this.#raf = 0;
    const renderer = this.#renderer;
    if (!renderer) return;
    const playing = this.#playing;
    // A pause (off screen, hidden tab) does not move the clock.
    if (playing && this.#last) this.#clock += Math.min((now - this.#last) / 1000, 0.1);
    this.#last = playing ? now : 0;
    const f = this.#frames;
    // When it does not play, it keeps the current frame.
    if (f) renderer.setFrame(this.#cellsAt(), f.width, f.height);
    renderer.render(prefersReducedMotion() ? 0 : now / 1000);
    if (playing || renderer.hovering) this.#requestFrame();
  };
}

export function definePixelVideo() {
  if (typeof customElements === 'undefined' || customElements.get(TAG)) return;
  customElements.define(TAG, PixelVideoElement);
}
