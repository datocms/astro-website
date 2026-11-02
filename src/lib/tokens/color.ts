/*
 * Colour math for the token tests: sRGB, OKLab and OKLCH conversions, alpha
 * compositing and the WCAG 2 contrast ratio. The browser does the same
 * operations when it resolves `color-mix()` and `oklch(from …)`.
 */

/** A colour in sRGB. The channels are 0 to 1 and can be out of gamut. */
export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Oklab {
  l: number;
  a: number;
  b: number;
  alpha: number;
}

export interface Oklch {
  l: number;
  c: number;
  /** Degrees. NaN when the hue is missing (an achromatic colour). */
  h: number;
  alpha: number;
}

export const TRANSPARENT: Rgba = { r: 0, g: 0, b: 0, a: 0 };

export function parseHex(hex: string): Rgba {
  const digits = hex.replace(/^#/, '');
  const expanded =
    digits.length === 3 || digits.length === 4
      ? digits
          .split('')
          .map((d) => d + d)
          .join('')
      : digits;
  if (expanded.length !== 6 && expanded.length !== 8) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  const channel = (i: number) => parseInt(expanded.slice(i, i + 2), 16) / 255;
  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: expanded.length === 8 ? channel(6) : 1,
  };
}

function toLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function toGamma(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
}

export function rgbaToOklab({ r, g, b, a }: Rgba): Oklab {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    alpha: a,
  };
}

export function oklabToRgba({ l, a, b, alpha }: Oklab): Rgba {
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    r: toGamma(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: toGamma(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: toGamma(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
    a: alpha,
  };
}

export function oklabToOklch({ l, a, b, alpha }: Oklab): Oklch {
  const c = Math.hypot(a, b);
  // A chroma near zero has no hue. The browser also treats it as missing.
  const h = c < 1e-5 ? NaN : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { l, c, h, alpha };
}

export function oklchToOklab({ l, c, h, alpha }: Oklch): Oklab {
  const rad = (Number.isNaN(h) ? 0 : h) * (Math.PI / 180);
  return { l, a: c * Math.cos(rad), b: c * Math.sin(rad), alpha };
}

export function rgbaToOklch(rgba: Rgba): Oklch {
  return oklabToOklch(rgbaToOklab(rgba));
}

export function oklchToRgba(oklch: Oklch): Rgba {
  return oklabToRgba(oklchToOklab(oklch));
}

/** True when each channel is in the sRGB gamut (with a small tolerance). */
export function inGamut({ r, g, b }: Rgba): boolean {
  const ok = (c: number) => c >= -0.0005 && c <= 1.0005;
  return ok(r) && ok(g) && ok(b);
}

/** Limit each channel to 0 to 1, as the browser does before it paints. */
export function clip({ r, g, b, a }: Rgba): Rgba {
  const c = (x: number) => Math.min(1, Math.max(0, x));
  return { r: c(r), g: c(g), b: c(b), a: c(a) };
}

/** Paint `top` over `bottom` (source-over). The result is opaque when `bottom` is. */
export function composite(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a + bottom.a * (1 - top.a);
  if (a === 0) return TRANSPARENT;
  const mix = (t: number, b: number) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
}

/** The relative luminance of WCAG 2 (the colour must be opaque). */
export function luminance({ r, g, b }: Rgba): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** The WCAG 2 contrast ratio of two opaque colours, from 1 to 21. */
export function contrast(fg: Rgba, bg: Rgba): number {
  const l1 = luminance(clip(fg));
  const l2 = luminance(clip(bg));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function toHex({ r, g, b, a }: Rgba): string {
  const c = clip({ r, g, b, a });
  const hex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${hex(c.r)}${hex(c.g)}${hex(c.b)}${c.a < 1 ? hex(c.a) : ''}`;
}

export type MixSpace = 'srgb' | 'oklab' | 'oklch';

/**
 * `color-mix(in <space>, a <pa>%, b <pb>%)` of CSS Color 5. The channels are
 * premultiplied by alpha, thus a mix with `transparent` keeps the colour of
 * the other input. A missing hue takes the hue of the other colour.
 */
export function colorMix(space: MixSpace, a: Rgba, pa: number, b: Rgba, pb: number): Rgba {
  // Normalise the percentages. A sum under 100 scales the alpha.
  const sum = pa + pb;
  const alphaMultiplier = sum < 100 ? sum / 100 : 1;
  const wa = pa / sum;
  const wb = pb / sum;

  if (space === 'srgb') {
    const alpha = a.a * wa + b.a * wb;
    const mix = (ca: number, cb: number) =>
      alpha === 0 ? 0 : (ca * a.a * wa + cb * b.a * wb) / alpha;
    return { r: mix(a.r, b.r), g: mix(a.g, b.g), b: mix(a.b, b.b), a: alpha * alphaMultiplier };
  }

  if (space === 'oklab') {
    const la = rgbaToOklab(a);
    const lb = rgbaToOklab(b);
    const alpha = la.alpha * wa + lb.alpha * wb;
    const mix = (ca: number, cb: number) =>
      alpha === 0 ? 0 : (ca * la.alpha * wa + cb * lb.alpha * wb) / alpha;
    return oklabToRgba({
      l: mix(la.l, lb.l),
      a: mix(la.a, lb.a),
      b: mix(la.b, lb.b),
      alpha: alpha * alphaMultiplier,
    });
  }

  const ca = rgbaToOklch(a);
  const cb = rgbaToOklch(b);
  // A transparent input has no hue: take the hue of the other input.
  if (ca.alpha === 0 || Number.isNaN(ca.h)) ca.h = cb.h;
  if (cb.alpha === 0 || Number.isNaN(cb.h)) cb.h = ca.h;
  const alpha = ca.alpha * wa + cb.alpha * wb;
  const mix = (x: number, y: number) =>
    alpha === 0 ? 0 : (x * ca.alpha * wa + y * cb.alpha * wb) / alpha;
  let h: number;
  if (Number.isNaN(ca.h) && Number.isNaN(cb.h)) {
    h = NaN;
  } else {
    // The shorter arc between the two hues (the default of CSS).
    let ha = ca.h;
    let hb = cb.h;
    if (hb - ha > 180) ha += 360;
    else if (ha - hb > 180) hb += 360;
    h = (ha * wa + hb * wb + 360) % 360;
  }
  return oklchToRgba({ l: mix(ca.l, cb.l), c: mix(ca.c, cb.c), h, alpha: alpha * alphaMultiplier });
}
