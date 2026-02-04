import { ProductUpdateFragment } from '~/components/product-updates/ProductUpdate/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForChangelogEntry,
  ChangelogEntryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

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

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allChangelogEntries(first: 500) {
            ...ChangelogEntryUrlFragment
            _updatedAt
          }
        }
      `,
      [ChangelogEntryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(
    (entry): SitemapEntry => ({
      url: buildUrlForChangelogEntry(entry),
      lastmod: entry._updatedAt,
    }),
  );
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: changelogEntry(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
