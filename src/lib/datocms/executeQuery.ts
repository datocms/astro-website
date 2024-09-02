import { rawExecuteQuery } from '@datocms/cda-client';
import type { AstroGlobal } from 'astro';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import { uniq } from 'lodash-es';
import { isDraftModeEnabled } from '~/lib/draftMode';

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, using a
 * different API token depending on whether we want to fetch draft content or
 * published.
 */
export async function executeQuery<Result, Variables>(
  Astro: AstroGlobal,
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>,
) {
  try {
    const draftModeEnabled = isDraftModeEnabled(Astro);

    const [result, response] = await rawExecuteQuery(query, {
      variables: options?.variables,
      returnCacheTags: true,
      excludeInvalid: true,
      includeDrafts: draftModeEnabled,
      token: DATOCMS_API_TOKEN,
    });

    if (draftModeEnabled) {
      // No cache!
      Astro.response.headers.set('cache-control', 'private');
    } else {
      // biome-ignore lint/style/noNonNullAssertion: We know this is not null
      const newCacheTags = response.headers.get('x-cache-tags')!.split(' ');

      const existingCacheTags = Astro.response.headers.get('surrogate-key')?.split(' ') ?? [];

      // We want Fastly to cache our resources forever but send headers to
      // browsers so that they don't cache it at all https://goo.gl/TQ3vqF

      Astro.response.headers.set(
        'surrogate-key',
        uniq([...existingCacheTags, ...newCacheTags]).join(' '),
      );

      Astro.response.headers.set('surrogate-control', 'max-age=31536000');
    }

    return result;
  } catch (e) {
    Astro.response.headers.set('cache-control', 'private');
    throw e;
  }
}

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
};
