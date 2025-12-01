import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';

export const ShowcaseProjectBlockFragment = graphql(
  /* GraphQL */ `
    fragment ShowcaseProjectBlockFragment on ShowcaseProjectBlockRecord {
      showcaseProjects {
        ...ShowcaseProjectUrlFragment
        partner {
          name
          logo {
            url
            alt
          }
          shortDescription {
            value
          }
        }
        headline {
          value
        }
        technologies {
          name
          logo {
            url
            alt
          }
        }
        name
        projectUrl
        mainImage {
          responsiveImage(imgixParams: { auto: format, w: 850, ar: "3:2", fit: fill, fill: blur }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, ShowcaseProjectUrlFragment],
);
