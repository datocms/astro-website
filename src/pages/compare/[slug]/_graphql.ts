import {
  ComparisonTableAlternativeFragment,
  ComparisonTableComparisonFragment,
} from '~/components/ComparisonTable';
import { ReasonColumnsReasonFragment } from '~/components/ReasonColumns';
import {
  TestimonialsPartnerTestimonialFragment,
  TestimonialsReviewFragment,
} from '~/components/Testimonials';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  ProductComparisonUrlFragment,
  buildUrlForProductComparison,
} from '~/lib/datocms/gqlUrlBuilder/productComparison';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query Compare($slug: String!) {
      page: productComparison(filter: { slug: { eq: $slug } }) {
        _firstPublishedAt
        _publishedAt
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
        reasons {
          ...ReasonColumnsReasonFragment
        }
        importer {
          learnMoreSlug
          header
          description
        }
        testimonials {
          __typename
          ...TestimonialsReviewFragment
          ...TestimonialsPartnerTestimonialFragment
        }
        ...ComparisonTableComparisonFragment
      }
      alternatives: allProductComparisons(first: 100, orderBy: product_ASC) {
        ...ComparisonTableAlternativeFragment
      }
    }
  `,
  [
    TagFragment,
    ReasonColumnsReasonFragment,
    TestimonialsReviewFragment,
    TestimonialsPartnerTestimonialFragment,
    ComparisonTableComparisonFragment,
    ComparisonTableAlternativeFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allProductComparisons(first: 500) {
            _publishedAt
            ...ProductComparisonUrlFragment
          }
        }
      `,
      [ProductComparisonUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForProductComparison(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: productComparison(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
