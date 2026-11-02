/*
 * The rules of the hero h1 (DESIGN.md, "Heroes"). The Hero component warns
 * on the dev server, and src/data/heroes.test.ts checks the copy of src/data.
 */

/**
 * The maximum length of the h1: the headline, the muted run and the face.
 * At 120 characters the h1 has 3 lines on a desktop and 6 lines on a phone,
 * and the typewriter ends in approximately 2.5 s.
 */
export const HERO_MAX_CHARS = 120;

/** The characters of Content Link (stega). They do not show. */
const STEGA = /[​-‍⁠-⁤﻿]/g;

/** The length of the h1 as the visitor sees it, with a space between the runs. */
export function heroLength(h1: { headline: string; subheadline?: string; face?: string }): number {
  return [h1.headline, h1.subheadline, h1.face].filter(Boolean).join(' ').replace(STEGA, '').length;
}
