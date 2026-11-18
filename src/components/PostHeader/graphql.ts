import { PixelCoverFragment } from '~/components/PixelCover';
import { graphql } from '~/lib/datocms/graphql';

/*
 * Two fragments, not one fragment on RecordInterface: the CDA refuses
 * "... on CustomerStoryRecord { title }" when no root field of the query
 * gives a CustomerStoryRecord.
 */

export const PostHeaderFragment = graphql(
  /* GraphQL */ `
    fragment PostHeaderFragment on BlogPostRecord {
      title
      _firstPublishedAt
      _createdAt
      ...PixelCoverFragment
      author {
        name
        avatar {
          url(imgixParams: { w: 80, h: 80, fit: crop })
        }
      }
    }
  `,
  [PixelCoverFragment],
);

/** A casual chat: the model CustomerStory. */
export const ChatHeaderFragment = graphql(/* GraphQL */ `
  fragment ChatHeaderFragment on CustomerStoryRecord {
    title
    _firstPublishedAt
    _createdAt
    slug
    people {
      name
      title
      company
      avatar {
        url(imgixParams: { w: 80, h: 80, fit: crop })
      }
      portrait: avatar {
        url(imgixParams: { w: 640, h: 640, fit: crop })
      }
    }
  }
`);
