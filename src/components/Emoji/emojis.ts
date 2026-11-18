import astro from '~/assets/frameworks/astro.svg?raw';
import nextjs from '~/assets/frameworks/nextjs.svg?raw';
import nuxt from '~/assets/frameworks/nuxt.svg?raw';
import sveltekit from '~/assets/frameworks/sveltekit.svg?raw';

/**
 * The marks of the frameworks, in their brand colours. The black of Next.js
 * and of the A of Astro is the colour of the text, thus they show in dark too.
 */
export const logos = { astro, nextjs, nuxt, sveltekit };

/**
 * The emojis that show as a pixel drawing of PixelEmoji, the same drawings
 * as the features of /features.
 */
export const pixelEmojis = { heart: '💚', sparkle: '✨' };

export type EmojiName = keyof typeof pixelEmojis | keyof typeof logos;

/**
 * What a crawler and a screen reader read in place of the emoji. An emoji
 * without a text only decorates: the words around it say everything.
 */
export const emojiTexts: Partial<Record<EmojiName, string>> = {
  heart: 'love',
};

export function isEmojiName(name: string): name is EmojiName {
  return name in pixelEmojis || name in logos;
}
