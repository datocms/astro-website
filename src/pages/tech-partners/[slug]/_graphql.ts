import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  TechPartnerUrlFragment,
  buildUrlForTechPartner,
} from '~/lib/datocms/gqlUrlBuilder/techPartner';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      page: techPartner(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        name
        logo {
          url
          alt
          width
          height
          pngUrl: url(imgixParams: { fm: png, h: 200 })
        }
        shortDescription {
          value
        }
        description {
          value
        }
        publicContactEmail
        websiteUrl
      }
    }
  `,
  [TagFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allTechPartners(first: 500) {
            ...TechPartnerUrlFragment
          }
        }
      `,
      [TechPartnerUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForTechPartner);
};
