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
  /** The theme of the page: the hue of its area (DESIGN.md, "Page themes"). */
  theme?: Theme | null;
};

export function ogCardUrl(
  { kicker, title, pills, excerpt, logoPngUrl, theme }: OgCardData,
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
        excerpt: excerpt ? truncate(stripStega(excerpt), { length: 300 }) : undefined,
        theme: theme ?? undefined,
      }),
    ).toString('base64'),
  );
  return url.toString();
}
