import { type ExecuteQueryOptions as CdaExecuteQueryOptions } from '@datocms/cda-client';
import type { AstroGlobal } from 'astro';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import { uniq } from 'lodash-es';
import { isDraftModeEnabled } from '~/lib/draftMode';
import { rawExecuteQueryWithAutoPagination } from './rawExecuteQueryWithAutoPagination';

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, using a
 * different API token depending on whether we want to fetch draft content or
 * published.
 */
export async function executeQuery<Result, Variables>(
  Astro: AstroGlobal,
  query: TadaDocumentNode<Result, Variables>,
  options?: Pick<CdaExecuteQueryOptions<Variables>, 'variables'>,
) {
  try {
    const draftModeEnabled = isDraftModeEnabled(Astro);

    const [result, response] = await rawExecuteQueryWithAutoPagination(query, {
      variables: options?.variables,
      returnCacheTags: true,
      excludeInvalid: true,
      includeDrafts: draftModeEnabled,
      token: DATOCMS_API_TOKEN,
    });

    // biome-ignore lint/style/noNonNullAssertion: We know this is not null
    const newCacheTags = response.headers.get('x-cache-tags')!.split(' ');

    const surrogateKeyHeaderName = draftModeEnabled ? 'debug-surrogate-key' : 'surrogate-key';

    const existingCacheTags = Astro.response.headers.get(surrogateKeyHeaderName)?.split(' ') ?? [];

    // We want Fastly to cache our resources forever but send headers to
    // browsers so that they don't cache it at all https://goo.gl/TQ3vqF

    Astro.response.headers.set(
      surrogateKeyHeaderName,
      uniq([...existingCacheTags, ...newCacheTags]).join(' '),
    );

    if (draftModeEnabled) {
      // No cache!
      Astro.response.headers.set('cache-control', 'private');
    } else {
      Astro.response.headers.set('surrogate-control', 'max-age=31536000');
    }

    return result;
  } catch (e) {
    Astro.response.headers.set('cache-control', 'private');
    throw e;
  }
}

export async function executeQueryOutsideAstro<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: Omit<CdaExecuteQueryOptions<Variables>, 'token' | 'excludeInvalid'>,
) {
  const [result] = await rawExecuteQueryWithAutoPagination(query, {
    ...options,
    excludeInvalid: true,
    token: DATOCMS_API_TOKEN,
  });

  return result;
}
