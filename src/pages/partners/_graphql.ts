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
      partners1: allPartners(first: 100) {
        ...PartnerFragment
      }
      partners2: allPartners(skip: 100, first: 100) {
        ...PartnerFragment
      }
      partners3: allPartners(skip: 200, first: 100) {
        ...PartnerFragment
      }
    }
  `,
  [TagFragment, PartnerFragment],
);
