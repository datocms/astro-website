import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';

export const TemplateDemoLinkFragment = graphql(
  /* GraphQL */ `
    fragment TemplateDemoLinkFragment on TemplateDemoRecord {
      ...TemplateDemoUrlFragment
    }
  `,
  [TemplateDemoUrlFragment],
);
