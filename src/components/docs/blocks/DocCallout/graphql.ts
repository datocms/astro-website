import { graphql } from '~/lib/datocms/graphql';

export const DocCalloutFragment = graphql(/* GraphQL */ `
  fragment DocCalloutFragment on DocCalloutRecord {
    id
    _modelApiKey
    calloutType
    title
    text {
      value
    }
  }
`);
