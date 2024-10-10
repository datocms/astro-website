import {
  PartnerTestimonialQuoteFragment,
  ReviewQuoteFragment,
} from '~/components/quote/SingleQuote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const FeatureSection = graphql(
  /* GraphQL */ `
    fragment FeatureSection on FeatureRegularCardRecord {
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
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        heroImageRight {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        coreFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        editorExperienceFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        developerExperienceFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              __typename
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        imageVideoManagementFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        localizationFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        extensibilityFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        contentIntegrityFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        governanceAndComplianceFeature {
          ...FeatureSection
          ... on TestimonialCardRecord {
            __typename
            testimonial {
              ...PartnerTestimonialQuoteFragment
              ...ReviewQuoteFragment
            }
          }
        }
        securityAndInfrastructureFeature {
          ...FeatureSection
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
  [ResponsiveImageFragment, FeatureSection, TagFragment],
);
