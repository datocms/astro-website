import { LRUCache } from 'lru-cache';
import { purgeCacheTags } from './purgeCache';
import { augmentResponseHeadersWithSurrogateKeys, type Context } from './surrogateKeys';

/*
 * A data source is data from outside DatoCMS (a schema, a manifest, a list of
 * plans). The pages that show it get its key as a cache tag. Every 10 minutes
 * the cron fetches each source again and purges the tag when the data changed.
 *
 * Each isolate of the Worker keeps the data in memory for MEMO_TTL. The cron
 * runs in a different isolate, thus it cannot compare with that memory: it
 * compares the hash of the data with the hash in KV.
 *
 * After a change, an isolate can keep the old data for MEMO_TTL and render a
 * page with it after the purge. Thus the next run of the cron, more than
 * MEMO_TTL later, purges the tag one more time.
 */
const MEMO_TTL = 5 * 60 * 1000;

const memo = new LRUCache<string, object>({ max: 1000, ttl: MEMO_TTL });

type StoredState = {
  hash: string;
  purgeAgain: boolean;
};

type MemoizeAndAugumentResponseHeadersFn<T> = (
  astroOrRequestResponseHeaders: Context,
) => Promise<T>;

/*
 * A JSON text of the value that also accepts cycles: the hyperschemas are
 * dereferenced, thus they contain cycles. An object that occurs again gives
 * `#<n>`, its position in the walk. The walk is always in the same order, thus
 * the same data gives the same text.
 */
function serialize(value: unknown) {
  const seen = new Map<object, number>();

  const walk = (node: unknown): string => {
    if (node === null || typeof node !== 'object') {
      return JSON.stringify(node) ?? 'undefined';
    }

    const position = seen.get(node);
    if (position !== undefined) {
      return `#${position}`;
    }
    seen.set(node, seen.size);

    if (Array.isArray(node)) {
      return `[${node.map(walk).join(',')}]`;
    }

    const entries = Object.entries(node).map(
      ([key, child]) => `${JSON.stringify(key)}:${walk(child)}`,
    );
    return `{${entries.join(',')}}`;
  };

  return walk(value);
}

async function sha256(value: unknown) {
  const bytes = new TextEncoder().encode(serialize(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function dataSourcesKv() {
  const { env } = await import('cloudflare:workers');
  if (!env.DATA_SOURCES) {
    throw new Error('The KV binding DATA_SOURCES is missing');
  }
  return env.DATA_SOURCES;
}

export function dataSource<T>(
  surrogateKey: string,
  fn: () => Promise<T>,
): [MemoizeAndAugumentResponseHeadersFn<T>, () => Promise<string | false>] {
  const queryFn: MemoizeAndAugumentResponseHeadersFn<T> = async (astroOrRequestResponseHeaders) => {
    augmentResponseHeadersWithSurrogateKeys([surrogateKey], astroOrRequestResponseHeaders);

    const cached = memo.get(surrogateKey);
    if (cached) {
      return cached as T;
    }

    const result = await fn();

    if (result) {
      memo.set(surrogateKey, result as object);
    }

    return result;
  };

  const maybeInvalidateFn = async () => {
    const result = await fn();
    const hash = await sha256(result);
    const kv = await dataSourcesKv();
    const stored = await kv.get<StoredState>(surrogateKey, 'json');

    if (stored?.hash === hash && !stored.purgeAgain) {
      return false;
    }

    await purgeCacheTags([surrogateKey]);

    // A change purges two times: now, and on the next run of the cron.
    const changed = stored?.hash !== hash;
    await kv.put(surrogateKey, JSON.stringify({ hash, purgeAgain: changed } satisfies StoredState));

    memo.delete(surrogateKey);
    if (result) {
      memo.set(surrogateKey, result as object);
    }

    return surrogateKey;
  };

  return [queryFn, maybeInvalidateFn];
}
