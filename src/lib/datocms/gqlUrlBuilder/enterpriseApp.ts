import { graphql, readFragment, type FragmentOf } from '../graphql';

export const EnterpriseAppUrlFragment = graphql(/* GraphQL */ `
  fragment EnterpriseAppUrlFragment on EnterpriseAppRecord {
    slug
  }
`);

export function buildUrlForEnterpriseApp(
  enterpriseApp: FragmentOf<typeof EnterpriseAppUrlFragment>,
) {
  const data = readFragment(EnterpriseAppUrlFragment, enterpriseApp);
  return `/marketplace/enterprise/${data.slug}`;
}
