import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';

export const CustomerStoryLinkFragment = graphql(
  /* GraphQL */ `
    fragment CustomerStoryLinkFragment on CustomerStoryRecord {
      ...CustomerStoryUrlFragment
    }
  `,
  [CustomerStoryUrlFragment],
);
