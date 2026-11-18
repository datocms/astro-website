import type { Theme } from '~/lib/theme';
import { SCENE_HUE } from '../theme';

/**
 * The logo of Northwind (the white-label scenes of the enterprise page):
 * a white tile with the letter N and a wave, and the word "Northwind" in
 * white. The N and the wave take the hue of the theme of the scene
 * (SCENE_HUE), thus the logo goes with the bar of the cms on each theme.
 * The lightness and the chroma are fixed: the N is dark on the white tile,
 * the wave is lighter. The kit shows the logo in an `<img>`, thus the
 * colours are in the SVG and not in the CSS.
 */
export function northwindLogoUrl(theme: Theme): string {
  const hue = SCENE_HUE[theme];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 28" width="132" height="28">
  <rect width="28" height="28" rx="7" fill="#fff"/>
  <path d="M8.5 20V8l11 12V8" fill="none" stroke="oklch(0.482 0.088 ${hue})" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 23.5c4-1.6 7.5-1.6 11 0s7 1.6 7 0" fill="none" stroke="oklch(0.687 0.125 ${hue})" stroke-width="1.6" stroke-linecap="round"/>
  <text x="36" y="19.5" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="15" font-weight="700" letter-spacing="0.2" fill="#fff">Northwind</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
