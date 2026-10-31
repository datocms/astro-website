import type { AstroGlobal } from 'astro';
import type { FragmentOf } from 'gql.tada';
import type { ComponentProps } from 'react';
import type { DraftModeQueryListener } from '~/components/DraftModeQueryListener';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { docGroupQuery, type GroupLayoutFragment } from './_graphql';

export { default as GroupLayout } from './Component.astro';

export async function findGroup(
  Astro: AstroGlobal,
  groupSlug: string,
): Promise<
  | undefined
  | [
      FragmentOf<typeof GroupLayoutFragment>,
      ComponentProps<typeof DraftModeQueryListener<any, any>>[],
    ]
> {
  const { group } = await executeQuery(Astro, docGroupQuery, { variables: { groupSlug } });

  if (!group) {
    return undefined;
  }

  return [group, [{ query: docGroupQuery, variables: { groupSlug } }]];
}
