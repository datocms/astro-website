import { useCaseTargets } from '~/lib/retiredRoutes';
import { graphql, readFragment, type FragmentOf } from '../graphql';

export const UseCasePageUrlFragment = graphql(/* GraphQL */ `
  fragment UseCasePageUrlFragment on UseCasePageRecord {
    slug
  }
`);

export function buildUrlForUseCasePage(useCasePage: FragmentOf<typeof UseCasePageUrlFragment>) {
  const data = readFragment(UseCasePageUrlFragment, useCasePage);
  return useCaseTargets[data.slug ?? ''] ?? '/case-studies';
}
