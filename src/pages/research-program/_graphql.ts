import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { FaqBlockFragment } from '~/components/Faqs/graphql';

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
            ...FaqBlockFragment
          }
        }
        bottomCtaButtonLabel
      }
    }
  `,
  [TagFragment, FaqBlockFragment],
);
