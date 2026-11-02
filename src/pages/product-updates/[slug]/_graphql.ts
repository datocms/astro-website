import { ProductUpdateFragment } from '~/components/ProductUpdate';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForChangelogEntry,
  ChangelogEntryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query ProductUpdate($slug: String!) {
      entry: changelogEntry(filter: { slug: { eq: $slug } }) {
        _firstPublishedAt
        seo: _seoMetaTags {
          ...TagFragment
        }
        ...ProductUpdateFragment
      }
    }
  `,
  [TagFragment, ProductUpdateFragment],
);

/**
 * The entries before and after an entry, by date of first publication: the
 * newer one and the older one. As in the blog (src/pages/blog/_related.ts),
 * the filters exclude the entry by its slug: a filter on the date can
 * return the entry itself.
 */
export const neighboursQuery = graphql(
  /* GraphQL */ `
    query ProductUpdateNeighbours($date: DateTime!, $slug: String!) {
      newer: allChangelogEntries(
        first: 1
        filter: { _firstPublishedAt: { gt: $date }, slug: { neq: $slug } }
        orderBy: _firstPublishedAt_ASC
      ) {
        title
        ...ChangelogEntryUrlFragment
      }
      older: allChangelogEntries(
        first: 1
        filter: { _firstPublishedAt: { lt: $date }, slug: { neq: $slug } }
        orderBy: _firstPublishedAt_DESC
      ) {
        title
        ...ChangelogEntryUrlFragment
      }
    }
  `,
  [ChangelogEntryUrlFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allChangelogEntries(first: 500) {
            _publishedAt
            ...ChangelogEntryUrlFragment
          }
        }
      `,
      [ChangelogEntryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForChangelogEntry(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
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
