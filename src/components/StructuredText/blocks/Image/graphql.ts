import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const ImageFragment = graphql(
  /* GraphQL */ `
    fragment ImageFragment on ImageRecord {
      frameless
      asset: image {
        format
        url
        title
        alt
        width
        height
        responsiveImage(imgixParams: { w: 1000 }) {
          ...ResponsiveImageFragment
        }
        lightboxImageUrl: url(imgixParams: { w: 2000, fit: max })
      }
    }
  `,
  [ResponsiveImageFragment],
);
