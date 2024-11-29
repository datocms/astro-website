import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  ProductComparisonUrlFragment,
  buildUrlForProductComparison,
} from '~/lib/datocms/gqlUrlBuilder/productComparison';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query Compare($slug: String!) {
      page: productComparison(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        product
        datocmsCharacterization {
          value
        }
        competitorCharacterization {
          value
        }
        testimonials {
          __typename
          ... on PartnerTestimonialRecord {
            ...PartnerTestimonialQuoteFragment
          }
          ... on ReviewRecord {
            ...ReviewQuoteFragment
          }
        }
        topics {
          id
          topic
          differences {
            id
            datocmsTake {
              value
            }
            competitorTake {
              value
            }
          }
        }
        reasons {
          id
          title
          content {
            value
          }
        }
        importer {
          learnMoreSlug
          header
          description
        }
      }
    }
  `,
  [TagFragment, PartnerTestimonialQuoteFragment, ReviewQuoteFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allProductComparisons(first: 500) {
            ...ProductComparisonUrlFragment
          }
        }
      `,
      [ProductComparisonUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForProductComparison);
};
