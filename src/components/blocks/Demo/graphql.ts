import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const DemoFragment = graphql(
  /* GraphQL */ `
    fragment DemoFragment on DemoRecord {
      id
      _modelApiKey
      demo {
        id
        name
        code
        githubRepo
        technology {
          name
          logo {
            url
            alt
          }
        }
        screenshot {
          width
          height
          croppedImage: responsiveImage(
            imgixParams: { auto: format, w: 450, h: 350, fit: crop, crop: top }
          ) {
            ...ResponsiveImageFragment
          }
          freeFormImage: responsiveImage(imgixParams: { auto: format, w: 450 }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
