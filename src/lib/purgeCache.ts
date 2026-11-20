import { chunk } from 'lodash-es';

// Cloudflare accepts at most 100 tags in one purge call.
const TAGS_PER_PURGE = 100;

/**
 * Removes from the Workers cache each response that has one of the tags.
 * `cache.invalidate()` of Astro does the same, but it needs the context of a
 * request, and the data sources have none.
 */
export async function purgeCacheTags(tags: string[]) {
  const { cache } = await import('cloudflare:workers');

  for (const chunkTags of chunk(tags, TAGS_PER_PURGE)) {
    await cache.purge({ tags: chunkTags });
  }

  return { purged: tags.length };
}
