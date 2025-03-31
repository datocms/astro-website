import { executeQueryWithAutoPagination } from '@datocms/cda-client';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { dataSource } from '~/lib/dataSource';
import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docGroup';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { UserGuidesChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuidesChapter';
import { graphql } from '~/lib/datocms/graphql';

export const ManagedGroupFragment = graphql(/* GraphQL */ `
  fragment ManagedGroupFragment on ManagedNavigationBarGroupRecord @_unmask {
    title
    callToAction {
      url
      label
    }
  }
`);

export const FreeformGroupFragment = graphql(/* GraphQL */ `
  fragment FreeformGroupFragment on FreeformNavigationBarGroupRecord @_unmask {
    title
    links {
      label
      url
      description
    }
    callToAction {
      url
      label
    }
  }
`);

export const CtaFragment = graphql(/* GraphQL */ `
  fragment CtaFragment on NavigationBarCtaRecord @_unmask {
    title
    description
    callToAction {
      url
      label
    }
  }
`);

const query = graphql(
  /* GraphQL */ `
    query Navbar {
      partners: allPartners(first: 1000) {
        id
        locations {
          continent {
            name
          }
        }
      }
      navigationBar {
        productGroup {
          ...FreeformGroupFragment
        }
        featuresGroup {
          ...FreeformGroupFragment
        }
        whoIsItForGroup {
          ...FreeformGroupFragment
        }
        helpGroup {
          ...FreeformGroupFragment
        }
        marketplaceGroup {
          ...FreeformGroupFragment
        }
        knowledgeGroup {
          ...FreeformGroupFragment
        }
        useCasesGroup {
          ...ManagedGroupFragment
        }
        useCases {
          navigationBarTitle
          ...UseCasePageUrlFragment
        }
        customerChatsGroup {
          ...ManagedGroupFragment
        }
        customerChats {
          title
          excerpt {
            value
          }
          coverImage {
            responsiveImage(imgixParams: { w: 350, h: 150, fit: clamp }) {
              ...ResponsiveImageFragment
            }
          }
          ...CustomerStoryUrlFragment
        }
        enterpriseStoriesGroup {
          ...ManagedGroupFragment
        }
        enterpriseStories {
          name
          logo {
            url
          }
          title {
            value
          }
          ...SuccessStoryUrlFragment
        }
        wallOfLoveQuote {
          __typename
          ... on PartnerTestimonialRecord {
            ...PartnerTestimonialQuoteFragment
          }
          ... on ReviewRecord {
            ...ReviewQuoteFragment
          }
        }
        partnerProjectsGroup {
          ...ManagedGroupFragment
        }
        partnerProjects {
          name
          headline {
            value
          }
          partner {
            name
          }
          mainImage {
            responsiveImage(imgixParams: { w: 200, ar: "16:9", fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
          ...ShowcaseProjectUrlFragment
        }
        docGroup {
          ...ManagedGroupFragment
        }
        docPages {
          name
          ...DocGroupUrlFragment
        }
        videoGuidesGroup {
          ...ManagedGroupFragment
        }
        videoGuides {
          title
          chapters: videos {
            id
            thumbTimeSeconds
            title
            asset: video {
              video {
                thumbnailUrl
                width
                height
                blurUpThumb
                duration
              }
            }
          }
          ...UserGuidesChapterUrlFragment
        }
        blogGroup {
          ...ManagedGroupFragment
        }

        partnersGroup {
          ...ManagedGroupFragment
        }
        partnersDescription
        productCallToAction {
          ...CtaFragment
        }
        customersCallToAction {
          ...CtaFragment
        }
        partnersCallToAction {
          ...CtaFragment
        }
      }
      blogPosts: allBlogPosts(
        first: 4
        orderBy: _firstPublishedAt_DESC
        filter: { _firstPublishedAt: { exists: true } }
      ) {
        title
        _firstPublishedAt
        ...BlogPostUrlFragment
      }
    }
  `,
  [
    CustomerStoryUrlFragment,
    SuccessStoryUrlFragment,
    ReviewQuoteFragment,
    PartnerTestimonialQuoteFragment,
    ResponsiveImageFragment,
    ShowcaseProjectUrlFragment,
    DocGroupUrlFragment,
    UserGuidesChapterUrlFragment,
    BlogPostUrlFragment,
    UseCasePageUrlFragment,
    ManagedGroupFragment,
    FreeformGroupFragment,
    CtaFragment,
  ],
);

export type NavbarData = typeof query extends TadaDocumentNode<infer X> ? X : never;

export const [fetchNavbar, maybeInvalidateNavbar] = dataSource('navbar', async () => {
  return await executeQueryWithAutoPagination(query, {
    returnCacheTags: true,
    excludeInvalid: true,
    token: DATOCMS_API_TOKEN,
  });
});
