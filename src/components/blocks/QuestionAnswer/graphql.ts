import { graphql } from '~/lib/datocms/graphql';

export const QuestionAnswerFragment = graphql(/* GraphQL */ `
  fragment QuestionAnswerFragment on QuestionAnswerRecord {
    question {
      value
    }
    answer {
      value
    }
  }
`);
