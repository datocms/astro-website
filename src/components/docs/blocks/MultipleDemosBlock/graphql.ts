import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';

export const MultipleDemosBlockFragment = graphql(
  /* GraphQL */ `
    fragment MultipleDemosBlockFragment on MultipleDemosBlockRecord {
      demos {
        name
        cmsDescription
        badge {
          name
          emoji
        }
        label
        screenshot {
          responsiveImage(imgixParams: { auto: format, w: 600, ar: "3:2", fit: crop, crop: top }) {
            ...ResponsiveImageFragment
          }
        }
        ...TemplateDemoUrlFragment
      }
    }
  `,
  [ResponsiveImageFragment, TemplateDemoUrlFragment],
);
