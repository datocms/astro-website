import { graphql, readFragment, type FragmentOf } from '../graphql';

export const HostingAppUrlFragment = graphql(/* GraphQL */ `
  fragment HostingAppUrlFragment on HostingAppRecord {
    slug
  }
`);

// Some hosting apps have a docs page with a different slug.
// Keep this map the same as the redirects in astro.config.ts.
const docsSlug: Record<string, string> = { zeit: 'vercel' };

export function buildUrlForHostingApp(hostingApp: FragmentOf<typeof HostingAppUrlFragment>) {
  const data = readFragment(HostingAppUrlFragment, hostingApp);
  return `/docs/hosting-and-deployment/${docsSlug[data.slug] ?? data.slug}`;
}
