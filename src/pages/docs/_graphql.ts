import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query DocsHome {
      page: docsPage {
        _seoMetaTags {
          ...TagFragment
        }
      }
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          __typename
          ...DocGroupUrlFragment
        }
      }
      tutorials: allVideoTutorials(first: 3, filter: { showInDocsHomepage: { eq: true } }) {
        id
        title
        res: videoTutorialResource {
          ... on RecordInterface {
            id
            __typename
          }
          ... on OtherVideoResourceRecord {
            url
            coverImage {
              responsiveImage(imgixParams: { auto: format, w: 300, ar: "4:3", fit: crop }) {
                ...ResponsiveImageFragment
              }
            }
          }
          ... on YoutubeVideoResourceRecord {
            video {
              url
              thumbnailUrl
              providerUid
            }
          }
        }
        _publishedAt
      }
      tutorialsMeta: _allVideoTutorialsMeta {
        count
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, DocGroupUrlFragment],
);
