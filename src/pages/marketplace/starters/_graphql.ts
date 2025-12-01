import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query StartersQuery {
      starters: allTemplateDemos(first: 100, orderBy: position_ASC) {
        ...TemplateDemoUrlFragment
        id
        name
        cmsDescription
        code
        starterType
        badge {
          name
          emoji
        }
        label
        githubRepo
        technology {
          name
          logo {
            url
            alt
          }
          squareLogo {
            url
            alt
          }
        }
        screenshot {
          responsiveImage(imgixParams: { auto: format, w: 700, h: 400, fit: crop, crop: top }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, TemplateDemoUrlFragment],
);
