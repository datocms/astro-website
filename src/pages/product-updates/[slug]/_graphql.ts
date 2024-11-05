import { ProductUpdateFragment } from '~/components/product-updates/ProductUpdate/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForChangelogEntry,
  ChangelogEntryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
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

export const buildSitemapUrls = async () => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allChangelogEntries(first: 500) {
            ...ChangelogEntryUrlFragment
          }
        }
      `,
      [ChangelogEntryUrlFragment],
    ),
  );

  return entries.map(buildUrlForChangelogEntry);
};
