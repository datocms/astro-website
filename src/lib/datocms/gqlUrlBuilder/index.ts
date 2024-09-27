import { type FragmentOf } from '../graphql';
import { buildUrlForDocGroup, type DocGroupUrlFragment } from './docGroup';
import { buildUrlForDocPage, type DocPageUrlFragment } from './docPage';
import { buildUrlForFeature, type FeatureUrlFragment } from './feature';
import { buildUrlForProductUpdate, ProductUpdateUrlFragment } from './productUpdate';
import { buildUrlForTemplateDemo, type TemplateDemoUrlFragment } from './templateDemo';
import { buildUrlForUserGuideEpisode, type UserGuideEpisodeUrlFragment } from './userGuideEpisode';

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
  }
}

export {
  buildUrlForUserGuideEpisode,
  buildUrlForTemplateDemo,
  buildUrlForProductUpdate,
  buildUrlForFeature,
  buildUrlForDocGroup,
  buildUrlForDocPage,
};
