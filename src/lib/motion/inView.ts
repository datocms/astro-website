export interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** When true, the callback runs one time and then the observer stops. */
  once?: boolean;
}

/**
 * Calls `callback` when `el` enters the viewport.
 * Returns a function that stops the observer.
 */
export function onEnterViewport(
  el: Element,
  callback: () => void,
  { threshold = 0, rootMargin = '0px', once = true }: InViewOptions = {},
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callback();
        if (once) observer.disconnect();
      }
    },
    { threshold, rootMargin },
  );
  observer.observe(el);
  return () => observer.disconnect();
}

/**
 * Calls `callback(true)` when `el` enters the viewport and
 * `callback(false)` when it leaves. Use it to pause and resume loops.
 * Returns a function that stops the observer.
 */
export function onVisibilityChange(
  el: Element,
  callback: (visible: boolean) => void,
  { threshold = 0, rootMargin = '0px' }: Omit<InViewOptions, 'once'> = {},
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) callback(entry.isIntersecting);
    },
    { threshold, rootMargin },
  );
  observer.observe(el);
  return () => observer.disconnect();
}

/** True when the user asks for reduced motion: the page shows the final state. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
