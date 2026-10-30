import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';

/*
 * Two fragments, not one fragment on RecordInterface: the CDA refuses
 * "... on CustomerStoryRecord { title }" when no root field of the query
 * gives a CustomerStoryRecord.
 */

export const PostCardFragment = graphql(
  /* GraphQL */ `
    fragment PostCardFragment on BlogPostRecord {
      title
      _firstPublishedAt
      _createdAt
      ...BlogPostUrlFragment
      coverImage {
        alt
        url(imgixParams: { w: 1140, h: 770, fit: crop })
      }
    }
  `,
  [BlogPostUrlFragment],
);

/** A casual chat: the model CustomerStory. */
export const ChatCardFragment = graphql(
  /* GraphQL */ `
    fragment ChatCardFragment on CustomerStoryRecord {
      title
      _firstPublishedAt
      _createdAt
      ...CustomerStoryUrlFragment
      coverImage {
        alt
        url(imgixParams: { w: 1140, h: 770, fit: crop })
      }
      people {
        name
      }
    }
  `,
  [CustomerStoryUrlFragment],
);
