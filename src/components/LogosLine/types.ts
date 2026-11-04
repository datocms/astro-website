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
   * `svg` does. Use it in place of `src`.
   */
  mask?: string;
  /** The page of the client, such as its case study. The logo is then a link. */
  href?: string;
  /** A short result of the client, such as "92.5% less code". It shows in a tooltip on the link. */
  description?: string;
}
