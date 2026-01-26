import { stripStega } from '@datocms/astro';
import type { AstroGlobal } from 'astro';
import { truncate } from 'lodash-es';
import { baseUrl } from './draftMode';

export type OgCardData = {
  kicker?: string | null;
  title?: string | null;
  pills?: string[] | null;
  excerpt?: string | null;
  logoPngUrl?: string | null;
};

export function ogCardUrl(
  { kicker, title, pills, excerpt, logoPngUrl }: OgCardData,
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
        excerpt: excerpt ? truncate(excerpt, { length: 300 }) : undefined,
      }),
    ).toString('base64'),
  );
  return url.toString();
}
