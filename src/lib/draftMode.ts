import type { AstroGlobal } from 'astro';

export const draftModeHostname = 'astro-preview.datocms.com';
export const productionHostname = 'www2.datocms.com';

export function isDraftModeEnabled(requestOrAstro: Request | AstroGlobal) {
  const url =
    typeof requestOrAstro.url === 'string' ? new URL(requestOrAstro.url) : requestOrAstro.url;

  console.log(
    url,
    url.hostname,
    Object.fromEntries(
      'headers' in requestOrAstro ? requestOrAstro.headers : requestOrAstro.request.headers,
    ),
  );

  return url.hostname !== productionHostname;
}
