import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(/* GraphQL */ `
  query PartnerProgram {
    page: homePage {
      id
    }
    faqs: allFaqs {
      id
      question
      answer {
        value
      }
    }
  }
`);
