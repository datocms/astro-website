import { graphql, readFragment, type FragmentOf } from '../graphql';

export const CustomerStoryUrlFragment = graphql(/* GraphQL */ `
  fragment CustomerStoryUrlFragment on CustomerStoryRecord {
    slug
  }
`);

export function buildUrlForCustomerStory(
  customerStory: FragmentOf<typeof CustomerStoryUrlFragment>,
) {
  const data = readFragment(CustomerStoryUrlFragment, customerStory);
  return `/customer-stories/${data.slug}`;
}
