import type { IconNode } from 'lucide';
import type { SimpleIcon } from 'simple-icons';

/**
 * An icon: a Lucide icon (import it from `lucide`) or a brand mark (import it
 * from `simple-icons`). Lucide icons are lines, brand marks are filled shapes.
 */
export type IconData = IconNode | SimpleIcon;

/** The width of the lines of all the Lucide icons on the site. */
export const STROKE_WIDTH = 1.75;

export type IconElement = { tag: string; attrs: Record<string, string | number> };

/** The attributes of the `<svg>` element and its children, for each type of icon. */
export function iconParts(icon: IconData): {
  svgAttrs: Record<string, string | number>;
  children: IconElement[];
} {
  if (Array.isArray(icon)) {
    return {
      svgAttrs: {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': STROKE_WIDTH,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      // Each element has its own fill: a CSS fill on the <svg> (for filled icons)
      // must not fill the lines.
      children: icon.map(([tag, attrs]) => ({
        tag,
        attrs: {
          ...Object.fromEntries(
            Object.entries(attrs).filter(
              (entry): entry is [string, string | number] => entry[1] !== undefined,
            ),
          ),
          fill: 'none',
        },
      })),
    };
  }

  return {
    svgAttrs: { viewBox: '0 0 24 24', fill: 'currentColor' },
    children: [{ tag: 'path', attrs: { d: icon.path } }],
  };
}

/** The SVG markup of an icon, as a string. */
export function iconSvg(icon: IconData, color = 'black'): string {
  const { svgAttrs, children } = iconParts(icon);
  const attrs = { xmlns: 'http://www.w3.org/2000/svg', ...svgAttrs };
  // The color replaces currentColor: a data URI does not inherit a color.
  const toString = (entries: Record<string, string | number>) =>
    Object.entries(entries)
      .map(([key, value]) => `${key}="${value === 'currentColor' ? color : value}"`)
      .join(' ');
  const inner = children.map(({ tag, attrs }) => `<${tag} ${toString(attrs)}/>`).join('');
  return `<svg ${toString(attrs)}>${inner}</svg>`;
}
