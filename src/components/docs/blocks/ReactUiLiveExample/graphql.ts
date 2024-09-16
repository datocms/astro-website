import { graphql } from '~/lib/datocms/graphql';

export const ReactUiLiveExampleFragment = graphql(/* GraphQL */ `
  fragment ReactUiLiveExampleFragment on ReactUiLiveExampleRecord {
    componentName
  }
`);
