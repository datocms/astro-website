import { isEqual } from 'lodash-es';
import { LRUCache } from 'lru-cache';
import { invalidateFastlySurrogateKeys } from './fastly';
import { augmentResponseHeadersWithSurrogateKeys, type Context } from './surrogateKeys';

export const cache = new LRUCache({
  max: 1000,
  allowStale: false,
});

type MemoizeAndAugumentResponseHeadersFn<T> = (
  astroOrRequestResponseHeaders: Context,
) => Promise<T>;

export function dataSource<T>(
  surrogateKey: string,
  fn: () => Promise<T>,
): [MemoizeAndAugumentResponseHeadersFn<T>, () => Promise<string | false>] {
  const queryFn: MemoizeAndAugumentResponseHeadersFn<T> = async (astroOrRequestResponseHeaders) => {
    augmentResponseHeadersWithSurrogateKeys([surrogateKey], astroOrRequestResponseHeaders);

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
    const toInvalidate = cache.has(surrogateKey)
      ? !isEqual(cache.get(surrogateKey) as T, result)
      : true;

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
