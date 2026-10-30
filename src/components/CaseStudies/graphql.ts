import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

/** A card of CaseStudies: the logo and the title of a success story. */
export const CaseStudiesStoryFragment = graphql(
  /* GraphQL */ `
    fragment CaseStudiesStoryFragment on SuccessStoryRecord {
      id
      name
      title {
        value
      }
      logo {
        url
        alt
        width
        height
      }
      ...SuccessStoryUrlFragment
    }
  `,
  [SuccessStoryUrlFragment],
);
