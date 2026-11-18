import drawings from './drawings.json';

/**
 * Gets the pixel drawing of an emoji, as the paths of an SVG with 10 by 10
 * cells. An emoji without a drawing gives undefined.
 */
export function pixelEmojiDrawing(emoji: string): string | undefined {
  // The key has the code points of the emoji, without the variation selector.
  const key = [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter((codePoint) => codePoint !== 'fe0f')
    .join('-');
  return (drawings as Record<string, string>)[key];
}
