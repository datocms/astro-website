import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

export const SuccessStoryInlineFragment = graphql(
  /* GraphQL */ `
    fragment SuccessStoryInlineFragment on SuccessStoryRecord {
      name
      ...SuccessStoryUrlFragment
    }
  `,
  [SuccessStoryUrlFragment],
);
