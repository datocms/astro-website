import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';

/*
 * Two fragments, not one fragment on RecordInterface: the CDA refuses
 * "... on CustomerStoryRecord { title }" when no root field of the query
 * gives a CustomerStoryRecord.
 *
 * The cover is 5:3, as the covers in the CMS since 2024 (the field is
 * "Cover image (5:3)"). An old cover with a different shape is not
 * cropped: it fits in the box, and a blur of the image fills the rest (as
 * on the old site).
 */

export const PostTeaserFragment = graphql(
  /* GraphQL */ `
    fragment PostTeaserFragment on BlogPostRecord {
      title
      _firstPublishedAt
      _createdAt
      ...BlogPostUrlFragment
      coverImage {
        alt
        url(imgixParams: { w: 1080, h: 648, fit: fill, fill: blur })
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
export const ChatTeaserFragment = graphql(
  /* GraphQL */ `
    fragment ChatTeaserFragment on CustomerStoryRecord {
      title
      _firstPublishedAt
      _createdAt
      ...CustomerStoryUrlFragment
      coverImage {
        alt
        url(imgixParams: { w: 1080, h: 648, fit: fill, fill: blur })
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
