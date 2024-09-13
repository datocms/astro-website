import { graphql } from '~/lib/datocms/graphql';

export const MultipleDemosBlockFragment = graphql(/* GraphQL */ `
  fragment MultipleDemosBlockFragment on MultipleDemosBlockRecord {
    id
    _modelApiKey
    demos {
      id
      name
      code
      technology {
        name
        logo {
          url
        }
      }
      screenshot {
        responsiveImage(imgixParams: { auto: format, w: 300, h: 200, fit: crop, crop: top }) {
          ...ResponsiveImageFragment
        }
      }
    }
  }
`);
