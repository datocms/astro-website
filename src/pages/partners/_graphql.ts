import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

const PartnerRecordFragment = graphql(/* GraphQL */ `
  fragment PartnerRecordFragment on PartnerRecord @_unmask {
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
          ...PartnerRecordFragment
        }
      }
      posts1: allPartners(first: 100) {
        ...PartnerRecordFragment
      }
      posts2: allPartners(skip: 100, first: 100) {
        ...PartnerRecordFragment
      }
      posts3: allPartners(skip: 200, first: 100) {
        ...PartnerRecordFragment
      }
    }
  `,
  [TagFragment, PartnerRecordFragment],
);
