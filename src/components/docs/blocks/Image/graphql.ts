import { graphql } from '~/lib/datocms/graphql';

export const ImageFragment = graphql(/* GraphQL */ `
  fragment ImageFragment on ImageRecord {
    id
    _modelApiKey
    frameless
    image {
      format
      width
      responsiveImage(imgixParams: { auto: format, w: 1000 }) {
        ...ResponsiveImageFragment
      }
      zoomableResponsiveImage: responsiveImage(imgixParams: { auto: format, w: 1500, fit: max }) {
        ...ResponsiveImageFragment
      }
      url
    }
  }
`);
