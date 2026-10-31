import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ResearchProgramPage {
      page: researchProgramPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        heroCtaLabel
        ctaUrl
        steps {
          ... on ProcessStepBlockRecord {
            id
            title
            body {
              value
            }
          }
        }
        faqs {
          ... on QuestionAnswerRecord {
            id
            question {
              value
            }
            answer {
              value
            }
          }
        }
        bottomCtaButtonLabel
      }
    }
  `,
  [TagFragment],
);
