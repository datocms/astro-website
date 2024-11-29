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
  const draftMode = isDraftModeEnabled(requestOrAstro);
  return DRAFT_MODE_HOSTNAME === 'localhost'
    ? 'http://localhost:4321'
    : `https://${draftMode ? DRAFT_MODE_HOSTNAME : PUBLIC_HOSTNAME}`;
}
