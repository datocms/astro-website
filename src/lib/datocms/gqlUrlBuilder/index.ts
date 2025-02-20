import { type FragmentOf } from '../graphql';
import { buildUrlForAcademyChapter, type AcademyChapterUrlFragment } from './academyChapter';
import { buildUrlForAcademyCourse, type AcademyCourseUrlFragment } from './academyCourse';
import { buildUrlForBlogPost, type BlogPostUrlFragment } from './blogPost';
import { buildUrlForChangelogEntry, type ChangelogEntryUrlFragment } from './changelogEntry';
import { buildUrlForCustomerStory, type CustomerStoryUrlFragment } from './customerStory';
import { buildUrlForDocGroup, type DocGroupUrlFragment } from './docGroup';
import { buildUrlForDocPage, type DocPageUrlFragment } from './docPage';
import { buildUrlForEnterpriseApp, type EnterpriseAppUrlFragment } from './enterpriseApp';
import { buildUrlForFeature, type FeatureUrlFragment } from './feature';
import { buildUrlForHostingApp, type HostingAppUrlFragment } from './hostingApp';
import { buildUrlForLandingPage, type LandingPageUrlFragment } from './landingPage';
import { buildUrlForPartner, type PartnerUrlFragment } from './partner';
import { buildUrlForPlugin, type PluginUrlFragment } from './plugin';
import { buildUrlForProductUpdate, ProductUpdateUrlFragment } from './productUpdate';
import { buildUrlForShowcaseProject, type ShowcaseProjectUrlFragment } from './showcaseProject';
import { buildUrlForSuccessStory, type SuccessStoryUrlFragment } from './successStory';
import { buildUrlForTemplateDemo, type TemplateDemoUrlFragment } from './templateDemo';
import { buildUrlForUseCasePage, type UseCasePageUrlFragment } from './useCasePage';
import {
  buildUrlForUserGuidesEpisode,
  type UserGuidesEpisodeUrlFragment,
} from './userGuidesEpisode';

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
    | (FragmentOf<typeof UserGuidesEpisodeUrlFragment> & {
        __typename: 'UserGuidesEpisodeRecord';
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
    | (FragmentOf<typeof CustomerStoryUrlFragment> & {
        __typename: 'CustomerStoryRecord';
      })
    | (FragmentOf<typeof UseCasePageUrlFragment> & {
        __typename: 'UseCasePageRecord';
      })
    | (FragmentOf<typeof LandingPageUrlFragment> & {
        __typename: 'LandingPageRecord';
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
    case 'UserGuidesEpisodeRecord':
      return buildUrlForUserGuidesEpisode(thing);
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
    case 'CustomerStoryRecord':
      return buildUrlForCustomerStory(thing);
    case 'UseCasePageRecord':
      return buildUrlForUseCasePage(thing);
    case 'LandingPageRecord':
      return buildUrlForLandingPage(thing);
    default:
      throw new Error(`Invalid type: ${(thing as any).__typename}`);
  }
}
