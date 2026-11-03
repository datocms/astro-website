import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';

/*
 * Two fragments, not one fragment on RecordInterface: the CDA refuses
 * "... on CustomerStoryRecord { title }" when no root field of the query
 * gives a CustomerStoryRecord.
 *
 * Both variants of PostCard read the same fragments. A card has no cover
 * image.
 */

export const PostCardFragment = graphql(
  /* GraphQL */ `
    fragment PostCardFragment on BlogPostRecord {
      title
      _firstPublishedAt
      _createdAt
      ...BlogPostUrlFragment
      category {
        name
      }
      excerpt {
        value
      }
      author {
        name
        avatar {
          url(imgixParams: { w: 60, h: 60, fit: crop, crop: faces })
        }
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
      excerpt {
        value
      }
      people {
        name
        avatar {
          url(imgixParams: { w: 60, h: 60, fit: crop, crop: faces })
        }
      }
    }
  `,
  [CustomerStoryUrlFragment],
);
