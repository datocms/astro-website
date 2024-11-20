import { ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Features {
      page: aboutPage {
        _seoMetaTags {
          ...TagFragment
        }
      }
      members: allTeamMembers {
        name
        role
        avatar {
          responsiveImage(imgixParams: { auto: format, w: 480, h: 360, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
      review1: review(filter: { name: { eq: "Jeff Escalante" } }) {
        __typename
        ...ReviewQuoteFragment
      }
      review2: review(filter: { name: { eq: "Marc Ammann" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [ResponsiveImageFragment, TagFragment, ReviewQuoteFragment],
);
