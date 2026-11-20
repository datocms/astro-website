import { stripStega } from '@datocms/astro';
import type { AstroGlobal } from 'astro';
import { truncate } from 'lodash-es';
import { baseUrl } from './draftMode';
import type { Theme } from './theme';

export type OgCardData = {
  kicker?: string | null;
  title?: string | null;
  pills?: string[] | null;
  excerpt?: string | null;
  logoPngUrl?: string | null;
  /**
   * The logo of a technology of the page (an SVG, as `logo.url` of an
   * integration): it takes the place of the chips, in the colour of the title.
   */
  techLogoUrl?: string | null;
  /** The theme of the page: the hue of its area (DESIGN.md, "Page themes"). */
  theme?: Theme | null;
  /**
   * The proof half of the card. With a logo, a `stat` goes on the left,
   * under the title, and the logo has the half. Without a picture and a
   * logo, the title has the full width of the card.
   */
  picture?: OgPicture | null;
  /**
   * The bottom row shows the full wordmark next to the kicker, not the
   * symbol: for a page whose kicker does not say that it is of DatoCMS
   * (a plugin, a starter, a lesson of the academy).
   */
  wordmark?: boolean | null;
};

/**
 * The proof half of the card, from the content of the page:
 * - `window`: a screenshot in an app window, cut by the edges of the card.
 * - `video`: a video: the play button and its length.
 * - `product`: a window of the product, as the home Features show it
 *   ("Meet the product"), in the theme of the card. For a page with a hero.
 * - `cover`: the cover of a plugin, at the top of the half, with a
 *   band below it: a number of the plugin (its installs) or its author,
 *   and its version as a chip. An official plugin gives the pill
 *   `Official`: it is a chip of the claim half.
 * - `stat`: one real number of the page, with its label.
 * - `date`: the date of the entry.
 * - `versus`: the DatoCMS wordmark against the name of the other product.
 * - `contents`: the table of contents of a docs page, as a numbered list.
 * - `pixel`: the pixel cover of a blog post (its file of 100 × 58 cells).
 * - `portraits`: the portraits of the guests of a casual chat, in speech bubbles.
 */
/** The screens of the product that a card can show (`og-card/_resources/scenes/`). */
export type OgProductScene = 'editor' | 'schema' | 'media';

export type OgPicture =
  | {
      kind: 'window';
      imageUrl: string;
      /** The window has half of the card: the screenshot is the subject of the page. */
      half?: boolean;
    }
  | { kind: 'video'; duration?: string }
  | { kind: 'product'; scene: OgProductScene }
  | {
      kind: 'cover';
      imageUrl: string;
      /** A number of the plugin (its installs). Without it, the band shows the author. */
      stat?: { value: string; label: string };
      author?: string;
      version?: string;
    }
  | { kind: 'stat'; value: string; label: string }
  | { kind: 'date'; iso: string }
  | { kind: 'versus'; other: string }
  | { kind: 'contents'; entries: string[] }
  | { kind: 'pixel'; imageUrl: string }
  | { kind: 'portraits'; imageUrls: string[] };

export function ogCardUrl(
  { kicker, title, pills, excerpt, logoPngUrl, techLogoUrl, theme, picture, wordmark }: OgCardData,
  astroOrRequest: AstroGlobal | Request,
): string {
  const url = new URL('/og-card/index.png', baseUrl(astroOrRequest));
  url.searchParams.set(
    'data',
    Buffer.from(
      JSON.stringify({
        kicker: kicker ? stripStega(kicker) : undefined,
        title: title ? stripStega(title) : undefined,
        pills: pills ? pills.map((p) => stripStega(p)) : undefined,
        logoPngUrl: logoPngUrl ? stripStega(logoPngUrl) : undefined,
        techLogoUrl: techLogoUrl ? stripStega(techLogoUrl) : undefined,
        excerpt: excerpt ? truncate(stripStega(excerpt), { length: 300 }) : undefined,
        theme: theme ?? undefined,
        // The strings of a picture come from the CMS too (a number, a name).
        picture: picture
          ? (JSON.parse(stripStega(JSON.stringify(picture))) as OgPicture)
          : undefined,
        wordmark: wordmark ?? undefined,
      }),
    ).toString('base64'),
  );
  return url.toString();
}
