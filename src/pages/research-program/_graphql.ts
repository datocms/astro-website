import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(/* GraphQL */ `
  query ResearchProgramHome {
    page: researchProgramHome {
      studies {
        title
        text {
          value
        }
        link
        linkLabel
      }
      faqs {
        question
        answer {
          value
        }
      }
    }
  }
`);
