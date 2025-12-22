import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const ImageCarouselFragment = graphql(
  /* GraphQL */ `
    fragment ImageCarouselFragment on ImageCarouselRecord {
      carouselHeight
      gallery {
        format
        url
        title
        alt
        width
        responsiveImage(imgixParams: { auto: format, w: 1000 }) {
          ...ResponsiveImageFragment
          width
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
