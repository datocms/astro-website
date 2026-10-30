import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

export const SuccessStoryLinkFragment = graphql(
  /* GraphQL */ `
    fragment SuccessStoryLinkFragment on SuccessStoryRecord {
      ...SuccessStoryUrlFragment
    }
  `,
  [SuccessStoryUrlFragment],
);
