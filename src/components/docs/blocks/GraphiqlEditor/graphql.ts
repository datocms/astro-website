import { graphql } from '~/lib/datocms/graphql';

export const GraphiqlEditorFragment = graphql(/* GraphQL */ `
  fragment GraphiqlEditorFragment on GraphiqlEditorRecord {
    id
    _modelApiKey
    query
  }
`);
