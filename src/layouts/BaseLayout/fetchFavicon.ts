import { DATOCMS_API_TOKEN } from 'astro:env/server';
import { dataSource } from '~/lib/dataSource';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { rawExecuteQueryWithAutoPagination } from '~/lib/datocms/rawExecuteQueryWithAutoPagination';

const query = graphql(
  /* GraphQL */ `
    query RootQuery {
      _site {
        faviconMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);

export const [fetchFavicon, maybeInvalidateFavicon] = dataSource('favicon', async () => {
  const [result, datocmsGraphqlResponse] = await rawExecuteQueryWithAutoPagination(query, {
    returnCacheTags: true,
    excludeInvalid: true,
    token: DATOCMS_API_TOKEN,
  });

  const cacheTags = datocmsGraphqlResponse.headers.get('x-cache-tags')!.split(' ');

  return [result, cacheTags] as const;
});
