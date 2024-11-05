import { GroupLayoutFragment } from '~/layouts/docs/GroupLayout/_graphql';
import { PageLayoutFragment } from '~/layouts/docs/PageLayout/_graphql';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { buildUrlForDocPage, DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { graphql } from '~/lib/datocms/graphql';

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

export const buildSitemapUrls = async () => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allDocPages(first: 500) {
            ...DocPageUrlFragment
          }
        }
      `,
      [DocPageUrlFragment],
    ),
  );

  return entries
    .map((page) => {
      try {
        return buildUrlForDocPage(page);
      } catch (e) {
        return undefined;
      }
    })
    .filter(Boolean);
};
