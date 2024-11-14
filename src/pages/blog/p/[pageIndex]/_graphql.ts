import { range } from 'lodash-es';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const perPage = 15;

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
        ...BlogPostUrlFragment
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
        ...ChangelogEntryUrlFragment
        title
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
  [TagFragment, ResponsiveImageFragment, BlogPostUrlFragment, ChangelogEntryUrlFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const {
    meta: { count },
  } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query BuildSitemapUrls {
        meta: _allBlogPostsMeta {
          count
        }
      }
    `),
    { includeDrafts },
  );

  return range(2, 1 + Math.ceil(count / perPage)).map((i) => `/blog/p/${i}`);
};
