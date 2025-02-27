import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query HowToDatocms {
      page: howToDatocmsIndex {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);
