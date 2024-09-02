import type { AstroGlobal } from 'astro';

export const draftModeHostname = 'datocms-website-1226198adc87.herokuapp.com';
export const productionHostname = 'datocms-website.global.ssl.fastly.net';

export function isDraftModeEnabled(Astro: AstroGlobal) {
  console.log(Astro.url.hostname);
  return Astro.url.hostname === draftModeHostname;
}
