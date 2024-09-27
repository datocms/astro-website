import { ProductUpdateFragment } from '~/components/product-updates/ProductUpdate/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ProductUpdate($slug: String!) {
      productUpdate: changelogEntry(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        ...ProductUpdateFragment
      }
    }
  `,
  [TagFragment, ProductUpdateFragment],
);
