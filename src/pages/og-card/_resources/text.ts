import css from 'style-object-to-css-string';
import symbolSvg from '~/assets/logo/symbol.svg?raw';
import wordmarkSvg from '~/assets/logo/wordmark.svg?raw';

/**
 * A text in the markup. The escape stops a `<` of the text from opening a
 * tag. satori-html does not decode the entities, thus `decode` in the card
 * gives the characters back after the parse.
 */
export function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The ratio of the view box of the wordmark: width / height. */
const [, , viewWidth, viewHeight] = wordmarkSvg
  .match(/viewBox="([^"]+)"/)![1]!
  .split(/\s+/)
  .map(Number);
const ratio = viewWidth! / viewHeight!;

/**
 * The DatoCMS wordmark in one colour, at a width or a height. satori reads
 * the size of an image from its style, not from its attributes.
 */
export function wordmark(color: string, size: { width: number } | { height: number }): string {
  const width = 'width' in size ? size.width : Math.round(size.height * ratio);
  const height = 'height' in size ? size.height : Math.round(size.width / ratio);
  const svg = wordmarkSvg.replace(/currentColor/g, color);
  return `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="${css({ width: `${width}px`, height: `${height}px` })}" />`;
}

/** The DatoCMS symbol (the D) in one colour, at a height. */
export function symbol(color: string, height: number): string {
  const [, , w, h] = symbolSvg
    .match(/viewBox="([^"]+)"/)![1]!
    .split(/\s+/)
    .map(Number);
  const svg = symbolSvg.replace(/currentColor/g, color);
  return `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="${css({ width: `${Math.round((height * w!) / h!)}px`, height: `${height}px` })}" />`;
}

/** The size of a chip: the text and the height of the pill. */
export const CHIP = { size: 30, height: 58 };

/** A chip: a text in a pill with an outline of the colour of the border of its ground. */
export function chip(text: string, border: string): string {
  return `<div style="${css({
    display: 'flex',
    alignItems: 'center',
    height: `${CHIP.height}px`,
    padding: '0 22px',
    borderRadius: '9999px',
    border: `2px solid ${border}`,
    fontSize: `${CHIP.size}px`,
    lineHeight: 1,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  })}">${escape(text)}</div>`;
}
