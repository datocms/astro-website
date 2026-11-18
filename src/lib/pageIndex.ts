import type { AstroGlobal } from 'astro';
import { notFoundResponse } from './notFoundResponse';

/**
 * Read the page number of a paged index (`<baseUrl>/p/<n>`). Page 1 is at
 * the address of the index, thus `/p/1` gives 'redirect'. The old site
 * numbered its pages from 0, thus `/p/0` (also `/p/00`) gives 'redirect' too.
 * Other values that are not a page number give null.
 */
export function parsePageIndex(param: string | undefined): number | 'redirect' | null {
  if (!param) return null;
  if (/^0+$/.test(param)) return 'redirect';
  if (!/^[1-9]\d*$/.test(param)) return null;
  const page = Number.parseInt(param, 10);
  return page === 1 ? 'redirect' : page;
}

/**
 * The 301 to page 1 of an index. It keeps the query string: on some indexes
 * it holds the search and the filters.
 */
export function redirectToFirstPage(Astro: AstroGlobal, baseUrl: string) {
  return Astro.redirect(`${baseUrl}${Astro.url.search}`, 301);
}

/**
 * The page number of a request to `<baseUrl>/p/[pageIndex]`, or the response
 * to send: a 301 to page 1 for `/p/1` and `/p/0`, else 404 for a value that
 * is not a page number. A page past the last one is for the caller to find:
 * it sends `redirectToFirstPage`.
 */
export function readPageIndex(Astro: AstroGlobal, baseUrl: string): number | Response {
  const page = parsePageIndex(Astro.params.pageIndex);
  if (page === 'redirect') return redirectToFirstPage(Astro, baseUrl);
  return page ?? notFoundResponse();
}
