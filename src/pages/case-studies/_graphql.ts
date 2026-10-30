import { CaseStudyGridStoryFragment } from '~/components/CaseStudyGrid';
import { QuotePartnerTestimonialFragment } from '~/components/Quote';
import { StatsNumberFragment } from '~/components/Stats';
import { TextWithImageStoryFragment } from '~/components/TextWithImage';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

/* The quote between the two grids is the testimonial of Tim Chesney (Make). */
export const query = graphql(
  /* GraphQL */ `
    query SuccessStoriesIndex {
      page: successStoriesIndex {
        seo: _seoMetaTags {
          ...TagFragment
        }
        highlight {
          id
          numbers {
            ...StatsNumberFragment
          }
          ...TextWithImageStoryFragment
          ...SuccessStoryUrlFragment
        }
      }
      stories: allSuccessStories(first: 100, orderBy: position_ASC) {
        id
        ...CaseStudyGridStoryFragment
      }
      testimonial: partnerTestimonial(filter: { id: { eq: "EsPEhRwGSTOLU19hEPLVhg" } }) {
        ...QuotePartnerTestimonialFragment
      }
    }
  `,
  [
    TagFragment,
    StatsNumberFragment,
    TextWithImageStoryFragment,
    SuccessStoryUrlFragment,
    CaseStudyGridStoryFragment,
    QuotePartnerTestimonialFragment,
  ],
);
