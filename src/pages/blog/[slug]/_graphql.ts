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
import { BlogPostUrlFragment, buildUrlForBlogPost } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      post: blogPost(filter: { slug: { eq: $slug } }) {
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
            ... on TutorialVideoRecord {
              ...TutorialVideoFragment
            }
            ... on ShowcaseProjectBlockRecord {
              ...ShowcaseProjectBlockFragment
            }
            ... on ImageRecord {
              ...ImageFragment
            }
            ... on CodesandboxEmbedBlockRecord {
              ...CodesandboxEmbedBlockFragment
            }
            ... on VideoRecord {
              ...VideoFragment
            }
            ... on CtaButtonRecord {
              ...CtaButtonFragment
            }
            ... on MultipleDemosBlockRecord {
              ...MultipleDemosBlockFragment
            }
            ... on DemoRecord {
              ...DemoFragment
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
            ... on QuestionAnswerRecord {
              ...QuestionAnswerFragment
            }
            ... on TableRecord {
              ...TableFragment
            }
          }
        }
        _firstPublishedAt
        _createdAt
        author {
          name
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

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allBlogPosts(first: 500) {
            ...BlogPostUrlFragment
          }
        }
      `,
      [BlogPostUrlFragment],
    ),
    { includeDrafts },
  );

  return entries.map(buildUrlForBlogPost);
};
