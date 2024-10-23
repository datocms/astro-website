import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
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
        responsiveImage(imgixParams: { auto: format, w: 1000 }) {
          ...ResponsiveImageFragment
          width
        }
        lightboxImageUrl: url(imgixParams: { auto: format, w: 2000, fit: max })
      }
    }
  `,
  [ResponsiveImageFragment],
);
