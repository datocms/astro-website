import { graphql, readFragment, type FragmentOf } from '../graphql';

export const ShowcaseProjectUrlFragment = graphql(/* GraphQL */ `
  fragment ShowcaseProjectUrlFragment on ShowcaseProjectRecord {
    slug
    partner {
      slug
    }
  }
`);

export function buildUrlForShowcaseProject(
  showcaseProject: FragmentOf<typeof ShowcaseProjectUrlFragment>,
) {
  const data = readFragment(ShowcaseProjectUrlFragment, showcaseProject);
  return `/partners/${data.partner.slug}/showcase/${data.slug}`;
}
