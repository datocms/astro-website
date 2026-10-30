/*
 * The fake data of the wall of pages of the Delivery chapter (Wall.astro):
 * the pages, the events that reach it, and the still picture. The wall
 * shows the claim of the headline, not the mechanism: the code of the
 * fragments (src/data/developers-code.ts) has the header, the webhook and
 * the CDN side.
 */

/**
 * The pages of the wall at the start. The grid has room for 32 from 768px
 * (8 × 4) and shows 11 on phones (4 × 3, the last row not full). An
 * event never leaves fewer than TILE_MIN pages, thus the wall keeps its 4
 * rows. New pages come in on their own loop, up to TILE_MAX: the last
 * row is never full.
 */
export const TILE_COUNT = 28;
export const TILE_MIN = 26;
export const TILE_MAX = 31;

export const GROUP = 'Your website CDN';

/**
 * The pages an event touches: between these two counts, at random, in
 * any row (a curve to a lower row goes over the pages above it). On
 * phones always TOUCH_MIN: the wall is small.
 */
export const TOUCH_MIN = 2;
export const TOUCH_MAX = 3;

/**
 * The events, on the pill above the wall, each with its time (as the pill
 * of the Real-time frame). Generic on purpose: the wall
 * tells that a change purges a few pages, not which change.
 */
export const EVENTS = [
  'Record published',
  'Record updated',
  'Asset replaced',
  'Record deleted',
  'Translation published',
] as const;

/**
 * The still picture (no JS, reduced motion, and the first frame): one
 * event on the pill, its two curves drawn, and the pages it touches with
 * the ring of the accent. With JS the loop starts from it: those pages
 * are purged first. The pages are in the first row, the third and the
 * sixth of 8 from 768px, the second and the third of 4 on phones
 * (style.module.css puts them there): the curves of the still are in the
 * markup, thus they need a place that the CSS knows.
 */
export const STILL = {
  event: EVENTS[0],
  /** The time of the event, on the pill. The loop goes on from it, one to four minutes for each event. */
  time: '09:12',
  touched: [2, 5],
};

/** The number of looks of a tile (the widths of its bars), in style.module.css */
export const VARIANTS = 6;

export const DESCRIPTION =
  'The pages of a website, cached in its CDN. Changes arrive one after the other: each purges only the few pages that used it, the other pages close the gap, and new pages join the wall as visitors ask for them.';
