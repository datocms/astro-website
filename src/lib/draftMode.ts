import type { AstroGlobal } from 'astro';
import { PUBLIC_HOSTNAME } from 'astro:env/client';
import { DRAFT_MODE_HOSTNAME } from 'astro:env/server';

export function isDraftModeEnabled(requestOrAstro: Request | AstroGlobal) {
  const request = 'headers' in requestOrAstro ? requestOrAstro : requestOrAstro.request;

  // The Worker gets the host that the visitor asked for. Each host that is not
  // the public host shows the drafts.
  return new URL(request.url).host !== PUBLIC_HOSTNAME;
}

export function baseUrl(requestOrAstro: Request | AstroGlobal) {
  // A dev server can use any port. It runs with the vars of wrangler.jsonc,
  // thus DRAFT_MODE_HOSTNAME is not `localhost` there.
  if (import.meta.env.DEV || DRAFT_MODE_HOSTNAME === 'localhost') {
    const request = 'headers' in requestOrAstro ? requestOrAstro : requestOrAstro.request;
    return new URL(request.url).origin;
  }

  const draftMode = isDraftModeEnabled(requestOrAstro);
  return `https://${draftMode ? DRAFT_MODE_HOSTNAME : PUBLIC_HOSTNAME}`;
}
