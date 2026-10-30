import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { graphql } from '~/lib/datocms/graphql';

export const UseCasePageInlineFragment = graphql(
  /* GraphQL */ `
    fragment UseCasePageInlineFragment on UseCasePageRecord {
      title {
        value
      }
      ...UseCasePageUrlFragment
    }
  `,
  [UseCasePageUrlFragment],
);
