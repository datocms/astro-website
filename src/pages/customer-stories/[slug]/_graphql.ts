import { CodesandboxEmbedBlockFragment } from '~/components/blocks/CodesandboxEmbedBlock/graphql';
import { CtaButtonFragment } from '~/components/blocks/CtaButton/graphql';
import { DemoFragment } from '~/components/blocks/Demo/graphql';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { MultipleDemosBlockFragment } from '~/components/blocks/MultipleDemosBlock/graphql';
import { QuestionAnswerFragment } from '~/components/blocks/QuestionAnswer/graphql';
import { ShowcaseProjectBlockFragment } from '~/components/blocks/ShowcaseProjectBlock/graphql';
import { TableFragment } from '~/components/blocks/Table/graphql';
import { TutorialVideoFragment } from '~/components/blocks/TutorialVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { BlogPostInlineFragment } from '~/components/inlineRecords/BlogPostInline/graphql';
import { ChangelogEntryInlineFragment } from '~/components/inlineRecords/ChangelogEntryInline/graphql';
import { BlogPostLinkFragment } from '~/components/linkToRecords/BlogPostLink/graphql';
import { ChangelogEntryLinkFragment } from '~/components/linkToRecords/ChangelogEntryLink/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  CustomerStoryUrlFragment,
  buildUrlForCustomerStory,
} from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      post: customerStory(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        seoH1
        canonicalUrl
        yoastAnalysis
        content {
          value
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ...BlogPostInlineFragment
            ...ChangelogEntryInlineFragment
            ...BlogPostLinkFragment
            ...ChangelogEntryLinkFragment
          }
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on DemoRecord {
              ...DemoFragment
            }
            ... on ImageRecord {
              ...ImageFragment
            }
            ... on QuestionAnswerRecord {
              ...QuestionAnswerFragment
            }
            ... on MultipleDemosBlockRecord {
              ...MultipleDemosBlockFragment
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
            ... on VideoRecord {
              ...VideoFragment
            }
            ... on CodesandboxEmbedBlockRecord {
              ...CodesandboxEmbedBlockFragment
            }
            ... on CtaButtonRecord {
              ...CtaButtonFragment
            }
            ... on TutorialVideoRecord {
              ...TutorialVideoFragment
            }
            ... on ShowcaseProjectBlockRecord {
              ...ShowcaseProjectBlockFragment
            }
            ... on TableRecord {
              ...TableFragment
            }
          }
        }
        people {
          name
          title
          company
          avatar {
            responsiveImage(imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    TableFragment,
    InternalVideoFragment,
    DemoFragment,
    MultipleDemosBlockFragment,
    VideoFragment,
    ImageFragment,
    TutorialVideoFragment,
    CodesandboxEmbedBlockFragment,
    CtaButtonFragment,
    ShowcaseProjectBlockFragment,
    QuestionAnswerFragment,
    BlogPostInlineFragment,
    ChangelogEntryInlineFragment,
    BlogPostLinkFragment,
    ChangelogEntryLinkFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allCustomerStories(first: 500) {
            ...CustomerStoryUrlFragment
          }
        }
      `,
      [CustomerStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForCustomerStory);
};
