import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query CustomersQuery {
      page: successStoriesIndex {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      posts: allSuccessStories {
        accentColor {
          hex
        }
        duotoneColor1 {
          hex
        }
        duotoneColor2 {
          hex
        }
        title {
          value
        }
        coverImage {
          url
          focalPoint {
            x
            y
          }
          responsiveImage(imgixParams: { auto: format, ar: "16:9", w: 1200, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        logo {
          url
        }
        ...SuccessStoryUrlFragment
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, SuccessStoryUrlFragment],
);
