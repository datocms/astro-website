import { TagFragment } from '~/lib/datocms/commonFragments';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

export const PartnerFragment = graphql(
  /* GraphQL */ `
    fragment PartnerFragment on PartnerRecord @_unmask {
      id
      name
      logo {
        url
        alt
        width
        height
      }
      shortDescription {
        value
      }
      areasOfExpertise {
        name
      }
      technologies {
        name
      }
      locations {
        emoji
        name
        code
        continent {
          name
        }
      }
      # The same projects as the page of the partner.
      _allReferencingShowcaseProjectsMeta(
        through: { fields: { anyIn: [showcaseProject_partner] } }
      ) {
        count
      }
      ...PartnerUrlFragment
    }
  `,
  [PartnerUrlFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query Partners {
      page: partnersPage {
        _seoMetaTags {
          ...TagFragment
        }
        highlightedPartners {
          ...PartnerFragment
        }
      }
      partners: allPartners(first: 1000) {
        ...PartnerFragment
      }
    }
  `,
  [TagFragment, PartnerFragment],
);
