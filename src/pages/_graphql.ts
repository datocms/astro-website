import { CaseStudiesStoryFragment } from '~/components/CaseStudies';
import { PartnersPartnerFragment } from '~/components/Partners';
import { ProductUpdatesItemFragment } from '~/components/ProductUpdates';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

/**
 * The SEO of the home page, the latest entries of the changelog (for
 * ProductUpdates), the latest success stories (for CaseStudies: two rows
 * of three cards) and the continents of all the partners (for Partners).
 */
export const query = graphql(
  /* GraphQL */ `
    query HomeQuery {
      page: homePage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        yoastAnalysis
      }
      productUpdates: allChangelogEntries(first: 6, orderBy: _firstPublishedAt_DESC) {
        ...ProductUpdatesItemFragment
      }
      successStories: allSuccessStories(first: 6, orderBy: _firstPublishedAt_DESC) {
        ...CaseStudiesStoryFragment
      }
      partners: allPartners(first: 1000) {
        ...PartnersPartnerFragment
      }
    }
  `,
  [TagFragment, ProductUpdatesItemFragment, CaseStudiesStoryFragment, PartnersPartnerFragment],
);
