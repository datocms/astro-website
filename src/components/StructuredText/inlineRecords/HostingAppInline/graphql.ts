import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { graphql } from '~/lib/datocms/graphql';

export const HostingAppInlineFragment = graphql(
  /* GraphQL */ `
    fragment HostingAppInlineFragment on HostingAppRecord {
      title
      ...HostingAppUrlFragment
    }
  `,
  [HostingAppUrlFragment],
);
