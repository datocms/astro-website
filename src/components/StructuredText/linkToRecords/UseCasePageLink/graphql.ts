import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { graphql } from '~/lib/datocms/graphql';

export const UseCasePageLinkFragment = graphql(
  /* GraphQL */ `
    fragment UseCasePageLinkFragment on UseCasePageRecord {
      ...UseCasePageUrlFragment
    }
  `,
  [UseCasePageUrlFragment],
);
