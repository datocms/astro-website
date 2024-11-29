import { DemoFragment } from '~/components/blocks/Demo/graphql';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { MultipleDemosBlockFragment } from '~/components/blocks/MultipleDemosBlock/graphql';
import { TableFragment } from '~/components/blocks/Table/graphql';
import { TutorialVideoFragment } from '~/components/blocks/TutorialVideo/graphql';
import { CloneButtonFormFragment } from '~/components/docs/blocks/CloneButtonForm/graphql';
import { DeployButtonFormFragment } from '~/components/docs/blocks/DeployButtonForm/graphql';
import { DocCalloutFragment } from '~/components/docs/blocks/DocCallout/graphql';
import { PluginSdkHookGroupFragment } from '~/components/docs/blocks/PluginSdkHookGroup/graphql';
import { ReactUiLiveExampleFragment } from '~/components/docs/blocks/ReactUiLiveExample/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { GroupLayoutFragment } from '../GroupLayout/_graphql';

export const PageLayoutFragment = graphql(
  /* GraphQL */ `
    fragment PageLayoutFragment on DocPageRecord {
      id
      title
      _seoMetaTags {
        ...TagFragment
      }
      seo {
        title
        description
      }
      parents: _allReferencingDocGroups {
        name
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
