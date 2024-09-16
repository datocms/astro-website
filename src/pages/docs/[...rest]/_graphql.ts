import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { CloneButtonFormFragment } from '~/components/docs/blocks/CloneButtonForm/graphql';
import { DemoFragment } from '~/components/docs/blocks/Demo/graphql';
import { DeployButtonFormFragment } from '~/components/docs/blocks/DeployButtonForm/graphql';
import { DocCalloutFragment } from '~/components/docs/blocks/DocCallout/graphql';
import { MultipleDemosBlockFragment } from '~/components/docs/blocks/MultipleDemosBlock/graphql';
import { PluginSdkHookGroupFragment } from '~/components/docs/blocks/PluginSdkHookGroup/graphql';
import { ReactUiLiveExampleFragment } from '~/components/docs/blocks/ReactUiLiveExample/graphql';
import { TableFragment } from '~/components/docs/blocks/Table/graphql';
import { TutorialVideoFragment } from '~/components/docs/blocks/TutorialVideo/graphql';
import { DocGroupItemsFragment } from '~/components/docs/Sidebar';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder';
import { graphql } from '~/lib/datocms/graphql';

export const docGroupQuery = graphql(
  /* GraphQL */ `
    query DocPageGroup($groupSlug: String!) {
      group: docGroup(filter: { slug: { eq: $groupSlug } }) {
        ...DocGroupItemsFragment
        name
        slug
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
    }
  `,
  [ResponsiveImageFragment, DocGroupItemsFragment, TemplateDemoUrlFragment],
);

export const docPageQuery = graphql(
  /* GraphQL */ `
    query DocPagePage($pageId: ItemId!) {
      page: docPage(filter: { id: { eq: $pageId } }) {
        title
        _seoMetaTags {
          ...TagFragment
        }
        content {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on ImageRecord {
              ...ImageFragment
            }
            ... on TableRecord {
              ...TableFragment
            }
            ... on DemoRecord {
              ...DemoFragment
            }
            ... on MultipleDemosBlockRecord {
              ...MultipleDemosBlockFragment
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
            ... on CloneButtonFormRecord {
              ...CloneButtonFormFragment
            }
            ... on DeployButtonFormRecord {
              ...DeployButtonFormFragment
            }
            ... on PluginSdkHookGroupRecord {
              ...PluginSdkHookGroupFragment
            }
            ... on DocCalloutRecord {
              ...DocCalloutFragment
            }
            ... on ReactUiLiveExampleRecord {
              ...ReactUiLiveExampleFragment
            }
            ... on TutorialVideoRecord {
              ...TutorialVideoFragment
            }
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    ImageFragment,
    TableFragment,
    DemoFragment,
    MultipleDemosBlockFragment,
    InternalVideoFragment,
    CloneButtonFormFragment,
    DeployButtonFormFragment,
    PluginSdkHookGroupFragment,
    DocCalloutFragment,
    ReactUiLiveExampleFragment,
    TutorialVideoFragment,
  ],
);
