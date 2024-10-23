import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query PartnerQuery($partnerSlug: String!) {
      page: partner(filter: { slug: { eq: $partnerSlug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        id
        slug
        name
        shortDescription {
          value
        }
        logo {
          url
        }
        description {
          value
        }
        publicContactEmail
        websiteUrl
        areasOfExpertise {
          name
          slug
        }
        technologies {
          name
          slug
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
        ...PluginUrlFragment
        id
        title
        description
        releasedAt
        packageName
        coverImage {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, PluginUrlFragment],
);
