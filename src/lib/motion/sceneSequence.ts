import { onVisibilityChange, prefersReducedMotion } from './inView';

/**
 * The event that a screen sends at each step of its sequence, with the name
 * of the step in `detail`. It bubbles: an element of the page around the
 * scene (for example SceneCaption) can follow the steps.
 */
export const SCENE_STEP_EVENT = 'scenestep';

/** One step of a scene sequence: its name and its time on screen in ms */
interface SceneStep {
  name: string;
  ms: number;
}

/** Reads `data-scene-steps` of a screen ("rest:1600 gap:900 …") */
function readSteps(screen: HTMLElement): SceneStep[] {
  return (screen.dataset.sceneSteps ?? '')
    .split(' ')
    .map((pair) => {
      const [name, ms] = pair.split(':');
      return { name: name ?? '', ms: Number(ms) };
    })
    .filter((step) => step.name && step.ms > 0);
}

/**
 * Plays the sequence of a product scene in a loop: sets `data-step` on the
 * screen to each step in turn (see "Sequences" in the README of
 * @datocms/product-scenes), and sends SCENE_STEP_EVENT. The loop starts when the scene comes into view
 * and pauses when it leaves. Without this script, and with reduced motion,
 * the screen has no `data-step` and shows the last step: the still picture.
 * Returns a function that stops the loop.
 */
export function playSceneSequence(screen: HTMLElement): () => void {
  const steps = readSteps(screen);
  if (steps.length < 2 || prefersReducedMotion()) return () => {};

  let index = 0;
  let timer: number | undefined;

  const show = () => {
    screen.dataset.step = steps[index]!.name;
    screen.dispatchEvent(
      new CustomEvent(SCENE_STEP_EVENT, { detail: steps[index]!.name, bubbles: true }),
    );
    timer = window.setTimeout(() => {
      index = (index + 1) % steps.length;
      show();
    }, steps[index]!.ms);
  };

  // Off screen the loop waits on its step; in view it plays that step again
  const stopObserver = onVisibilityChange(screen, (visible) => {
    window.clearTimeout(timer);
    if (visible) show();
  });

  return () => {
    stopObserver();
    window.clearTimeout(timer);
    delete screen.dataset.step;
  };
}

/**
 * Sets `data-paused` on a screen when it is not in view: the animations of
 * the kit that loop, for example the caret of a text field, stop (see the
 * README of @datocms/product-scenes). Returns a function that stops it.
 */
export function pauseSceneOffScreen(screen: HTMLElement): () => void {
  return onVisibilityChange(screen, (visible) => {
    if (visible) delete screen.dataset.paused;
    else screen.dataset.paused = '';
  });
}

/**
 * Plays the sequence of every product scene in `root` that has one, and
 * pauses the loops of every screen off screen
 */
export function initSceneSequences(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.ProductScenesScreen').forEach((screen) => {
    pauseSceneOffScreen(screen);
  });
  root.querySelectorAll<HTMLElement>('[data-scene-steps]').forEach((screen) => {
    playSceneSequence(screen);
  });
}
