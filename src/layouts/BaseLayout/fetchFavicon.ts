import { executeQuery } from '@datocms/cda-client';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import { dataSource } from '~/lib/dataSource';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

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
  return await executeQuery(query, {
    returnCacheTags: true,
    excludeInvalid: true,
    token: DATOCMS_API_TOKEN,
  });
});
