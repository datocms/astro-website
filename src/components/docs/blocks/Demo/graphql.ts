import { graphql } from '~/lib/datocms/graphql';

export const DemoFragment = graphql(/* GraphQL */ `
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
        }
      }
      screenshot {
        responsiveImage(imgixParams: { auto: format, w: 450, h: 350, fit: crop, crop: top }) {
          ...ResponsiveImageFragment
        }
      }
    }
  }
`);
