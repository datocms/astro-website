import { graphql, readFragment, type FragmentOf } from '../graphql';

export const RecipeUrlFragment = graphql(/* GraphQL */ `
  fragment RecipeUrlFragment on RecipeRecord {
    slug
  }
`);

export function buildUrlForRecipe(enterpriseApp: FragmentOf<typeof RecipeUrlFragment>) {
  const data = readFragment(RecipeUrlFragment, enterpriseApp);
  return `/marketplace/recipes/${data.slug}`;
}
