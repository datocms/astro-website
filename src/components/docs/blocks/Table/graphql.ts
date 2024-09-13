import { graphql } from '~/lib/datocms/graphql';

export const TableFragment = graphql(/* GraphQL */ `
  fragment TableFragment on TableRecord {
    id
    _modelApiKey
    table
  }
`);
