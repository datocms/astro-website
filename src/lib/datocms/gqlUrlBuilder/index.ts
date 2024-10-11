import { type FragmentOf } from '../graphql';
import { buildUrlForDocGroup, type DocGroupUrlFragment } from './docGroup';
import { buildUrlForDocPage, type DocPageUrlFragment } from './docPage';
import { buildUrlForFeature, type FeatureUrlFragment } from './feature';
import { buildUrlForProductUpdate, ProductUpdateUrlFragment } from './productUpdate';
import { buildUrlForTemplateDemo, type TemplateDemoUrlFragment } from './templateDemo';
import { buildUrlForUserGuideEpisode, type UserGuideEpisodeUrlFragment } from './userGuideEpisode';
import { buildUrlForBlogPost, type BlogPostUrlFragment } from './blogPost';
import { buildUrlForChangelogEntry, type ChangelogEntryUrlFragment } from './changelogEntry';
import { buildUrlForPlugin, type PluginUrlFragment } from './plugin';

export function buildUrlFromGql(
  thing:
    | (FragmentOf<typeof DocPageUrlFragment> & {
        __typename: 'DocPageRecord';
      })
    | (FragmentOf<typeof FeatureUrlFragment> & {
        __typename: 'FeatureRecord';
      })
    | (FragmentOf<typeof DocGroupUrlFragment> & {
        __typename: 'DocGroupRecord';
      })
    | (FragmentOf<typeof UserGuideEpisodeUrlFragment> & {
        __typename: 'UserGuidesVideoRecord';
      })
    | (FragmentOf<typeof TemplateDemoUrlFragment> & {
        __typename: 'TemplateDemoRecord';
      })
    | (FragmentOf<typeof ProductUpdateUrlFragment> & {
        __typename: 'ProductUpdateRecord';
      })
    | (FragmentOf<typeof BlogPostUrlFragment> & {
        __typename: 'BlogPostRecord';
      })
    | (FragmentOf<typeof ChangelogEntryUrlFragment> & {
        __typename: 'ChangelogEntryRecord';
      })
    | (FragmentOf<typeof PluginUrlFragment> & {
        __typename: 'PluginRecord';
      }),
) {
  switch (thing.__typename) {
    case 'DocPageRecord':
      return buildUrlForDocPage(thing);
    case 'FeatureRecord':
      return buildUrlForFeature(thing);
    case 'DocGroupRecord':
      return buildUrlForDocGroup(thing);
    case 'UserGuidesVideoRecord':
      return buildUrlForUserGuideEpisode(thing);
    case 'TemplateDemoRecord':
      return buildUrlForTemplateDemo(thing);
    case 'ProductUpdateRecord':
      return buildUrlForProductUpdate(thing);
    case 'BlogPostRecord':
      return buildUrlForBlogPost(thing);
    case 'ChangelogEntryRecord':
      return buildUrlForChangelogEntry(thing);
    case 'PluginRecord':
      return buildUrlForPlugin(thing);
  }
}
