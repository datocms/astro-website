import { RecipeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/recipe';
import { graphql } from '~/lib/datocms/graphql';

export const RecipeInlineFragment = graphql(
  /* GraphQL */ `
    fragment RecipeInlineFragment on RecipeRecord {
      title
      ...RecipeUrlFragment
    }
  `,
  [RecipeUrlFragment],
);
