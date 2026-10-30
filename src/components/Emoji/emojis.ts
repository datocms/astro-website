import astro from '~/assets/frameworks/astro.svg?raw';
import nextjs from '~/assets/frameworks/nextjs.svg?raw';
import nuxt from '~/assets/frameworks/nuxt.svg?raw';
import sveltekit from '~/assets/frameworks/sveltekit.svg?raw';
import { drawings, type DrawingName } from './drawings';

/**
 * The marks of the frameworks, in their brand colours. The black of Next.js
 * and of the A of Astro is the colour of the text, thus they show in dark too.
 */
export const logos = { nextjs, nuxt, sveltekit, astro };

export type EmojiName = DrawingName | 'bleep' | keyof typeof logos;

/**
 * What a crawler and a screen reader read in place of the emoji. An emoji
 * without a text only decorates: the words around it say everything.
 */
export const emojiTexts: Partial<Record<EmojiName, string>> = {
  heart: 'love',
  bleep: '*',
};

export function isEmojiName(name: string): name is EmojiName {
  return name === 'bleep' || name in drawings || name in logos;
}
