import { QuoteReviewFragment } from '~/components/Quote';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/*
 * The CMS content of a framework page: the projects of the carousel (the
 * showcase projects that reference the integration records of the
 * framework, newest first) and the review of the quote.
 * The rest of the page is in src/data/cms-<framework>.ts.
 */
export const query = graphql(
  /* GraphQL */ `
    query CmsFramework($integrations: [String], $reviewId: ItemId) {
      integrations: allIntegrations(filter: { slug: { in: $integrations } }) {
        showcaseProjects: _allReferencingShowcaseProjects(orderBy: _createdAt_DESC, first: 12) {
          id
          _createdAt
          name
          partner {
            name
          }
          ...ShowcaseProjectUrlFragment
          image: mainImage {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
      review(filter: { id: { eq: $reviewId } }) {
        __typename
        ...QuoteReviewFragment
      }
    }
  `,
  [ResponsiveImageFragment, QuoteReviewFragment, ShowcaseProjectUrlFragment],
);

/** The slugs of the framework pages, in the order of the footer. */
export const slugs = ['astro-cms', 'nextjs-cms', 'nuxtjs-cms', 'svelte-cms'];

export const buildSitemapUrls: BuildSitemapUrlsFn = async () =>
  slugs.map((slug) => ({ url: `/cms/${slug}` }));

// The landing page records of the CMS keep the links to these pages from
// Structured Text across the site. The Astro page has no record.
export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: landingPage(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
