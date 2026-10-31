import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';

/*
 * Two fragments, not one fragment on RecordInterface: the CDA refuses
 * "... on CustomerStoryRecord { title }" when no root field of the query
 * gives a CustomerStoryRecord.
 *
 * The two variants of PostCard read the same fragments. Each variant has
 * its crop of the cover:
 * - `fullUrl` (variant "full"): 5:3, as the covers in the CMS since 2024
 *   (the field is "Cover image (5:3)"). A cover with a different shape is
 *   not cropped: it fits in the box, and a blur of the image fills the rest.
 * - `compactUrl` (variant "compact"): a crop that fills the box.
 *
 * `author` and `customData` give the credit of an Unsplash photo.
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
        author
        customData
        fullUrl: url(imgixParams: { w: 1080, h: 648, fit: fill, fill: blur })
        compactUrl: url(imgixParams: { w: 1140, h: 770, fit: crop })
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
      coverImage {
        alt
        author
        customData
        fullUrl: url(imgixParams: { w: 1080, h: 648, fit: fill, fill: blur })
        compactUrl: url(imgixParams: { w: 1140, h: 770, fit: crop })
      }
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
