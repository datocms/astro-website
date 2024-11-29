import { graphql } from '~/lib/datocms/graphql';

export const DocCalloutFragment = graphql(/* GraphQL */ `
  fragment DocCalloutFragment on DocCalloutRecord {
    calloutType
    title
    text {
      value
    }
  }
`);
