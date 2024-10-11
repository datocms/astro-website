import { graphql, readFragment, type FragmentOf } from '../graphql';

export const HostingAppUrlFragment = graphql(/* GraphQL */ `
  fragment HostingAppUrlFragment on HostingAppRecord {
    slug
  }
`);

export function buildUrlForHostingApp(hostingApp: FragmentOf<typeof HostingAppUrlFragment>) {
  const data = readFragment(HostingAppUrlFragment, hostingApp);
  return `/marketplace/hosting/${data.slug}`;
}
