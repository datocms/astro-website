import { FeatureCategoryEntryFragment } from '~/components/FeatureCategory';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

// The page does not render the other block of the groups
// (TestimonialCardRecord), thus the query asks only for its type.
export const query = graphql(
  /* GraphQL */ `
    query Features {
      page: featuresIndex {
        _seoMetaTags {
          ...TagFragment
        }
        coreFeaturesBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        editorExperienceBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        developerExperienceBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        imageVideoManagementBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        localizationBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        extensibilityBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        contentIntegrityBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        governanceAndComplianceBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
        securityAndInfrastructureBlocks {
          __typename
          ...FeatureCategoryEntryFragment
        }
      }
    }
  `,
  [FeatureCategoryEntryFragment, TagFragment],
);
