import { graphql } from '~/lib/datocms/graphql';

/*
 * Two fragments, not one fragment on RecordInterface: the CDA refuses
 * "... on CustomerStoryRecord { title }" when no root field of the query
 * gives a CustomerStoryRecord.
 */

export const PostHeaderFragment = graphql(/* GraphQL */ `
  fragment PostHeaderFragment on BlogPostRecord {
    title
    _firstPublishedAt
    _createdAt
    author {
      name
      avatar {
        url(imgixParams: { w: 80, h: 80, fit: crop, crop: faces })
      }
    }
  }
`);

/** A casual chat: the model CustomerStory. */
export const ChatHeaderFragment = graphql(/* GraphQL */ `
  fragment ChatHeaderFragment on CustomerStoryRecord {
    title
    _firstPublishedAt
    _createdAt
    people {
      name
      title
      company
      avatar {
        url(imgixParams: { w: 80, h: 80, fit: crop, crop: faces })
      }
    }
  }
`);
