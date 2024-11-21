import type { AstroGlobal } from 'astro';

export const draftModeHostname = 'astro-preview.datocms.com';
export const productionHostname = 'www2.datocms.com';

export function isDraftModeEnabled(requestOrAstro: Request | AstroGlobal) {
  const url =
    typeof requestOrAstro.url === 'string' ? new URL(requestOrAstro.url) : requestOrAstro.url;
  return url.hostname !== productionHostname;
}
