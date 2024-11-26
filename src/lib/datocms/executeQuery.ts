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
  return executeQueryOutsideAstro(query, {
    ...options,
    request: Astro,
    responseHeaders: Astro.response.headers,
  });
}

export async function executeQueryOutsideAstro<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options: Pick<CdaExecuteQueryOptions<Variables>, 'variables'> & {
    request: Request | AstroGlobal;
    responseHeaders: Headers;
  },
) {
  const draftModeEnabled = isDraftModeEnabled(options.request);

  const [result, datocmsGraphqlResponse] = await rawExecuteQueryWithAutoPagination(query, {
    ...options,
    returnCacheTags: true,
    excludeInvalid: true,
    includeDrafts: draftModeEnabled,
    token: DATOCMS_API_TOKEN,
  });

  augmentResponseHeadersWithSurrogateKeys({
    draftModeEnabled,
    datocmsGraphqlResponse,
    responseHeaders: options.responseHeaders,
  });

  return result;
}

function augmentResponseHeadersWithSurrogateKeys({
  draftModeEnabled,
  datocmsGraphqlResponse,
  responseHeaders,
}: {
  draftModeEnabled: boolean;
  datocmsGraphqlResponse: Response;
  responseHeaders: Headers;
}) {
  const newCacheTags = datocmsGraphqlResponse.headers.get('x-cache-tags')!.split(' ');
  const surrogateKeyHeaderName = draftModeEnabled ? 'debug-surrogate-key' : 'surrogate-key';
  const existingCacheTags = responseHeaders.get(surrogateKeyHeaderName)?.split(' ') ?? [];
  const mergedCacheTags = uniq([...existingCacheTags, ...newCacheTags]).join(' ');

  responseHeaders.set(surrogateKeyHeaderName, mergedCacheTags);
  responseHeaders.set('datocms-cache-tags', mergedCacheTags);

  if (draftModeEnabled) {
    responseHeaders.set('cache-control', 'private');
  } else {
    responseHeaders.set('surrogate-control', 'max-age=31536000');
  }
}
