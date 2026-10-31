import { QuoteReviewFragment } from '~/components/Quote';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/*
 * The CMS content of a framework page: the sites of the carousel (the
 * websites and the showcase projects that reference the integration
 * records of the framework, newest first) and the review of the quote.
 * The rest of the page is in src/data/cms-<framework>.ts.
 */
export const query = graphql(
  /* GraphQL */ `
    query CmsFramework($integrations: [String], $reviewId: ItemId) {
      integrations: allIntegrations(filter: { slug: { in: $integrations } }) {
        websites: _allReferencingWebsites(orderBy: _createdAt_DESC, first: 12) {
          id
          _createdAt
          title
          url
          image {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
        }
        showcaseProjects: _allReferencingShowcaseProjects(
          filter: { projectUrl: { isBlank: false } }
          orderBy: _createdAt_DESC
          first: 12
        ) {
          id
          _createdAt
          title: name
          url: projectUrl
          image: mainImage {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
      review(filter: { id: { eq: $reviewId } }) {
        ...QuoteReviewFragment
      }
    }
  `,
  [ResponsiveImageFragment, QuoteReviewFragment],
);

/** The slugs of the framework pages, in the order of the footer. */
export const slugs = ['nextjs-cms', 'nuxtjs-cms', 'svelte-cms', 'astro-cms'];

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
