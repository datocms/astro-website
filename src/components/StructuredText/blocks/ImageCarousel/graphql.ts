import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const ImageCarouselFragment = graphql(
  /* GraphQL */ `
    fragment ImageCarouselFragment on ImageCarouselRecord {
      carouselHeight
      gallery {
        id
        alt
        width
        height
        responsiveImage(imgixParams: { w: 1000 }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
