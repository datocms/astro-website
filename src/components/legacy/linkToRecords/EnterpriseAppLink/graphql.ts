import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { graphql } from '~/lib/datocms/graphql';

export const EnterpriseAppLinkFragment = graphql(
  /* GraphQL */ `
    fragment EnterpriseAppLinkFragment on EnterpriseAppRecord {
      ...EnterpriseAppUrlFragment
    }
  `,
  [EnterpriseAppUrlFragment],
);
