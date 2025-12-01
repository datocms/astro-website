import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';

export const UseCaseExcerptsFragment = graphql(
  /* GraphQL */ `
    fragment UseCaseExcerptsFragment on SuccessStoryRecord @_unmask {
      accentColor {
        hex
      }
      duotoneColor1 {
        hex
      }
      duotoneColor2 {
        hex
      }
      title {
        value
      }
      slug
      logo {
        url
        alt
      }
      ...SuccessStoryUrlFragment
    }
  `,
  [SuccessStoryUrlFragment],
);
