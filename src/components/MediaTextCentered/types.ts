import type { Theme } from '~/lib/theme';

export interface MediaTextCenteredData {
  /** The width and height attributes set the ratio. The section sets the width. */
  image: { src: string; alt: string; width: number; height: number };
  headline: string;
  /** Style `two-tone`: the muted run after the headline, on the same line. */
  muted?: string;
  /** Style `headline-subline`: the body text below the headline. */
  subline?: string;
  /** Without a theme, the section inherits the theme of its parent. */
  theme?: Theme;
}
