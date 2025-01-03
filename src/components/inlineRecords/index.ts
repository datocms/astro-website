import { AcademyChapterInline } from '~/components/inlineRecords/AcademyChapterInline';
import { AcademyChapterInlineFragment } from '~/components/inlineRecords/AcademyChapterInline/graphql';
import { AcademyCourseInline } from '~/components/inlineRecords/AcademyCourseInline';
import { AcademyCourseInlineFragment } from '~/components/inlineRecords/AcademyCourseInline/graphql';
import { BlogPostInline } from '~/components/inlineRecords/BlogPostInline';
import { BlogPostInlineFragment } from '~/components/inlineRecords/BlogPostInline/graphql';
import { ChangelogEntryInline } from '~/components/inlineRecords/ChangelogEntryInline';
import { ChangelogEntryInlineFragment } from '~/components/inlineRecords/ChangelogEntryInline/graphql';
import { CustomerStoryInline } from '~/components/inlineRecords/CustomerStoryInline';
import { CustomerStoryInlineFragment } from '~/components/inlineRecords/CustomerStoryInline/graphql';
import { DocGroupInline } from '~/components/inlineRecords/DocGroupInline';
import { DocGroupInlineFragment } from '~/components/inlineRecords/DocGroupInline/graphql';
import { DocPageInline } from '~/components/inlineRecords/DocPageInline';
import { DocPageInlineFragment } from '~/components/inlineRecords/DocPageInline/graphql';
import { EnterpriseAppInline } from '~/components/inlineRecords/EnterpriseAppInline';
import { EnterpriseAppInlineFragment } from '~/components/inlineRecords/EnterpriseAppInline/graphql';
import { FeatureInline } from '~/components/inlineRecords/FeatureInline';
import { FeatureInlineFragment } from '~/components/inlineRecords/FeatureInline/graphql';
import { HostingAppInline } from '~/components/inlineRecords/HostingAppInline';
import { HostingAppInlineFragment } from '~/components/inlineRecords/HostingAppInline/graphql';
import { LandingPageInline } from '~/components/inlineRecords/LandingPageInline';
import { LandingPageInlineFragment } from '~/components/inlineRecords/LandingPageInline/graphql';
import { PartnerInline } from '~/components/inlineRecords/PartnerInline';
import { PartnerInlineFragment } from '~/components/inlineRecords/PartnerInline/graphql';
import { PluginInline } from '~/components/inlineRecords/PluginInline';
import { PluginInlineFragment } from '~/components/inlineRecords/PluginInline/graphql';
import { ProductComparisonInline } from '~/components/inlineRecords/ProductComparisonInline';
import { ProductComparisonInlineFragment } from '~/components/inlineRecords/ProductComparisonInline/graphql';
import { ShowcaseProjectInline } from '~/components/inlineRecords/ShowcaseProjectInline';
import { ShowcaseProjectInlineFragment } from '~/components/inlineRecords/ShowcaseProjectInline/graphql';
import { SuccessStoryInline } from '~/components/inlineRecords/SuccessStoryInline';
import { SuccessStoryInlineFragment } from '~/components/inlineRecords/SuccessStoryInline/graphql';
import { TechPartnerInline } from '~/components/inlineRecords/TechPartnerInline';
import { TechPartnerInlineFragment } from '~/components/inlineRecords/TechPartnerInline/graphql';
import { TemplateDemoInline } from '~/components/inlineRecords/TemplateDemoInline';
import { TemplateDemoInlineFragment } from '~/components/inlineRecords/TemplateDemoInline/graphql';
import { UseCasePageInline } from '~/components/inlineRecords/UseCasePageInline';
import { UseCasePageInlineFragment } from '~/components/inlineRecords/UseCasePageInline/graphql';
import { UserGuidesEpisodeInline } from '~/components/inlineRecords/UserGuidesEpisodeInline';
import { UserGuidesEpisodeInlineFragment } from '~/components/inlineRecords/UserGuidesEpisodeInline/graphql';

export const defaultInlineRecordFragments = [
  AcademyChapterInlineFragment,
  AcademyCourseInlineFragment,
  BlogPostInlineFragment,
  ChangelogEntryInlineFragment,
  CustomerStoryInlineFragment,
  DocGroupInlineFragment,
  DocPageInlineFragment,
  EnterpriseAppInlineFragment,
  FeatureInlineFragment,
  HostingAppInlineFragment,
  LandingPageInlineFragment,
  PartnerInlineFragment,
  PluginInlineFragment,
  ProductComparisonInlineFragment,
  ShowcaseProjectInlineFragment,
  SuccessStoryInlineFragment,
  TechPartnerInlineFragment,
  TemplateDemoInlineFragment,
  UseCasePageInlineFragment,
  UserGuidesEpisodeInlineFragment,
] as const;

export const defaultInlineRecordComponents = {
  AcademyChapterRecord: AcademyChapterInline,
  AcademyCourseRecord: AcademyCourseInline,
  BlogPostRecord: BlogPostInline,
  ChangelogEntryRecord: ChangelogEntryInline,
  CustomerStoryRecord: CustomerStoryInline,
  DocGroupRecord: DocGroupInline,
  DocPageRecord: DocPageInline,
  EnterpriseAppRecord: EnterpriseAppInline,
  FeatureRecord: FeatureInline,
  HostingAppRecord: HostingAppInline,
  LandingPageRecord: LandingPageInline,
  PartnerRecord: PartnerInline,
  PluginRecord: PluginInline,
  ProductComparisonRecord: ProductComparisonInline,
  ShowcaseProjectRecord: ShowcaseProjectInline,
  SuccessStoryRecord: SuccessStoryInline,
  TechPartnerRecord: TechPartnerInline,
  TemplateDemoRecord: TemplateDemoInline,
  UseCasePageRecord: UseCasePageInline,
  UserGuidesEpisodeRecord: UserGuidesEpisodeInline,
};
