import { type IconData, iconSvg } from '~/components/Icon/data';

/**
 * Make a CSS `url()` value from an icon, for `mask` and `background`.
 * Use it only when the markup cannot hold the icon: prefer the Icon component.
 */
export function iconDataUri(icon: IconData, color = 'black'): string {
  return `url("data:image/svg+xml,${encodeURIComponent(iconSvg(icon, color))}")`;
}
