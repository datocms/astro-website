import { graphql } from '~/lib/datocms/graphql';

export const RecipeInlineFragment = graphql(/* GraphQL */ `
  fragment RecipeInlineFragment on RecipeRecord {
    id
    title
  }
`);
