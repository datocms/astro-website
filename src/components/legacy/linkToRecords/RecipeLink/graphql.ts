import { RecipeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/recipe';
import { graphql } from '~/lib/datocms/graphql';

export const RecipeLinkFragment = graphql(
  /* GraphQL */ `
    fragment RecipeLinkFragment on RecipeRecord {
      ...RecipeUrlFragment
    }
  `,
  [RecipeUrlFragment],
);
