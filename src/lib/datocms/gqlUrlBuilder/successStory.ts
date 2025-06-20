import { graphql, readFragment, type FragmentOf } from '../graphql';

export const SuccessStoryUrlFragment = graphql(/* GraphQL */ `
  fragment SuccessStoryUrlFragment on SuccessStoryRecord {
    slug
  }
`);

export function buildUrlForSuccessStory(successStory: FragmentOf<typeof SuccessStoryUrlFragment>) {
  const data = readFragment(SuccessStoryUrlFragment, successStory);
  return `/case-studies/${data.slug}`;
}
