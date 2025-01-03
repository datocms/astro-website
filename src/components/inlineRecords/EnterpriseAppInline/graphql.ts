import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { graphql } from '~/lib/datocms/graphql';

export const EnterpriseAppInlineFragment = graphql(
  /* GraphQL */ `
    fragment EnterpriseAppInlineFragment on EnterpriseAppRecord {
      title
      ...EnterpriseAppUrlFragment
    }
  `,
  [EnterpriseAppUrlFragment],
);
