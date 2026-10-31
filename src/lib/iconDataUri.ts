import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * Make a CSS `url()` value from a Font Awesome icon, for `mask` and `background`.
 * Use it only when the markup cannot hold the icon: prefer the Icon component.
 */
export function iconDataUri(icon: IconDefinition, fill = 'black'): string {
  const [width, height, , , pathData] = icon.icon;
  const paths = (Array.isArray(pathData) ? pathData : [pathData])
    .map((d) => `<path d="${d}"/>`)
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="${fill}">` +
    `${paths}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
