import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

/** A success story: the title, the subtitle, the logo and the cover photo. */
export const TextWithImageStoryFragment = graphql(
  /* GraphQL */ `
    fragment TextWithImageStoryFragment on SuccessStoryRecord {
      name
      title {
        value
      }
      subtitle {
        value
      }
      logo {
        url
        alt
        width
        height
      }
      coverImage {
        responsiveImage(imgixParams: { auto: format, ar: "3:2", w: 1200, fit: crop }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
