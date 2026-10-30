import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';

export const ShowcaseProjectBlockFragment = graphql(
  /* GraphQL */ `
    fragment ShowcaseProjectBlockFragment on ShowcaseProjectBlockRecord {
      showcaseProjects {
        id
        ...ShowcaseProjectUrlFragment
        partner {
          name
          logo {
            url
            alt
          }
        }
        headline {
          value
        }
        name
        mainImage {
          responsiveImage(imgixParams: { w: 850, ar: "3:2", fit: fill, fill: blur }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, ShowcaseProjectUrlFragment],
);
