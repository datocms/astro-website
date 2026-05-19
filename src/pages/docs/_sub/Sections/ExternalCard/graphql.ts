import { graphql } from '~/lib/datocms/graphql';

export const ExternalCardFragment = graphql(/* GraphQL */ `
  fragment ExternalCardFragment on DocsHomeExternalCardBlockRecord {
    id
    title
    url
    description
    ctaLabel
    badge
  }
`);
