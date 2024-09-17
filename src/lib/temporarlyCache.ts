import { addMinutes, isBefore } from 'date-fns';

type AnyFunction = () => any;

export function temporarilyCache<T extends AnyFunction>(cacheDurationInMinutes: number, fn: T): T {
  let cachedResult: ReturnType<T> | '__EMPTY__' = '__EMPTY__';
  let cacheExpiration: Date | null = null;

  return (async () => {
    const now = new Date();

    if (cachedResult !== '__EMPTY__' && cacheExpiration && isBefore(now, cacheExpiration)) {
      return cachedResult;
    }

    const result = fn();
    cachedResult = result;
    cacheExpiration = addMinutes(now, cacheDurationInMinutes);

    return result;
  }) as T;
}
