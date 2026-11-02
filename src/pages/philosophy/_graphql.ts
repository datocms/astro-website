import { HeroTeamMemberFragment } from '~/components/Hero';
import { QuoteReviewFragment } from '~/components/Quote';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

/*
 * The quote between the principles is the review of Jeff Escalante
 * (HashiCorp) about a small, bootstrapped company that listens. The team row
 * of the hero shows the team members.
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
      review(filter: { id: { eq: "39832302" } }) {
        __typename
        ...QuoteReviewFragment
      }
    }
  `,
  [TagFragment, HeroTeamMemberFragment, QuoteReviewFragment],
);
