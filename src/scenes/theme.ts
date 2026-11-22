import { brandColorOfHue } from '@datocms/product-scenes';
import type { Theme } from '~/lib/theme';

/**
 * The hue of the brand colour of the cms for each theme of the site, in
 * OKLCH. A scene takes the hue of the theme of its section.
 *
 * - `yellow` 80: the yellow of the theme (--color-yellow-light-5, #e8d855)
 *   has the OKLCH hue 100, but at that hue the bar of the cms is a loud
 *   lime. 80 gives a warm yellow that goes with the theme.
 * - `orange` 45: the hue of the orange theme.
 * - `green` 150: the green of the theme (--theme-accent, #93d44b)
 *   has the OKLCH hue 130, but at that hue the bar of the cms is a loud
 *   lime. 150 gives a deep green that goes with the dark green of the
 *   inverse surface (#1a4731).
 * - `purple` 295: the hue of the purple of the home page
 *   (--color-purple-light-5, #9d75f7). (The HSL hue of #9d75f7 is 258,
 *   and it gives a blue.)
 * - `blue` 225: the hue of the accent (#50c9ed) and of the deep (#1a3a47)
 *   of the blue theme.
 * - `pink` 10: the hue of the accent of the pink theme (#f28497).
 * - `docs` 295: the hue of --color-purple-light-5 (#9d75f7).
 */
export const SCENE_HUE: Record<Theme, number> = {
  yellow: 80,
  orange: 45,
  green: 150,
  purple: 295,
  blue: 225,
  pink: 10,
  docs: 295,
};

/**
 * The most chroma of the brand colour of the cms, in OKLCH. In the cms a
 * brand colour is often vivid: the Publish button, the focus rings and the
 * selected rows show it. On the site the scene is a picture, not the focus,
 * and its buttons are not real buttons: the page around the scene has the
 * vivid colours. The kit caps the chroma of the colour of the hue first,
 * then takes the nearest colour that passes AA (`brandColorOfHue`), as the
 * cms asks of a project. The cap is the same on each theme.
 */
export const SCENE_CHROMA = 0.08;

/**
 * The lightness of the navigation bar of the cms in the light scheme, from
 * 0 to 1, as in the theme of a project (`navbarLightness` of the kit). The
 * default bar (0.5) has the OKLCH lightness 0.42. The inverse surface of
 * green (#1a4731, 0.36) and of blue (#1a3a47, 0.33) is near it: next to it,
 * at the right of a chapter split, the bar and the ground looked the same.
 * At 0.2 the bar has the lightness 0.24 and is darker than the ground, as
 * on the other themes the ground is darker than the bar. The dark scheme
 * keeps the default bar.
 */
export const SCENE_NAVBAR_LIGHTNESS: Partial<Record<Theme, number>> = {
  green: 0.2,
  blue: 0.2,
};

/** The brand colour of the cms in a scene of a theme. */
export function sceneBrandColor(theme: Theme, chroma = SCENE_CHROMA) {
  return brandColorOfHue(SCENE_HUE[theme], { maxChroma: chroma });
}
