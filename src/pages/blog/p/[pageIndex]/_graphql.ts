import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query BlogPosts($limit: IntType!, $offset: IntType!) {
      page: blog {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }

      posts: allBlogPosts(
        first: $limit
        skip: $offset
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        slug
        title
        excerpt {
          value
        }
        coverImage {
          author
          customData
          responsiveImage(imgixParams: { auto: format, w: 550, h: 340, fit: fill, fill: blur }) {
            ...ResponsiveImageFragment
          }
        }
        _firstPublishedAt
        _createdAt
      }

      _allBlogPostsMeta {
        count
      }

      latestChangelogEntry: changelogEntry(
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
        filter: { showInBlog: { eq: true } }
      ) {
        title
        slug
        _firstPublishedAt
        _createdAt
        categories {
          name
          color {
            hex
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment],
);
