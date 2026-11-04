import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { graphql } from '~/lib/datocms/graphql';

/*
 * The screenshot fills the window: at most 760px wide (the block of
 * 820px less its padding). A crop of 16:10 from the top keeps the window
 * the same shape for all the starters.
 */
export const DemoFragment = graphql(
  /* GraphQL */ `
    fragment DemoFragment on DemoRecord {
      id
      _modelApiKey
      demo {
        id
        name
        cmsDescription
        githubRepo
        technology {
          name
          logo {
            url
            alt
            width
            height
          }
        }
        screenshot {
          responsiveImage(imgixParams: { auto: format, w: 760, h: 475, fit: crop, crop: top }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
