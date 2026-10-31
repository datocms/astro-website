import { graphql } from '~/lib/datocms/graphql';

// Recipes have no page. The link needs only the ID.
export const RecipeLinkFragment = graphql(/* GraphQL */ `
  fragment RecipeLinkFragment on RecipeRecord {
    id
  }
`);
