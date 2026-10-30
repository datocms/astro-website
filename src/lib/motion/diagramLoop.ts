/*
 * The loop of a diagram (the frames of src/scenes/ that use
 * src/scenes/diagram/style.module.css). A diagram plays one event, holds
 * its still, and plays the next, in view only. With reduced motion nothing
 * plays: the markup is the still.
 */
import { onVisibilityChange, prefersReducedMotion } from './inView';

/**
 * The durations of the grammar, in ms. The custom properties of the root
 * class of src/scenes/diagram/style.module.css have the same values: a
 * step of a script waits for the CSS transition of that step.
 */
export const DIAGRAM_MS = {
  pop: 360,
  fade: 320,
  enter: 420,
  travel: 1000,
  draw: 600,
  ping: 720,
  stagger: 60,
  /** The ring of a new item fades in this time */
  settle: 1000,
  /** The swap of a thing for the next one (`swap`, or the two attributes on a stack) */
  swap: 800,
  /** The minimum time that a diagram holds its still before the next event */
  hold: 1500,
} as const;

export const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** A random number between `min` and `max` */
export const between = (min: number, max: number) => min + Math.random() * (max - min);

/** The time `minutes` after `time`, both as HH:MM: the time of the next event on a pill */
export const later = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number) as [number, number];
  const total = (h * 60 + m + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/**
 * Reads the layout: the browser applies the styles set before it. Use
 * getBoundingClientRect, not offsetWidth: an SVG element has no
 * offsetWidth, and then the browser applies no style.
 */
export const reflow = (el: Element) => void el.getBoundingClientRect();

/**
 * Removes the data attribute `name` of `el` and sets it again: the CSS
 * animation of that attribute (a pulse, a ping) starts again.
 */
export function replay(el: HTMLElement | SVGElement, name: string): void {
  delete el.dataset[name];
  reflow(el);
  el.dataset[name] = '';
}

/**
 * Puts `el` in the arrival state of the grammar (`data-enter`: clear and a
 * little small, with no transition), then removes it: `el` comes in with
 * the transition of its class.
 */
export function arrive(el: HTMLElement): void {
  delete el.dataset.leave;
  el.dataset.enter = '';
  reflow(el);
  delete el.dataset.enter;
}

/**
 * The swap of an event pill: the new event takes the place of the old
 * one. A copy of `pill` stays where it is and goes out (`data-swap-out`:
 * it fades and moves by --diagram-swap); `update` changes the content of
 * `pill`, which comes in from the other side (`data-swap-in`). The copy
 * is absolute, at the offset of `pill`: the parent of `pill` must be its
 * offset parent (a positioned box). The copy goes after the move.
 */
export function swap(pill: HTMLElement, update: () => void): void {
  const old = pill.cloneNode(true) as HTMLElement;
  for (const el of [old, ...old.querySelectorAll<HTMLElement>('*')]) {
    for (const name of Object.keys(el.dataset)) delete el.dataset[name];
  }
  old.setAttribute('aria-hidden', 'true');
  Object.assign(old.style, {
    position: 'absolute',
    left: `${pill.offsetLeft}px`,
    top: `${pill.offsetTop}px`,
    margin: '0',
  });
  pill.after(old);
  update();
  pill.dataset.swapIn = '';
  reflow(pill);
  delete pill.dataset.swapIn;
  old.dataset.swapOut = '';
  window.setTimeout(() => old.remove(), DIAGRAM_MS.swap);
}

/** The function that tells if the session of a loop is still the current one */
export type Live = () => boolean;

export interface DiagramLoopOptions {
  /**
   * Runs one time at the start of each session, before the first event.
   * Use it to clean up a session that stopped in the middle of an event.
   */
  start?: (live: Live) => Promise<void> | void;
}

/**
 * Plays `event` again and again while `root` is in view, after `start`.
 * Each time `root` comes into view, a new session starts; when `root`
 * goes out of view, the session stops at the next `live()` check, where it
 * is. `event` must check `live()` after each wait and return when it is
 * false. While a session plays, `root` has `data-playing`.
 * With reduced motion the function does nothing.
 */
export function startDiagramLoop(
  root: HTMLElement,
  event: (live: Live) => Promise<void>,
  { start }: DiagramLoopOptions = {},
): void {
  if (prefersReducedMotion()) return;
  let session = 0;

  onVisibilityChange(root, (visible) => {
    const current = ++session;
    if (!visible) {
      delete root.dataset.playing;
      return;
    }
    root.dataset.playing = '';
    const live: Live = () => current === session;
    void (async () => {
      await start?.(live);
      while (live()) await event(live);
    })();
  });
}
