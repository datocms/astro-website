import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { graphql } from '~/lib/datocms/graphql';

export const FeatureCardFragment = graphql(
  /* GraphQL */ `
    fragment FeatureCardFragment on OverviewFeatureRecord {
      title
      icon {
        url
      }
      description {
        value
      }
      highlight
      image {
        responsiveImage(imgixParams: { auto: format, fit: fill, w: 640, h: 360 }) {
          ...ResponsiveImageFragment
        }
      }
      link {
        __typename
        ...DocPageUrlFragment
        ...FeatureUrlFragment
      }
      featureGroup
    }
  `,
  [ResponsiveImageFragment, DocPageUrlFragment, FeatureUrlFragment],
);
