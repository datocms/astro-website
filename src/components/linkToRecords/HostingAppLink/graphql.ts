import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { graphql } from '~/lib/datocms/graphql';

export const HostingAppLinkFragment = graphql(
  /* GraphQL */ `
    fragment HostingAppLinkFragment on HostingAppRecord {
      ...HostingAppUrlFragment
    }
  `,
  [HostingAppUrlFragment],
);
