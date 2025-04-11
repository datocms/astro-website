import {
  rawExecuteQueryWithAutoPagination,
  type ExecuteQueryOptions as CdaExecuteQueryOptions,
} from '@datocms/cda-client';
import type { AstroGlobal } from 'astro';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import { print } from 'graphql';
import { isDraftModeEnabled } from '~/lib/draftMode';
import { augmentResponseHeadersWithCacheTags } from '../cacheTags';

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
  return executeQueryOutsideAstro(query, {
    ...options,
    request: Astro.request,
    responseHeaders: Astro.response.headers,
  });
}

export async function executeQueryOutsideAstro<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options: Pick<CdaExecuteQueryOptions<Variables>, 'variables'> & {
    request: Request;
    responseHeaders: Headers;
  },
) {
  const draftModeEnabled = isDraftModeEnabled(options.request);

  try {
    const [result, datocmsGraphqlResponse] = await rawExecuteQueryWithAutoPagination(query, {
      ...options,
      returnCacheTags: true,
      excludeInvalid: true,
      includeDrafts: draftModeEnabled,
      token: DATOCMS_API_TOKEN,
    });

    const newCacheTags = datocmsGraphqlResponse.headers.get('x-cache-tags')!.split(' ');

    augmentResponseHeadersWithCacheTags(newCacheTags, {
      request: options.request,
      responseHeaders: options.responseHeaders,
    });

    return result;
  } catch (e) {
    console.log(print(query));
    throw e;
  }
}
