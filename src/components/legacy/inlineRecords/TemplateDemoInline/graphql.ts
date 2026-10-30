import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';

export const TemplateDemoInlineFragment = graphql(
  /* GraphQL */ `
    fragment TemplateDemoInlineFragment on TemplateDemoRecord {
      name
      ...TemplateDemoUrlFragment
    }
  `,
  [TemplateDemoUrlFragment],
);
