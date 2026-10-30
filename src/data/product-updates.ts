/*
 * Product updates: the index (/product-updates, /product-updates/p/[n]) and
 * the page of one entry (/product-updates/[slug]). The entries
 * come from the changelog in DatoCMS, project "DatoCMS Website" (id 205):
 * this file has only the copy around them. The home shows the latest
 * entries in ProductUpdates (home.productUpdates).
 */

import type { HeroData } from '~/data/home';

export const hero: HeroData = {
  label: 'Product updates',
  headline: 'What’s new?',
  subheadline: 'Everything we ship, as soon as we ship it.',
};

/** The link from the page of one entry back to the index. */
export const back = { label: 'All product updates', href: '/product-updates' };

/** The number of entries on each page of the index. The rows have no content, thus a page holds many. */
export const perPage = 20;
