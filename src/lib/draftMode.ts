import type { AstroGlobal } from 'astro';
import { PUBLIC_HOSTNAME } from 'astro:env/client';
import { DRAFT_MODE_HOSTNAME } from 'astro:env/server';

export function isDraftModeEnabled(requestOrAstro: Request | AstroGlobal) {
  const headers =
    'headers' in requestOrAstro ? requestOrAstro.headers : requestOrAstro.request.headers;

  // Header set via custom VCL snippet on Fastly
  return headers.get('x-original-host') !== PUBLIC_HOSTNAME;
}

export function baseUrl(requestOrAstro: Request | AstroGlobal) {
  // A dev server can use any port.
  if (DRAFT_MODE_HOSTNAME === 'localhost') {
    const request = 'headers' in requestOrAstro ? requestOrAstro : requestOrAstro.request;
    return new URL(request.url).origin;
  }

  const draftMode = isDraftModeEnabled(requestOrAstro);
  return `https://${draftMode ? DRAFT_MODE_HOSTNAME : PUBLIC_HOSTNAME}`;
}
