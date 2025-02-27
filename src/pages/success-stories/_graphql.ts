import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query SuccessStories {
      page: successStoriesIndex {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);
