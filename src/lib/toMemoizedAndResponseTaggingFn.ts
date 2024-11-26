import type { AstroGlobal } from 'astro';
import { uniq } from 'lodash-es';
import { LRUCache } from 'lru-cache';
import { isDraftModeEnabled } from './draftMode';
import { invalidateFastlySurrogateKeys } from './fastly';

export const cache = new LRUCache({
  max: 1000,
  allowStale: false,
});

type MemoizeAndAugumentResponseHeadersFn<T> = (
  astroOrRequestResponseHeaders: AstroOrRequestResponseHeaders,
) => Promise<T>;

type AstroOrRequestResponseHeaders =
  | AstroGlobal
  | {
      request: Request;
      responseHeaders: Headers;
    };

export function toMemoizedAndResponseTaggingFn<T>(
  surrogateKey: string,
  fn: () => Promise<T>,
): [MemoizeAndAugumentResponseHeadersFn<T>, () => Promise<string | false>] {
  const queryFn: MemoizeAndAugumentResponseHeadersFn<T> = async (astroOrRequestResponseHeaders) => {
    augmentResponseHeadersWithSurrogateKeys(surrogateKey, astroOrRequestResponseHeaders);

    if (cache.has(surrogateKey)) {
      return cache.get(surrogateKey) as T;
    }

    const result = await fn();

    if (result) {
      cache.set(surrogateKey, result);
    }

    return result;
  };

  const maybeInvalidateFn = async () => {
    const result = await fn();
    const toInvalidate = cache.has(surrogateKey) ? (cache.get(surrogateKey) as T) !== result : true;

    if (toInvalidate) {
      cache.delete(surrogateKey);
      await invalidateFastlySurrogateKeys([surrogateKey]);

      if (result) {
        cache.set(surrogateKey, result);
      }
    }

    return toInvalidate ? surrogateKey : false;
  };

  return [queryFn, maybeInvalidateFn];
}

function augmentResponseHeadersWithSurrogateKeys(
  surrogateKey: string,
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

  const newCacheTags = [surrogateKey];

  const surrogateKeyHeaderName = draftModeEnabled ? 'debug-surrogate-key' : 'surrogate-key';
  const existingCacheTags = responseHeaders.get(surrogateKeyHeaderName)?.split(' ') ?? [];
  const mergedCacheTags = uniq([...existingCacheTags, ...newCacheTags]).join(' ');

  responseHeaders.set(surrogateKeyHeaderName, mergedCacheTags);

  if (draftModeEnabled) {
    responseHeaders.set('cache-control', 'private');
  } else {
    responseHeaders.set('surrogate-control', 'max-age=31536000');
  }
}
