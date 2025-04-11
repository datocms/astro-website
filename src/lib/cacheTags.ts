import type { AstroGlobal } from 'astro';
import { uniq } from 'lodash-es';
import { isDraftModeEnabled } from './draftMode';

export type Context =
  | AstroGlobal
  | {
      request: Request;
      responseHeaders: Headers;
    };

export function augmentResponseHeadersWithCacheTags(newTags: string[], context: Context) {
  const draftModeEnabled = isDraftModeEnabled('request' in context ? context.request : context);

  const responseHeaders =
    'responseHeaders' in context ? context.responseHeaders : context.response.headers;

  const cacheTagHeaderName = draftModeEnabled ? 'debug-cache-tag' : 'cache-tag';

  const existingTags = responseHeaders.get(cacheTagHeaderName)?.split(',') ?? [];
  const finalTags = uniq([...existingTags, ...newTags]).join(',');

  responseHeaders.set(cacheTagHeaderName, finalTags);

  if (draftModeEnabled) {
    responseHeaders.set('cache-control', 'private');
  } else {
    responseHeaders.set('datocms-cache-tags', finalTags);

    responseHeaders.set(
      'cloudflare-cdn-cache-control',
      'max-age=31536000, stale-while-revalidate=60, stale-if-error=86400',
    );
  }
}
