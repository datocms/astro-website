import type { AstroGlobal } from 'astro';
import { uniq } from 'lodash-es';
import { isDraftModeEnabled } from './draftMode';

export type Context =
  | AstroGlobal
  | {
      request: Request;
      responseHeaders: Headers;
    };

export function augmentResponseHeadersWithSurrogateKeys(
  newSurrogateKeys: string[],
  context: Context,
) {
  const draftModeEnabled = isDraftModeEnabled('request' in context ? context.request : context);

  const responseHeaders =
    'responseHeaders' in context ? context.responseHeaders : context.response.headers;

  const surrogateKeyHeaderName = draftModeEnabled ? 'debug-surrogate-key' : 'surrogate-key';
  const existingSurrogateKeys = responseHeaders.get(surrogateKeyHeaderName)?.split(' ') ?? [];
  const finalSurrogateKeys = uniq([...existingSurrogateKeys, ...newSurrogateKeys]).join(' ');

  responseHeaders.set(surrogateKeyHeaderName, finalSurrogateKeys);

  if (draftModeEnabled) {
    responseHeaders.set('cache-control', 'private');
  } else {
    responseHeaders.set('datocms-cache-tags', finalSurrogateKeys);

    responseHeaders.set(
      'surrogate-control',
      'max-age=31536000, stale-while-revalidate=60, stale-if-error=86400',
    );
  }
}
