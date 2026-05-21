import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ResearchProgramPage {
      page: researchProgramPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        heroKicker
        heroTitle {
          value
        }
        heroSubtitle
        heroCtaLabel
        heroCtaUrl
        journeyTitle
        journeySubtitle
        step1Title
        step1Body
        step2Title
        step2Body
        step3Title
        step3Body
        faqSectionTitle
        faqs {
          ... on ResearchFaqItemRecord {
            id
            question
            answer {
              value
            }
          }
        }
        bottomCtaTitle {
          value
        }
        bottomCtaBody
        bottomCtaButtonLabel
        bottomCtaButtonUrl
      }
    }
  `,
  [TagFragment],
);
