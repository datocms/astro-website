import { HeroTeamMemberFragment } from '~/components/Hero';
import { TestimonialsReviewFragment } from '~/components/Testimonials';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

/*
 * The slider shows the quotes of the old about page: Jeff Escalante and
 * Marc Ammann. The team row of the hero shows the team members.
 */
export const query = graphql(
  /* GraphQL */ `
    query Philosophy {
      page: aboutPage {
        _seoMetaTags {
          ...TagFragment
        }
      }
      members: allTeamMembers {
        ...HeroTeamMemberFragment
      }
      review1: review(filter: { name: { eq: "Jeff Escalante" } }) {
        __typename
        ...TestimonialsReviewFragment
      }
      review2: review(filter: { name: { eq: "Marc Ammann" } }) {
        __typename
        ...TestimonialsReviewFragment
      }
    }
  `,
  [TagFragment, HeroTeamMemberFragment, TestimonialsReviewFragment],
);
