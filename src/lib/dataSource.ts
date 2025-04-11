import { isEqual } from 'lodash-es';
import { LRUCache } from 'lru-cache';
import { augmentResponseHeadersWithCacheTags, type Context } from './cacheTags';
import { invalidateCacheTags } from './cloudflare';

export const cache = new LRUCache({
  max: 1000,
  allowStale: false,
});

type MemoizeAndAugumentResponseHeadersFn<T> = (
  astroOrRequestResponseHeaders: Context,
) => Promise<T>;

export function dataSource<T>(
  cacheTag: string,
  fn: () => Promise<T>,
): [MemoizeAndAugumentResponseHeadersFn<T>, () => Promise<string | false>] {
  const queryFn: MemoizeAndAugumentResponseHeadersFn<T> = async (astroOrRequestResponseHeaders) => {
    augmentResponseHeadersWithCacheTags([cacheTag], astroOrRequestResponseHeaders);

    if (cache.has(cacheTag)) {
      return cache.get(cacheTag) as T;
    }

    const result = await fn();

    if (result) {
      cache.set(cacheTag, result);
    }

    return result;
  };

  const maybeInvalidateFn = async () => {
    const result = await fn();
    const toInvalidate = cache.has(cacheTag) ? !isEqual(cache.get(cacheTag) as T, result) : true;

    if (toInvalidate) {
      cache.delete(cacheTag);
      await invalidateCacheTags([cacheTag]);

      if (result) {
        cache.set(cacheTag, result);
      }
    }

    return toInvalidate ? cacheTag : false;
  };

  return [queryFn, maybeInvalidateFn];
}
