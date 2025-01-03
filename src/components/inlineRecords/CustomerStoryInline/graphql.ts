import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';

export const CustomerStoryInlineFragment = graphql(
  /* GraphQL */ `
    fragment CustomerStoryInlineFragment on CustomerStoryRecord {
      title
      ...CustomerStoryUrlFragment
    }
  `,
  [CustomerStoryUrlFragment],
);
