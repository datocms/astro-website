import { GroupLayoutFragment } from '~/layouts/docs/GroupLayout/_graphql';
import { PageLayoutFragment } from '~/layouts/docs/PageLayout/_graphql';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { buildUrlForDocPage, DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { graphql } from '~/lib/datocms/graphql';
import { isDefined } from '~/lib/isDefined';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const docGroupQuery = graphql(
  /* GraphQL */ `
    query DocPageGroup($groupSlug: String!) {
      group: docGroup(filter: { slug: { eq: $groupSlug } }) {
        ...GroupLayoutFragment
        pagesOrSections: pages {
          __typename
          ... on DocGroupPageRecord {
            page {
              id
            }
          }
          ... on DocGroupSectionRecord {
            title
            pages {
              page {
                id
              }
            }
          }
        }
      }
    }
  `,
  [GroupLayoutFragment],
);

export const docPageQuery = graphql(
  /* GraphQL */ `
    query DocPagePage($pageId: ItemId!) {
      page: docPage(filter: { id: { eq: $pageId } }) {
        ...PageLayoutFragment
      }
    }
  `,
  [PageLayoutFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allDocPages(first: 500) {
            ...DocPageUrlFragment
            _updatedAt
          }
        }
      `,
      [DocPageUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries
    .map((page): SitemapEntry | undefined => {
      try {
        return {
          url: buildUrlForDocPage(page),
          lastmod: page._updatedAt,
        };
      } catch (e) {
        return undefined;
      }
    })
    .filter(isDefined);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ rest: string }> = async ({
  executeQueryOptions,
  params: { rest },
}) => {
  const [groupSlug, rawPageSlug] = rest.split('/') as [string] | [string, string];

  const pageSlug = rawPageSlug || 'index';

  const { group } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($groupSlug: String!) {
        group: docGroup(filter: { slug: { eq: $groupSlug } }) {
          id
          pagesOrSections: pages {
            __typename
            ... on DocGroupPageRecord {
              page {
                id
                slug
              }
            }
            ... on DocGroupSectionRecord {
              title
              pages {
                page {
                  id
                  slug
                }
              }
            }
          }
        }
      }
    `),
    { ...executeQueryOptions, variables: { groupSlug } },
  );

  if (!group) {
    return undefined;
  }

  const allPagesWithinGroup = group.pagesOrSections.flatMap((pageOrSection) =>
    pageOrSection.__typename === 'DocGroupPageRecord'
      ? pageOrSection.page
      : pageOrSection.pages.map((page) => page.page),
  );

  const ourPageHandle = allPagesWithinGroup.find((page) => page.slug === pageSlug);

  return ourPageHandle?.id;
};
