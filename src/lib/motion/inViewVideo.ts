import { onVisibilityChange, prefersReducedMotion } from './inView';

/**
 * Plays a muted looping video only while it is in the viewport.
 * With reduced motion, the video does not play and shows its first frame.
 */
export function setupInViewVideo(video: HTMLVideoElement): () => void {
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  if (prefersReducedMotion()) {
    video.pause();
    return () => {};
  }

  return onVisibilityChange(video, (visible) => {
    if (visible) {
      // The browser can refuse autoplay. Then the poster stays visible.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}
