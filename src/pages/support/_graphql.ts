import { graphql } from '~/lib/datocms/graphql';

export const SupportTopicFragment = graphql(/* GraphQL */ `
  fragment SupportTopicFragment on SupportTopicRecord @_unmask {
    slug
    title
    parent {
      slug
    }
    subtopicQuestion
    commonQuestions {
      title
      url
    }
    disableContactForm
    contactFormType
    autoResponderType
    description {
      value
      links {
        ... on RecordInterface {
          id
          __typename
        }
      }
    }
    children {
      slug
    }
  }
`);

export const query = graphql(
  /* GraphQL */ `
    query SupportPage {
      topics: allSupportTopics(first: 500) {
        ...SupportTopicFragment
      }
    }
  `,
  [SupportTopicFragment],
);
