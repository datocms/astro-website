// The <pixel-video> element: plays a .pxv file (see format.ts) with the
// pixel effect.
//
//   <pixel-video src="/globe.pxv" settings='{"bgFill": "var(--surface-accent)"}'>
//
// - It loads the file when it is near the viewport, and plays only when it
//   is on screen and the tab is visible.
// - Under reduced motion it shows the first frame.
// - Colours can be `var(--token)` or `var(--token, #hex)`, or a colour
//   function with tokens in it, for example
//   `color-mix(in srgb, var(--surface-inverse) 90%, var(--surface-default))`.
//   Call `refreshColors()` after the page changes its theme.
// - `frames` sets decoded frames directly (for example, an encoder preview).
// - The .pxv file can have suggested settings. The `settings` attribute (or
//   property) replaces them, key by key.

import { prefersReducedMotion } from '~/lib/motion/inView';
import { resolveColor, TRANSPARENT } from './color';
import { decode, type PixelFrames } from './format';
import { createRenderer, type DrawSettings, type Renderer, type Rgba } from './renderer';
import { COLOR_KEYS, resolveSettings, type PixelVideoSettings } from './settings';

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
  static observedAttributes = ['src', 'settings', 'paused'];

  #settings: PixelVideoSettings = resolveSettings();
  // The settings of the attribute or of the property, not resolved.
  #overrides: Partial<PixelVideoSettings> | null = null;
  #draw: DrawSettings = {
    ...this.#settings,
    colors: {
      fill: [TRANSPARENT, TRANSPARENT, TRANSPARENT],
      stroke: [TRANSPARENT, TRANSPARENT, TRANSPARENT],
    },
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

  /**
   * Partial settings. They replace the `settings` attribute. The getter
   * gives the settings in use: the defaults, then the settings of the file,
   * then these.
   */
  set settings(value: Partial<PixelVideoSettings> | null) {
    this.#applySettings(value);
  }
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
    this.#applySettings(this.#parseAttribute());
    try {
      this.#renderer = createRenderer(this.#canvas, () => this.#draw, this.#requestFrame);
      this.#renderer.setFrame(
        this.#cellsAt(0),
        this.#frames?.width ?? 0,
        this.#frames?.height ?? 0,
      );
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
    if (name === 'settings') this.#applySettings(this.#parseAttribute());
    else if (name === 'src') this.#load();
    else this.#requestFrame();
  }

  // The tokens change with the colour scheme: read the colours again.
  #onSchemeChange = () => this.refreshColors();

  /** Read the `var()` colours again from the CSS of the page. */
  refreshColors() {
    const style = this.isConnected ? getComputedStyle(this) : null;
    const resolve = (value: string): Rgba => resolveColor(value, style);
    const [bgFill, bgStroke, midFill, midStroke, highFill, highStroke] = COLOR_KEYS.map((key) =>
      resolve(this.#settings[key]),
    );
    this.#draw = {
      ...this.#settings,
      colors: {
        fill: [bgFill!, midFill!, highFill!],
        stroke: [bgStroke!, midStroke!, highStroke!],
      },
    };
    this.#requestFrame();
  }

  #parseAttribute(): Partial<PixelVideoSettings> | null {
    const json = this.getAttribute('settings');
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      console.warn('[pixel-video] the settings attribute is not valid JSON');
      return null;
    }
  }

  #applySettings(value: Partial<PixelVideoSettings> | null) {
    this.#overrides = value;
    this.#settings = resolveSettings({
      ...this.#frames?.settings,
      ...value,
    });
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
    if (old?.settings !== frames?.settings) this.#applySettings(this.#overrides);
    if (frames)
      this.style.setProperty('--pixel-video-aspect', `${frames.width} / ${frames.height}`);
    const index = frames ? Math.floor(this.#clock * frames.fps) : 0;
    this.#renderer?.setFrame(this.#cellsAt(index), frames?.width ?? 0, frames?.height ?? 0);
    if (frames) this.dispatchEvent(new Event('load'));
    this.#requestFrame();
  }

  #cellsAt(index: number): Uint8Array | null {
    const f = this.#frames;
    if (!f) return null;
    const size = f.width * f.height;
    const i = index % f.count;
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
    // When it does not play, it keeps the current frame. Under reduced
    // motion it shows the first frame.
    if (f)
      renderer.setFrame(
        this.#cellsAt(prefersReducedMotion() ? 0 : Math.floor(this.#clock * f.fps)),
        f.width,
        f.height,
      );
    renderer.render(prefersReducedMotion() ? 0 : now / 1000);
    if (playing || renderer.hovering) this.#requestFrame();
  };
}

export function definePixelVideo() {
  if (typeof customElements === 'undefined' || customElements.get(TAG)) return;
  customElements.define(TAG, PixelVideoElement);
}
