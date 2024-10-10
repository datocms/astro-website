import {
  PartnerTestimonialQuoteFragment,
  ReviewQuoteFragment,
} from '~/components/quote/SingleQuote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const FeatureSectionFragment = graphql(
  /* GraphQL */ `
    fragment FeatureSectionFragment on FeatureRegularCardRecord @_unmask {
      __typename
      title
      description {
        value
      }
      image {
        responsiveImage(imgixParams: { auto: format, w: 1400 }) {
          ...ResponsiveImageFragment
        }
      }
      links {
        linkTitle
        content {
          __typename
          ... on BlogPostRecord {
            slug
          }
          ... on ChangelogEntryRecord {
            slug
          }
          ... on DocPageRecord {
            parent: _allReferencingDocGroups {
              slug
            }
            slug
          }
          ... on FeatureRecord {
            slug
          }
          ... on PluginRecord {
            packageName
          }
          ... on TemplateDemoRecord {
            code
          }
          ... on UserGuidesVideoRecord {
            chapters: _allReferencingUserGuidesChapters {
              slug
            }
            slug
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, PartnerTestimonialQuoteFragment, ReviewQuoteFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query Features {
      page: featuresIndex {
        _seoMetaTags {
          ...TagFragment
        }
        title {
          value
        }
        subtitle {
          value
        }
        heroImageLeft {
          responsiveImage(imgixParams: { auto: format, w: 1000 }) {
            ...ResponsiveImageFragment
          }
        }
        heroImageRight {
          responsiveImage(imgixParams: { auto: format, w: 1000 }) {
            ...ResponsiveImageFragment
          }
        }
        coreFeaturesBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        editorExperienceBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        developerExperienceBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              __typename
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        imageVideoManagementBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        localizationBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        extensibilityBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        contentIntegrityBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        governanceAndComplianceBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        securityAndInfrastructureBlocks {
          ...FeatureSectionFragment
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, FeatureSectionFragment, TagFragment],
);
