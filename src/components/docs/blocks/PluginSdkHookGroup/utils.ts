import { readFragment, type FragmentOf } from 'gql.tada';
import ky from 'ky';
import { cachedFn } from '~/lib/temporarlyCache';
import type { TocEntry, TocGroup } from '../../ContentPlusToc/types';
import { PluginSdkHookGroupFragment } from './graphql';
import type { HookInfo, Manifest } from './manifestTypes';

type Block = { __typename: 'PluginSdkHookGroupRecord' } & FragmentOf<
  typeof PluginSdkHookGroupFragment
>;

export async function buildGroupsFromPluginSdkHooks(content: {
  blocks: Array<{ __typename: string } | Block>;
}): Promise<TocGroup[]> {
  const sdkHookGroupBlocks = content.blocks.filter(
    (block): block is Block => block.__typename === 'PluginSdkHookGroupRecord',
  );

  const entries = (
    await Promise.all(
      sdkHookGroupBlocks.map(async (block) => {
        const { groupName } = readFragment(PluginSdkHookGroupFragment, block);

        const manifest = await fetchPluginSdkManifest();

        const hooks = sortRelatedHooks(
          Object.values(manifest.hooks).filter((hook) => hook.comment?.tag === groupName),
        );

        return hooks.map<TocEntry>((hook) => ({
          label: `${hook.name}()`,
          url: `#${hook.name}`,
        }));
      }),
    )
  ).flat();

  return entries.length > 0 ? [{ title: 'Hooks', entries }] : [];
}

export function sortRelatedHooks(hooks: HookInfo[]): HookInfo[] {
  // Group related strings
  const groups: { [key: string]: HookInfo[] } = {};

  hooks.forEach((hook) => {
    const base = hook.name
      .replace(/^(render|override)/, '')
      .replace(/s$/, '')
      .toLowerCase();
    if (!groups[base]) {
      groups[base] = [];
    }
    groups[base].push(hook);
  });

  // Sort each group alphabetically
  Object.values(groups).forEach((group) => group.sort(sortRenderAtEnd));

  const sortedGroups = Object.keys(groups)
    .sort()
    .map((key) => groups[key]!);

  // Flatten and return the sorted array
  return sortedGroups.flat();
}

function sortRenderAtEnd(a: { name: string }, b: { name: string }): number {
  const aStartsWithRender = a.name.startsWith('render');
  const bStartsWithRender = b.name.startsWith('render');

  if (aStartsWithRender && !bStartsWithRender) {
    return 1; // a should come after b
  } else if (!aStartsWithRender && bStartsWithRender) {
    return -1; // a should come before b
  } else {
    return a.name.localeCompare(b.name); // otherwise sort alphabetically
  }
}

const url =
  'https://raw.githubusercontent.com/datocms/plugins-sdk/refs/heads/new-hooks/packages/sdk/manifest.json';

export const fetchPluginSdkManifest = cachedFn(async (): Promise<Manifest> => {
  return await ky<Manifest>(url).json();
});
