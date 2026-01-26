import { stripStega } from '@datocms/astro';
import { graphql, readFragment, type FragmentOf } from '../graphql';

export const PluginUrlFragment = graphql(/* GraphQL */ `
  fragment PluginUrlFragment on PluginRecord {
    packageName
  }
`);

export function buildUrlForPlugin(plugin: FragmentOf<typeof PluginUrlFragment>) {
  const data = readFragment(PluginUrlFragment, plugin);
  return `/marketplace/plugins/i/${stripStega(data.packageName)}`;
}
