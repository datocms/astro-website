import type { Theme } from '~/lib/theme';

/**
 * The hue of the brand colour of the cms for each theme of the site, in
 * OKLCH. A scene takes the hue of the theme of its section.
 *
 * - `default` 80: the yellow of the theme (--color-yellow-light-5, #e8d855)
 *   has the OKLCH hue 100, but at that hue the bar of the cms is a loud
 *   lime. 80 gives a warm yellow that goes with the theme.
 * - `orange` 45: the hue of the orange theme.
 * - `green` 150: the green of the theme (--color-green-light-5, #93d44b)
 *   has the OKLCH hue 130, but at that hue the bar of the cms is a loud
 *   lime. 150 gives a deep green that goes with the dark green of the
 *   inverse surface (#1a4731).
 * - `purple` 290: the purple of the home page (--color-purple-light-5,
 *   #9e90ee) has the OKLCH hue 289. It is also the default hue of the kit.
 *   (249, the HSL hue of #9e90ee, gives a blue.)
 * - `blue` 225: the hue of --color-blue-light-5 (#50c9ed) and
 *   --color-blue-deep-5 (#1a3a47).
 * - `pink` 10: the hue of --color-pink-light-5 (#f28497).
 */
export const SCENE_HUE: Record<Theme, number> = {
  default: 80,
  orange: 45,
  green: 150,
  purple: 290,
  blue: 225,
  pink: 10,
};

/**
 * The most chroma of the brand colour of the cms, in OKLCH. The cms makes
 * its signal colours (the Publish button, the focus rings, the selected
 * rows) as vivid as the gamut allows: from 0.11 at the blue hue to 0.24
 * at the purple hue. On the site the scene is a picture, not the focus:
 * at full chroma the Publish button is the most visible thing of a
 * section. The cap quiets it, the same on each theme.
 */
export const SCENE_CHROMA = 0.08;
