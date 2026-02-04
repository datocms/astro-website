import { range } from 'lodash-es';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const perPage = 12;

export const query = graphql(
  /* GraphQL */ `
    query CustomerStories($limit: IntType!, $offset: IntType!) {
      page: customerStoriesIndex {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }

      posts: allCustomerStories(
        first: $limit
        skip: $offset
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...CustomerStoryUrlFragment
        title
        excerpt {
          value
        }
        coverImage {
          responsiveImage(imgixParams: { auto: format, w: 800, h: 450, fill: blur }) {
            ...ResponsiveImageFragment
          }
        }
        people {
          name
          title
          company
          avatar {
            responsiveImage(imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }

      _allCustomerStoriesMeta {
        count
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, CustomerStoryUrlFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const {
    meta: { count },
  } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query BuildSitemapUrls {
        meta: _allCustomerStoriesMeta {
          count
        }
      }
    `),
    executeQueryOptions,
  );

  return range(2, 1 + Math.ceil(count / perPage)).map(
    (i): SitemapEntry => ({ url: `/casual-chats/p/${i}` }),
  );
};
