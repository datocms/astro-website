import { graphql } from '~/lib/datocms/graphql';
import { RecipeCardFragment } from '../_sub/RecipeCard/_graphql';

export const query = graphql(
  /* GraphQL */ `
    query Enterprise {
      items: allRecipes(first: 100) {
        ...RecipeCardFragment
      }
    }
  `,
  [RecipeCardFragment],
);
