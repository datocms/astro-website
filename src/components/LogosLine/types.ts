export interface LogoItem {
  alt: string;
  width: number;
  height: number;
  src?: string;
  /**
   * SVG markup with fill="currentColor". It takes the text colour of the
   * theme. Use it in place of `src` for single-colour logos.
   */
  svg?: string;
  /**
   * An image file of a single-colour logo, such as a logo from the CMS.
   * The logo shows as a CSS mask in the text colour of the theme, as
   * `svg` does. Use it in place of `src`. (Not in the prototype.)
   */
  mask?: string;
}
