import { DocGroupItemsFragment } from '~/components/docs/Sidebar';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';

export const GroupLayoutFragment = graphql(
  /* GraphQL */ `
    fragment GroupLayoutFragment on DocGroupRecord {
      ...DocGroupItemsFragment
      name
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
      techStarterKit {
        id
        name
        cmsDescription
        starterType
        badge {
          name
          emoji
        }
        label
        githubRepo
        technology {
          name
          logo {
            url
          }
          squareLogo {
            url
          }
        }
        screenshot {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        ...TemplateDemoUrlFragment
      }
    }
  `,
  [ResponsiveImageFragment, DocGroupItemsFragment, TemplateDemoUrlFragment],
);

export const docGroupQuery = graphql(
  /* GraphQL */ `
    query DocPageGroup($groupSlug: String!) {
      group: docGroup(filter: { slug: { eq: $groupSlug } }) {
        ...GroupLayoutFragment
      }
    }
  `,
  [GroupLayoutFragment],
);
