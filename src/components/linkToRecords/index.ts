import { AcademyChapterLink } from './AcademyChapterLink';
import { AcademyCourseLink } from './AcademyCourseLink';
import { BlogPostLink } from './BlogPostLink';
import { ChangelogEntryLink } from './ChangelogEntryLink';
import { CustomerStoryLink } from './CustomerStoryLink';
import { DocGroupLink } from './DocGroupLink';
import { DocPageLink } from './DocPageLink';
import { EnterpriseAppLink } from './EnterpriseAppLink';
import { FeatureLink } from './FeatureLink';
import { HostingAppLink } from './HostingAppLink';
import { LandingPageLink } from './LandingPageLink';
import { PartnerLink } from './PartnerLink';
import { PluginLink } from './PluginLink';
import { ProductComparisonLink } from './ProductComparisonLink';
import { ShowcaseProjectLink } from './ShowcaseProjectLink';
import { SuccessStoryLink } from './SuccessStoryLink';
import { TechPartnerLink } from './TechPartnerLink';
import { TemplateDemoLink } from './TemplateDemoLink';
import { UseCasePageLink } from './UseCasePageLink';
import { UserGuidesEpisodeLink } from './UserGuidesEpisodeLink';

import type { MetaEntry } from 'datocms-structured-text-utils';
import { AcademyChapterLinkFragment } from './AcademyChapterLink/graphql';
import { AcademyCourseLinkFragment } from './AcademyCourseLink/graphql';
import { BlogPostLinkFragment } from './BlogPostLink/graphql';
import { ChangelogEntryLinkFragment } from './ChangelogEntryLink/graphql';
import { CustomerStoryLinkFragment } from './CustomerStoryLink/graphql';
import { DocGroupLinkFragment } from './DocGroupLink/graphql';
import { DocPageLinkFragment } from './DocPageLink/graphql';
import { EnterpriseAppLinkFragment } from './EnterpriseAppLink/graphql';
import { FeatureLinkFragment } from './FeatureLink/graphql';
import { HostingAppLinkFragment } from './HostingAppLink/graphql';
import { LandingPageLinkFragment } from './LandingPageLink/graphql';
import { PartnerLinkFragment } from './PartnerLink/graphql';
import { PluginLinkFragment } from './PluginLink/graphql';
import { ProductComparisonLinkFragment } from './ProductComparisonLink/graphql';
import { ShowcaseProjectLinkFragment } from './ShowcaseProjectLink/graphql';
import { SuccessStoryLinkFragment } from './SuccessStoryLink/graphql';
import { TechPartnerLinkFragment } from './TechPartnerLink/graphql';
import { TemplateDemoLinkFragment } from './TemplateDemoLink/graphql';
import { UseCasePageLinkFragment } from './UseCasePageLink/graphql';
import { UserGuidesEpisodeLinkFragment } from './UserGuidesEpisodeLink/graphql';

export const defaultLinkToRecordFragments = [
  AcademyChapterLinkFragment,
  AcademyCourseLinkFragment,
  BlogPostLinkFragment,
  ChangelogEntryLinkFragment,
  CustomerStoryLinkFragment,
  DocGroupLinkFragment,
  DocPageLinkFragment,
  EnterpriseAppLinkFragment,
  FeatureLinkFragment,
  HostingAppLinkFragment,
  LandingPageLinkFragment,
  PartnerLinkFragment,
  PluginLinkFragment,
  ProductComparisonLinkFragment,
  ShowcaseProjectLinkFragment,
  SuccessStoryLinkFragment,
  TechPartnerLinkFragment,
  TemplateDemoLinkFragment,
  UseCasePageLinkFragment,
  UserGuidesEpisodeLinkFragment,
  AcademyChapterLinkFragment,
] as const;

export const defaultLinkToRecordComponents = {
  AcademyChapterRecord: AcademyChapterLink,
  AcademyCourseRecord: AcademyCourseLink,
  BlogPostRecord: BlogPostLink,
  ChangelogEntryRecord: ChangelogEntryLink,
  CustomerStoryRecord: CustomerStoryLink,
  DocGroupRecord: DocGroupLink,
  DocPageRecord: DocPageLink,
  EnterpriseAppRecord: EnterpriseAppLink,
  FeatureRecord: FeatureLink,
  HostingAppRecord: HostingAppLink,
  LandingPageRecord: LandingPageLink,
  PartnerRecord: PartnerLink,
  PluginRecord: PluginLink,
  ProductComparisonRecord: ProductComparisonLink,
  ShowcaseProjectRecord: ShowcaseProjectLink,
  SuccessStoryRecord: SuccessStoryLink,
  TechPartnerRecord: TechPartnerLink,
  TemplateDemoRecord: TemplateDemoLink,
  UseCasePageRecord: UseCasePageLink,
  UserGuidesEpisodeRecord: UserGuidesEpisodeLink,
};

export function augmentLinkWithMeta(meta: MetaEntry[] | undefined, url: string) {
  const hash = meta?.find((m) => m.id === 'hash')?.value;

  if (hash) {
    return `${url}${hash}`;
  }

  return url;
}
