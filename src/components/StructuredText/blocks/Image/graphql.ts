import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const ImageAssetFragment = graphql(
  /* GraphQL */ `
    fragment ImageAssetFragment on FileField {
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
  `,
  [ResponsiveImageFragment],
);

// The site shows imageNext (the image of the new product UI). When the
// editor did not set it, the site shows image.
export const ImageFragment = graphql(
  /* GraphQL */ `
    fragment ImageFragment on ImageRecord {
      frameless
      asset: image {
        ...ImageAssetFragment
      }
      nextAsset: imageNext {
        ...ImageAssetFragment
      }
    }
  `,
  [ImageAssetFragment],
);
