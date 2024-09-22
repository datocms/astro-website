import { LRUCache } from 'lru-cache';
import { nanoid } from 'nanoid';

type AnyFunction = () => any;

export const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 1 day
  allowStale: false,
});

export function cachedFn<T extends AnyFunction>(fn: T): T {
  const id = `cachefn-${nanoid()}`;

  return (async () => {
    if (cache.has(id)) {
      return cache.get(id) as T;
    }

    const result = await fn();
    cache.set(id, result);

    return result;
  }) as T;
}
