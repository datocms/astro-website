import { graphql } from '~/lib/datocms/graphql';

/** The challenge and the result of a success story. */
export const ChallengeSolutionStoryFragment = graphql(/* GraphQL */ `
  fragment ChallengeSolutionStoryFragment on SuccessStoryRecord {
    challenge {
      value
    }
    result {
      value
    }
  }
`);
