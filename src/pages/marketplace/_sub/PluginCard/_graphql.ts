import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';

export const PluginCardFragment = graphql(
  /* GraphQL */ `
    fragment PluginCardFragment on PluginRecord {
      ...PluginUrlFragment
      coverImage {
        responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
          ...ResponsiveImageFragment
        }
      }
      title
      description
    }
  `,
  [ResponsiveImageFragment, PluginUrlFragment],
);
