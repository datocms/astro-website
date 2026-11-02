/*
 * The rules of the hero h1 (DESIGN.md, "The Text Face Rule" and "The Hero
 * Length Rule"). The Hero component warns on the dev server, and
 * src/lib/hero.test.ts checks the copy of src/data and src/pages.
 */
import { faces, type FaceName } from '~/lib/motion/faces';

/**
 * The maximum length of the h1: the headline, the muted run and the face.
 * At 120 characters the h1 has 3 lines on a desktop and 6 lines on a phone,
 * and the typewriter ends in approximately 2.5 s.
 */
export const HERO_MAX_CHARS = 120;

/** The characters of Content Link (stega). They do not show. */
const STEGA = /[​-‍⁠-⁤﻿]/g;

/** The length of the h1 as the visitor sees it, with a space between the runs. */
export function heroLength(h1: {
  headline: string;
  subheadline?: string;
  face?: FaceName;
}): number {
  const face = h1.face && faces[h1.face].face;
  return [h1.headline, h1.subheadline, face].filter(Boolean).join(' ').replace(STEGA, '').length;
}

/**
 * A face follows an aside: the headline is a full sentence, and the muted
 * run adds to it ("Got issues? We're here to help! [••]"). A title in two
 * tones ("Projects from Our / Partners") has no face.
 */
export function faceFollowsSentence(headline: string): boolean {
  return /[.?!…]["”’)]?$/.test(headline.replace(STEGA, '').trim());
}
