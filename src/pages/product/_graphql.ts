import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Product {
      integrations: allIntegrations(first: 100) {
        id
        logo {
          url
          alt
        }
        integrationType {
          slug
        }
        squareLogo {
          url
          alt
        }
      }
      page: productOverview {
        _seoMetaTags {
          ...TagFragment
        }
        header {
          value
        }
        subheader {
          value
        }
      }
      customerStories: allCustomerStories(
        first: 15
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...CustomerStoryUrlFragment
        title
        coverImage {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fill: blur, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
      useCases: allUseCasePages(first: 4, orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]) {
        ...UseCasePageUrlFragment
        title: navigationBarTitle
        subtitle {
          value
        }
        heroCustomer {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fill: blur, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, TagFragment, CustomerStoryUrlFragment, UseCasePageUrlFragment],
);
