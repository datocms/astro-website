// Resolve the colours of a pixel style (theme tokens) to RGBA for a canvas.
// <pixel-video> and PixelImage use these functions.

import type { Rgba } from './renderer';

export const TRANSPARENT: Rgba = [0, 0, 0, 0];

// Resolve a CSS colour to opaque RGB on white, like the Overnice element:
// a see-through colour becomes the colour that it shows on white. Give
// null if the browser does not know the colour.
let swatch: CanvasRenderingContext2D | null | undefined;
export function toRgba(css: string): Rgba | null {
  swatch ??= Object.assign(document.createElement('canvas'), {
    width: 1,
    height: 1,
  }).getContext('2d', {
    willReadFrequently: true,
  });
  if (!swatch) return null;
  // An invalid colour does not change fillStyle. Try two start values to
  // find out.
  swatch.fillStyle = '#000';
  swatch.fillStyle = css;
  const a = swatch.fillStyle;
  swatch.fillStyle = '#fff';
  swatch.fillStyle = css;
  if (swatch.fillStyle !== a) return null;
  const color = swatch.fillStyle;
  swatch.fillStyle = '#fff';
  swatch.fillRect(0, 0, 1, 1);
  swatch.fillStyle = color;
  swatch.fillRect(0, 0, 1, 1);
  const px = swatch.getImageData(0, 0, 1, 1).data;
  return [px[0]! / 255, px[1]! / 255, px[2]! / 255, 1];
}

const VAR = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+?)\s*)?\)$/i;
// A token in a colour function (no fallback).
const INNER_VAR = /var\(\s*(--[\w-]+)\s*\)/gi;

/**
 * Resolve a colour of a pixel style: `var(--token)`, `var(--token, #hex)`,
 * or a colour function with tokens in it. `style` is the computed style of
 * the element that gives the token values. An unknown colour or a token
 * with no value gives a transparent colour.
 */
export function resolveColor(value: string, style: CSSStyleDeclaration | null): Rgba {
  const m = VAR.exec(value);
  // The canvas does not know the tokens: put their values in first.
  if (!m)
    return (
      toRgba(value.replace(INNER_VAR, (_, name) => style?.getPropertyValue(name).trim() ?? '')) ??
      TRANSPARENT
    );
  const token = style?.getPropertyValue(m[1]!).trim();
  return (token && toRgba(token)) || (m[2] ? toRgba(m[2]) : null) || TRANSPARENT;
}
