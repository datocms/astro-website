// Read the frames of a video in the browser, as brightness and alpha values.
// Then `flatten()` and `classify()` sort them into layers, and `encode()`
// makes a .pxv file.
// This needs a browser that can copy video frames into a canvas (not Firefox
// on Android). `extractLottieFrames()` reads a Lottie animation (JSON) in the
// same way. It does not need to read video frames.

import { readPixels, type PixelFrames } from './format';

/** Frames as brightness and alpha values (see `readPixels()` in format.ts). */
export interface LumaFrames extends Omit<PixelFrames, 'cells'> {
  luma: Uint8Array;
  alpha: Uint8Array;
  /** Some pixels are not fully opaque. */
  transparent: boolean;
}

export interface ExtractOptions {
  /** Frames per second of the result. */
  fps: number;
  /** The longest side of the result, in cells. The other side keeps the aspect ratio. */
  maxSide: number;
  /** Called after each frame with the number of frames done and the total. */
  onProgress?: (done: number, total: number) => void;
  signal?: AbortSignal;
}

function once(target: EventTarget, type: string, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const done = () => {
      target.removeEventListener('error', fail);
      signal?.removeEventListener('abort', fail);
      resolve();
    };
    const fail = () => {
      target.removeEventListener(type, done);
      reject(signal?.aborted ? signal.reason : new Error(`the video cannot load (${type})`));
    };
    target.addEventListener(type, done, { once: true });
    target.addEventListener('error', fail, { once: true });
    signal?.addEventListener('abort', fail, { once: true });
  });
}

/** Read the frames of the video at `url` (a same-origin URL or an object URL). */
export async function extractFrames(url: string, options: ExtractOptions): Promise<LumaFrames> {
  const { fps, maxSide, onProgress, signal } = options;
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.crossOrigin = 'anonymous';
  video.src = url;
  try {
    await once(video, 'loadeddata', signal);
    const { videoWidth: vw, videoHeight: vh, duration } = video;
    if (!vw || !vh || !Number.isFinite(duration))
      throw new Error('the video has no size or no duration');
    const scale = Math.min(1, maxSide / Math.max(vw, vh));
    const width = Math.max(1, Math.round(vw * scale));
    const height = Math.max(1, Math.round(vh * scale));
    const count = Math.max(1, Math.round(duration * fps));
    if (count > 0xffff) throw new Error('the video has too many frames');

    const canvas = Object.assign(document.createElement('canvas'), {
      width,
      height,
    });
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D canvas is not available');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const luma = new Uint8Array(width * height * count);
    const alpha = new Uint8Array(width * height * count);
    for (let i = 0; i < count; i++) {
      // Take the middle of each frame interval, so that the seek does not
      // land on the edge between two source frames.
      video.currentTime = Math.min((i + 0.5) / fps, duration - 0.001);
      await once(video, 'seeked', signal);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      readPixels(ctx.getImageData(0, 0, width, height).data, luma, alpha, i * width * height);
      onProgress?.(i + 1, count);
    }
    return {
      width,
      height,
      fps,
      count,
      luma,
      alpha,
      transparent: alpha.some((a) => a < 255),
    };
  } finally {
    video.removeAttribute('src');
    video.load();
  }
}

/** The longest side, in pixels, of the Lottie frames for each cell side. */
const LOTTIE_SUPERSAMPLE = 2;

/**
 * Read the frames of a Lottie animation (the parsed JSON). lottie-web loads
 * only when this function runs, thus it is not in the bundle of the site.
 */
export async function extractLottieFrames(
  animationData: unknown,
  options: ExtractOptions,
): Promise<LumaFrames> {
  const { fps, maxSide, onProgress, signal } = options;
  const data = animationData as { w?: number; h?: number; fr?: number; ip?: number; op?: number };
  const { w: lw, h: lh, fr, ip = 0, op } = data;
  if (!lw || !lh || !fr || op === undefined)
    throw new Error('the file is not a Lottie animation (no w, h, fr or op)');
  const duration = (op - ip) / fr;
  const scale = Math.min(1, maxSide / Math.max(lw, lh));
  const width = Math.max(1, Math.round(lw * scale));
  const height = Math.max(1, Math.round(lh * scale));
  const count = Math.max(1, Math.round(duration * fps));
  if (count > 0xffff) throw new Error('the animation has too many frames');

  // lottie-web draws into `big`, at a larger size. Then `canvas` makes it
  // smaller, for smooth edges.
  const big = Object.assign(document.createElement('canvas'), {
    width: width * LOTTIE_SUPERSAMPLE,
    height: height * LOTTIE_SUPERSAMPLE,
  });
  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height,
  });
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const bigCtx = big.getContext('2d');
  if (!ctx || !bigCtx) throw new Error('2D canvas is not available');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const { default: lottie } = await import('lottie-web');
  // The renderer draws into `context`. Do not give a container: with no
  // container, lottie-web takes the size of `big`. With a container that is
  // not on the page, the size is 0, and the buffers of the track mattes stay
  // at 0 after a resize.
  const anim = lottie.loadAnimation({
    renderer: 'canvas',
    loop: false,
    autoplay: false,
    animationData,
    rendererSettings: { context: bigCtx, clearCanvas: true, dpr: 1 },
  } as Parameters<typeof lottie.loadAnimation<'canvas'>>[0]);
  try {
    if (!anim.isLoaded) await once(anim as unknown as EventTarget, 'DOMLoaded', signal);
    const luma = new Uint8Array(width * height * count);
    const alpha = new Uint8Array(width * height * count);
    const last = Math.max(0, op - ip - 0.001);
    for (let i = 0; i < count; i++) {
      signal?.throwIfAborted();
      // Take the middle of each frame interval, as `extractFrames()` does.
      anim.goToAndStop(Math.min(((i + 0.5) / fps) * fr, last), true);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(big, 0, 0, width, height);
      readPixels(ctx.getImageData(0, 0, width, height).data, luma, alpha, i * width * height);
      onProgress?.(i + 1, count);
      // Let the page show the progress.
      if (i % 10 === 9) await new Promise((r) => setTimeout(r));
    }
    return {
      width,
      height,
      fps,
      count,
      luma,
      alpha,
      transparent: alpha.some((a) => a < 255),
    };
  } finally {
    anim.destroy();
  }
}
