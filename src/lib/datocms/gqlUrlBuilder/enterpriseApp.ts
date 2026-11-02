import { graphql, readFragment, type FragmentOf } from '../graphql';

export const EnterpriseAppUrlFragment = graphql(/* GraphQL */ `
  fragment EnterpriseAppUrlFragment on EnterpriseAppRecord {
    slug
  }
`);

// Some enterprise apps have a docs page with a different slug.
// Keep this map the same as the redirects in astro.config.ts.
const docsSlug: Record<string, string> = { 'azure-active-directory': 'microsoft-entra-id' };

export function buildUrlForEnterpriseApp(
  enterpriseApp: FragmentOf<typeof EnterpriseAppUrlFragment>,
) {
  const data = readFragment(EnterpriseAppUrlFragment, enterpriseApp);
  return `/docs/enterprise-apps/${docsSlug[data.slug] ?? data.slug}`;
}
