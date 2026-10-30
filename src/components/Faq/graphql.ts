import { graphql } from '~/lib/datocms/graphql';

/** A question of the FAQ, from the CMS. */
export const FaqQuestionFragment = graphql(/* GraphQL */ `
  fragment FaqQuestionFragment on FaqRecord {
    question
    answer {
      value
    }
  }
`);
