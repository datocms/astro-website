import type { AstroGlobal } from 'astro';
import { uniq } from 'lodash-es';
import { isDraftModeEnabled } from './draftMode';

export type AstroOrRequestResponseHeaders =
  | AstroGlobal
  | {
      request: Request;
      responseHeaders: Headers;
    };

export function augmentResponseHeadersWithSurrogateKeys(
  newSurrogateKeys: string[],
  astroOrRequestResponseHeaders: AstroOrRequestResponseHeaders,
) {
  const draftModeEnabled = isDraftModeEnabled(
    'request' in astroOrRequestResponseHeaders
      ? astroOrRequestResponseHeaders.request
      : astroOrRequestResponseHeaders,
  );

  const responseHeaders =
    'responseHeaders' in astroOrRequestResponseHeaders
      ? astroOrRequestResponseHeaders.responseHeaders
      : astroOrRequestResponseHeaders.response.headers;

  const surrogateKeyHeaderName = draftModeEnabled ? 'debug-surrogate-key' : 'surrogate-key';
  const existingSurrogateKeys = responseHeaders.get(surrogateKeyHeaderName)?.split(' ') ?? [];
  const mergedCacheTags = uniq([...existingSurrogateKeys, ...newSurrogateKeys]).join(' ');

  responseHeaders.set(surrogateKeyHeaderName, mergedCacheTags);
  responseHeaders.set('datocms-cache-tags', mergedCacheTags);

  if (draftModeEnabled) {
    responseHeaders.set('cache-control', 'private');
  } else {
    responseHeaders.set(
      'surrogate-control',
      'max-age=31536000, stale-while-revalidate=60, stale-if-error=86400',
    );
  }
}
