import type { AstroGlobal } from 'astro';

export const draftModeHostname = 'datocms-website-1226198adc87.herokuapp.com';
export const productionHostname = 'datocms-website.global.ssl.fastly.net';

export function isDraftModeEnabled(requestOrAstro: Request | AstroGlobal) {
  const url =
    typeof requestOrAstro.url === 'string' ? new URL(requestOrAstro.url) : requestOrAstro.url;
  return url.hostname !== productionHostname;
}
