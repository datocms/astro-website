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
    }
    children {
      slug
    }
  }
`);

export const query = graphql(
  /* GraphQL */ `
    query SupportPage {
      topics: allSupportTopics(first: 100) {
        ...SupportTopicFragment
      }
    }
  `,
  [SupportTopicFragment],
);
