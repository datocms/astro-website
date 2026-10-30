export { default as SceneFragment } from './Component.astro';

/**
 * The usual width of a fragment scene, in px. It is wider than the box
 * (500px from 1280px, the reference width of `fit="scale"`, see
 * --fragment-reference in style.module.css), thus the box cuts the scene
 * at the right.
 */
export const FRAGMENT_WIDTH = 600;
