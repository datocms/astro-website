import { AcademyChapterInline } from '~/components/legacy/inlineRecords/AcademyChapterInline';
import { AcademyChapterInlineFragment } from '~/components/legacy/inlineRecords/AcademyChapterInline/graphql';
import { AcademyCourseInline } from '~/components/legacy/inlineRecords/AcademyCourseInline';
import { AcademyCourseInlineFragment } from '~/components/legacy/inlineRecords/AcademyCourseInline/graphql';
import { BlogPostInline } from '~/components/legacy/inlineRecords/BlogPostInline';
import { BlogPostInlineFragment } from '~/components/legacy/inlineRecords/BlogPostInline/graphql';
import { ChangelogEntryInline } from '~/components/legacy/inlineRecords/ChangelogEntryInline';
import { ChangelogEntryInlineFragment } from '~/components/legacy/inlineRecords/ChangelogEntryInline/graphql';
import { CustomerStoryInline } from '~/components/legacy/inlineRecords/CustomerStoryInline';
import { CustomerStoryInlineFragment } from '~/components/legacy/inlineRecords/CustomerStoryInline/graphql';
import { DocGroupInline } from '~/components/legacy/inlineRecords/DocGroupInline';
import { DocGroupInlineFragment } from '~/components/legacy/inlineRecords/DocGroupInline/graphql';
import { DocPageInline } from '~/components/legacy/inlineRecords/DocPageInline';
import { DocPageInlineFragment } from '~/components/legacy/inlineRecords/DocPageInline/graphql';
import { EnterpriseAppInline } from '~/components/legacy/inlineRecords/EnterpriseAppInline';
import { EnterpriseAppInlineFragment } from '~/components/legacy/inlineRecords/EnterpriseAppInline/graphql';
import { FeatureInline } from '~/components/legacy/inlineRecords/FeatureInline';
import { FeatureInlineFragment } from '~/components/legacy/inlineRecords/FeatureInline/graphql';
import { HostingAppInline } from '~/components/legacy/inlineRecords/HostingAppInline';
import { HostingAppInlineFragment } from '~/components/legacy/inlineRecords/HostingAppInline/graphql';
import { LandingPageInline } from '~/components/legacy/inlineRecords/LandingPageInline';
import { LandingPageInlineFragment } from '~/components/legacy/inlineRecords/LandingPageInline/graphql';
import { PartnerInline } from '~/components/legacy/inlineRecords/PartnerInline';
import { PartnerInlineFragment } from '~/components/legacy/inlineRecords/PartnerInline/graphql';
import { PluginInline } from '~/components/legacy/inlineRecords/PluginInline';
import { PluginInlineFragment } from '~/components/legacy/inlineRecords/PluginInline/graphql';
import { ProductComparisonInline } from '~/components/legacy/inlineRecords/ProductComparisonInline';
import { ProductComparisonInlineFragment } from '~/components/legacy/inlineRecords/ProductComparisonInline/graphql';
import { RecipeInline } from '~/components/legacy/inlineRecords/RecipeInline';
import { RecipeInlineFragment } from '~/components/legacy/inlineRecords/RecipeInline/graphql';
import { ShowcaseProjectInline } from '~/components/legacy/inlineRecords/ShowcaseProjectInline';
import { ShowcaseProjectInlineFragment } from '~/components/legacy/inlineRecords/ShowcaseProjectInline/graphql';
import { SuccessStoryInline } from '~/components/legacy/inlineRecords/SuccessStoryInline';
import { SuccessStoryInlineFragment } from '~/components/legacy/inlineRecords/SuccessStoryInline/graphql';
import { TechPartnerInline } from '~/components/legacy/inlineRecords/TechPartnerInline';
import { TechPartnerInlineFragment } from '~/components/legacy/inlineRecords/TechPartnerInline/graphql';
import { TemplateDemoInline } from '~/components/legacy/inlineRecords/TemplateDemoInline';
import { TemplateDemoInlineFragment } from '~/components/legacy/inlineRecords/TemplateDemoInline/graphql';
import { UseCasePageInline } from '~/components/legacy/inlineRecords/UseCasePageInline';
import { UseCasePageInlineFragment } from '~/components/legacy/inlineRecords/UseCasePageInline/graphql';
import { UserGuidesEpisodeInline } from '~/components/legacy/inlineRecords/UserGuidesEpisodeInline';
import { UserGuidesEpisodeInlineFragment } from '~/components/legacy/inlineRecords/UserGuidesEpisodeInline/graphql';

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
  RecipeInlineFragment,
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
  RecipeRecord: RecipeInline,
  ShowcaseProjectRecord: ShowcaseProjectInline,
  SuccessStoryRecord: SuccessStoryInline,
  TechPartnerRecord: TechPartnerInline,
  TemplateDemoRecord: TemplateDemoInline,
  UseCasePageRecord: UseCasePageInline,
  UserGuidesEpisodeRecord: UserGuidesEpisodeInline,
};
