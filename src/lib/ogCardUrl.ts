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

export function ogCardUrl(data: OgCardData, astroOrRequest: AstroGlobal | Request): string {
  const url = new URL('/og-card.png', baseUrl(astroOrRequest));
  url.searchParams.set(
    'data',
    Buffer.from(
      JSON.stringify({
        ...data,
        excerpt: data.excerpt ? truncate(data.excerpt, { length: 300 }) : undefined,
      }),
    ).toString('base64'),
  );
  return url.toString();
}
