import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query HeadlessCmsMultiLanguage($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        seoH1
        _seoMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);
