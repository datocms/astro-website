import { type FragmentOf } from '../graphql';
import { buildUrlForAcademyChapter, type AcademyChapterUrlFragment } from './academyChapter';
import { buildUrlForAcademyCourse, type AcademyCourseUrlFragment } from './academyCourse';
import { buildUrlForBlogPost, type BlogPostUrlFragment } from './blogPost';
import { buildUrlForChangelogEntry, type ChangelogEntryUrlFragment } from './changelogEntry';
import { buildUrlForDocGroup, type DocGroupUrlFragment } from './docGroup';
import { buildUrlForDocPage, type DocPageUrlFragment } from './docPage';
import { buildUrlForEnterpriseApp, type EnterpriseAppUrlFragment } from './enterpriseApp';
import { buildUrlForFeature, type FeatureUrlFragment } from './feature';
import { buildUrlForHostingApp, type HostingAppUrlFragment } from './hostingApp';
import { buildUrlForPartner, type PartnerUrlFragment } from './partner';
import { buildUrlForPlugin, type PluginUrlFragment } from './plugin';
import { buildUrlForProductUpdate, ProductUpdateUrlFragment } from './productUpdate';
import { buildUrlForShowcaseProject, type ShowcaseProjectUrlFragment } from './showcaseProject';
import { buildUrlForSuccessStory, type SuccessStoryUrlFragment } from './successStory';
import { buildUrlForTemplateDemo, type TemplateDemoUrlFragment } from './templateDemo';
import { buildUrlForUseCasePage, type UseCasePageUrlFragment } from './useCasePage';
import { buildUrlForUserGuideEpisode, type UserGuideEpisodeUrlFragment } from './userGuideEpisode';

export function buildUrlFromGql(
  thing:
    | (FragmentOf<typeof BlogPostUrlFragment> & {
        __typename: 'BlogPostRecord';
      })
    | (FragmentOf<typeof ChangelogEntryUrlFragment> & {
        __typename: 'ChangelogEntryRecord';
      })
    | (FragmentOf<typeof DocGroupUrlFragment> & {
        __typename: 'DocGroupRecord';
      })
    | (FragmentOf<typeof DocPageUrlFragment> & {
        __typename: 'DocPageRecord';
      })
    | (FragmentOf<typeof EnterpriseAppUrlFragment> & {
        __typename: 'EnterpriseAppRecord';
      })
    | (FragmentOf<typeof FeatureUrlFragment> & {
        __typename: 'FeatureRecord';
      })
    | (FragmentOf<typeof HostingAppUrlFragment> & {
        __typename: 'HostingAppRecord';
      })
    | (FragmentOf<typeof PluginUrlFragment> & {
        __typename: 'PluginRecord';
      })
    | (FragmentOf<typeof ProductUpdateUrlFragment> & {
        __typename: 'ProductUpdateRecord';
      })
    | (FragmentOf<typeof TemplateDemoUrlFragment> & {
        __typename: 'TemplateDemoRecord';
      })
    | (FragmentOf<typeof UserGuideEpisodeUrlFragment> & {
        __typename: 'UserGuidesVideoRecord';
      })
    | (FragmentOf<typeof ShowcaseProjectUrlFragment> & {
        __typename: 'ShowcaseProjectRecord';
      })
    | (FragmentOf<typeof AcademyCourseUrlFragment> & {
        __typename: 'AcademyCourseRecord';
      })
    | (FragmentOf<typeof AcademyChapterUrlFragment> & {
        __typename: 'AcademyChapterRecord';
      })
    | (FragmentOf<typeof PartnerUrlFragment> & {
        __typename: 'PartnerRecord';
      })
    | (FragmentOf<typeof SuccessStoryUrlFragment> & {
        __typename: 'SuccessStoryRecord';
      })
    | (FragmentOf<typeof UseCasePageUrlFragment> & {
        __typename: 'UseCasePageRecord';
      }),
) {
  switch (thing.__typename) {
    case 'BlogPostRecord':
      return buildUrlForBlogPost(thing);
    case 'ChangelogEntryRecord':
      return buildUrlForChangelogEntry(thing);
    case 'DocGroupRecord':
      return buildUrlForDocGroup(thing);
    case 'DocPageRecord':
      return buildUrlForDocPage(thing);
    case 'EnterpriseAppRecord':
      return buildUrlForEnterpriseApp(thing);
    case 'FeatureRecord':
      return buildUrlForFeature(thing);
    case 'HostingAppRecord':
      return buildUrlForHostingApp(thing);
    case 'PluginRecord':
      return buildUrlForPlugin(thing);
    case 'ProductUpdateRecord':
      return buildUrlForProductUpdate(thing);
    case 'TemplateDemoRecord':
      return buildUrlForTemplateDemo(thing);
    case 'UserGuidesVideoRecord':
      return buildUrlForUserGuideEpisode(thing);
    case 'ShowcaseProjectRecord':
      return buildUrlForShowcaseProject(thing);
    case 'AcademyCourseRecord':
      return buildUrlForAcademyCourse(thing);
    case 'AcademyChapterRecord':
      return buildUrlForAcademyChapter(thing);
    case 'PartnerRecord':
      return buildUrlForPartner(thing);
    case 'SuccessStoryRecord':
      return buildUrlForSuccessStory(thing);
    case 'UseCasePageRecord':
      return buildUrlForUseCasePage(thing);
  }
}
