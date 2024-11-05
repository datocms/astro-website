import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const PartnerFragment = graphql(/* GraphQL */ `
  fragment PartnerFragment on PartnerRecord @_unmask {
    name
    slug
    logo {
      url
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
    _allReferencingShowcaseProjectsMeta {
      count
    }
  }
`);

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
