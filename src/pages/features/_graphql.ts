import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { UserGuideEpisodeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuideEpisode';
import { graphql } from '~/lib/datocms/graphql';

const FeatureSectionFragment = graphql(
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
          ...BlogPostUrlFragment
          ...ChangelogEntryUrlFragment
          ...DocPageUrlFragment
          ...FeatureUrlFragment
          ...PluginUrlFragment
          ...TemplateDemoUrlFragment
          ...UserGuideEpisodeUrlFragment
          ...HostingAppUrlFragment
          ...EnterpriseAppUrlFragment
        }
      }
    }
  `,
  [
    ResponsiveImageFragment,
    PartnerTestimonialQuoteFragment,
    ReviewQuoteFragment,
    BlogPostUrlFragment,
    ChangelogEntryUrlFragment,
    DocPageUrlFragment,
    FeatureUrlFragment,
    PluginUrlFragment,
    TemplateDemoUrlFragment,
    UserGuideEpisodeUrlFragment,
    HostingAppUrlFragment,
    EnterpriseAppUrlFragment,
  ],
);

const TestimonialCardFragment = graphql(
  /* GraphQL */ `
    fragment TestimonialCardFragment on TestimonialCardRecord @_unmask {
      __typename
      testimonial {
        __typename
        ...PartnerTestimonialQuoteFragment
        ...ReviewQuoteFragment
      }
    }
  `,
  [PartnerTestimonialQuoteFragment, ReviewQuoteFragment],
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
          ...TestimonialCardFragment
        }
        editorExperienceBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        developerExperienceBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        imageVideoManagementBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        localizationBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        extensibilityBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        contentIntegrityBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        governanceAndComplianceBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
        securityAndInfrastructureBlocks {
          ...FeatureSectionFragment
          ...TestimonialCardFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment, FeatureSectionFragment, TestimonialCardFragment, TagFragment],
);
