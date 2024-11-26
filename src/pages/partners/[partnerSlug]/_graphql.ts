import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { buildUrlForPartner, PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';
import { PluginCardFragment } from '~/pages/marketplace/_sub/PluginCard/_graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PartnerQuery($partnerSlug: String!) {
      page: partner(filter: { slug: { eq: $partnerSlug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        id
        name
        shortDescription {
          value
        }
        logo {
          url
          pngUrl: url(imgixParams: { fm: png, h: 200 })
        }
        description {
          value
        }
        publicContactEmail
        websiteUrl
        areasOfExpertise {
          name
        }
        technologies {
          name
        }
        locations {
          name
          emoji
          continent {
            name
          }
        }
        npmUser {
          id
        }
        projects: _allReferencingShowcaseProjects(first: 100, orderBy: position_ASC) {
          ...ShowcaseProjectUrlFragment
          name
          headline {
            value
          }
          technologies {
            name
            integrationType {
              slug
            }
            logo {
              url
            }
          }
          mainImage {
            responsiveImage(imgixParams: { auto: format, w: 750, h: 500, fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, ShowcaseProjectUrlFragment],
);

export const extraQuery = graphql(
  /* GraphQL */ `
    query PartnerExtraQuery($authorId: ItemId!) {
      plugins: allPlugins(
        filter: { author: { eq: $authorId }, manuallyDeprecated: { eq: false } }
        orderBy: installs_DESC
      ) {
        ...PluginCardFragment
      }
    }
  `,
  [ResponsiveImageFragment, PluginCardFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allPartners(first: 500) {
            ...PartnerUrlFragment
          }
        }
      `,
      [PartnerUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForPartner);
};
