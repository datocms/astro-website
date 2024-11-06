import { ProductUpdateFragment } from '~/components/product-updates/ProductUpdate/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForChangelogEntry,
  ChangelogEntryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

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

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
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
    { includeDrafts },
  );

  return entries.map(buildUrlForChangelogEntry);
};
