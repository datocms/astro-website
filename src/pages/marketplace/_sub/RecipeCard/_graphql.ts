import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { RecipeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/recipe';
import { graphql } from '~/lib/datocms/graphql';

export const RecipeCardFragment = graphql(
  /* GraphQL */ `
    fragment RecipeCardFragment on RecipeRecord {
      ...RecipeUrlFragment
      cardImage {
        responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
          ...ResponsiveImageFragment
        }
      }
      title
      cardDescription
    }
  `,
  [ResponsiveImageFragment, RecipeUrlFragment],
);
