import { TagFragment } from '~/lib/datocms/commonFragments';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
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
          name
          slug
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
  [TagFragment, ResponsiveImageFragment],
);
