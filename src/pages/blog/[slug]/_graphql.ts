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
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      post: blogPost(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        slug
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
            ...BlogPostUrlFragment
            ...ChangelogEntryUrlFragment
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
    BlogPostUrlFragment,
    TableFragment,
    InternalVideoFragment,
    DemoFragment,
    MultipleDemosBlockFragment,
    VideoFragment,
    ImageFragment,
    ChangelogEntryUrlFragment,
    TutorialVideoFragment,
    CodesandboxEmbedBlockFragment,
    CtaButtonFragment,
    ShowcaseProjectBlockFragment,
    QuestionAnswerFragment,
  ],
);
