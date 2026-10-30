import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

/** A card of CaseStudyGrid: the cover photo, the title, the subtitle and the logo of a story. */
export const CaseStudyGridStoryFragment = graphql(
  /* GraphQL */ `
    fragment CaseStudyGridStoryFragment on SuccessStoryRecord {
      id
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
        url(imgixParams: { auto: format, w: 1120, h: 770, fit: crop })
        alt
      }
      ...SuccessStoryUrlFragment
    }
  `,
  [SuccessStoryUrlFragment],
);
