import type { AstroGlobal } from 'astro';
import type { FragmentOf } from 'gql.tada';
import type { ComponentProps } from 'react';
import type { DraftModeQueryListener } from '~/components/DraftModeQueryListener';
import { executeQuery } from '~/lib/datocms/executeQuery';
import type { GroupLayoutFragment } from '../GroupLayout/_graphql';
import { docGroupQuery, docPageQuery, PageLayoutFragment } from './_graphql';
export { default as PageLayout } from './Component.astro';

export async function findGroupAndPage(
  Astro: AstroGlobal,
  pathname: string,
): Promise<
  | undefined
  | [
      FragmentOf<typeof GroupLayoutFragment>,
      FragmentOf<typeof PageLayoutFragment>,
      ComponentProps<typeof DraftModeQueryListener<any, any>>[],
    ]
> {
  const [groupSlug, rawPageSlug] = pathname.split('/') as [string] | [string, string];

  const pageSlug = rawPageSlug || 'index';

  const { group } = await executeQuery(Astro, docGroupQuery, { variables: { groupSlug } });

  if (!group) {
    return undefined;
  }

  const allPagesWithinGroup = group.pagesOrSections.flatMap((pageOrSection) =>
    pageOrSection.__typename === 'DocGroupPageRecord'
      ? pageOrSection.page
      : pageOrSection.pages.map((page) => page.page),
  );

  const ourPageHandle = allPagesWithinGroup.find((page) => page.slug === pageSlug);

  if (!ourPageHandle) {
    return undefined;
  }

  const docPageQueryVariables = { pageId: ourPageHandle.id };
  const { page } = await executeQuery(Astro, docPageQuery, {
    variables: docPageQueryVariables,
  });

  if (!page) {
    return undefined;
  }

  return [
    group,
    page,
    [
      { query: docGroupQuery, variables: { groupSlug } },
      { query: docPageQuery, variables: { pageId: ourPageHandle.id } },
    ],
  ];
}
