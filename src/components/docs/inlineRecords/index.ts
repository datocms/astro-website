import { AcademyChapterInline } from '~/components/docs/inlineRecords/AcademyChapterInline';
import { AcademyChapterInlineFragment } from '~/components/docs/inlineRecords/AcademyChapterInline/graphql';
import { AcademyCourseInline } from '~/components/docs/inlineRecords/AcademyCourseInline';
import { AcademyCourseInlineFragment } from '~/components/docs/inlineRecords/AcademyCourseInline/graphql';
import { BlogPostInline } from '~/components/docs/inlineRecords/BlogPostInline';
import { BlogPostInlineFragment } from '~/components/docs/inlineRecords/BlogPostInline/graphql';
import { ChangelogEntryInline } from '~/components/docs/inlineRecords/ChangelogEntryInline';
import { ChangelogEntryInlineFragment } from '~/components/docs/inlineRecords/ChangelogEntryInline/graphql';
import { CustomerStoryInline } from '~/components/docs/inlineRecords/CustomerStoryInline';
import { CustomerStoryInlineFragment } from '~/components/docs/inlineRecords/CustomerStoryInline/graphql';
import { DocGroupInline } from '~/components/docs/inlineRecords/DocGroupInline';
import { DocGroupInlineFragment } from '~/components/docs/inlineRecords/DocGroupInline/graphql';
import { DocPageInline } from '~/components/docs/inlineRecords/DocPageInline';
import { DocPageInlineFragment } from '~/components/docs/inlineRecords/DocPageInline/graphql';
import { EnterpriseAppInline } from '~/components/docs/inlineRecords/EnterpriseAppInline';
import { EnterpriseAppInlineFragment } from '~/components/docs/inlineRecords/EnterpriseAppInline/graphql';
import { FeatureInline } from '~/components/docs/inlineRecords/FeatureInline';
import { FeatureInlineFragment } from '~/components/docs/inlineRecords/FeatureInline/graphql';
import { HostingAppInline } from '~/components/docs/inlineRecords/HostingAppInline';
import { HostingAppInlineFragment } from '~/components/docs/inlineRecords/HostingAppInline/graphql';
import { LandingPageInline } from '~/components/docs/inlineRecords/LandingPageInline';
import { LandingPageInlineFragment } from '~/components/docs/inlineRecords/LandingPageInline/graphql';
import { PartnerInline } from '~/components/docs/inlineRecords/PartnerInline';
import { PartnerInlineFragment } from '~/components/docs/inlineRecords/PartnerInline/graphql';
import { PluginInline } from '~/components/docs/inlineRecords/PluginInline';
import { PluginInlineFragment } from '~/components/docs/inlineRecords/PluginInline/graphql';
import { ProductComparisonInline } from '~/components/docs/inlineRecords/ProductComparisonInline';
import { ProductComparisonInlineFragment } from '~/components/docs/inlineRecords/ProductComparisonInline/graphql';
import { RecipeInline } from '~/components/docs/inlineRecords/RecipeInline';
import { RecipeInlineFragment } from '~/components/docs/inlineRecords/RecipeInline/graphql';
import { ShowcaseProjectInline } from '~/components/docs/inlineRecords/ShowcaseProjectInline';
import { ShowcaseProjectInlineFragment } from '~/components/docs/inlineRecords/ShowcaseProjectInline/graphql';
import { SuccessStoryInline } from '~/components/docs/inlineRecords/SuccessStoryInline';
import { SuccessStoryInlineFragment } from '~/components/docs/inlineRecords/SuccessStoryInline/graphql';
import { TechPartnerInline } from '~/components/docs/inlineRecords/TechPartnerInline';
import { TechPartnerInlineFragment } from '~/components/docs/inlineRecords/TechPartnerInline/graphql';
import { TemplateDemoInline } from '~/components/docs/inlineRecords/TemplateDemoInline';
import { TemplateDemoInlineFragment } from '~/components/docs/inlineRecords/TemplateDemoInline/graphql';
import { UseCasePageInline } from '~/components/docs/inlineRecords/UseCasePageInline';
import { UseCasePageInlineFragment } from '~/components/docs/inlineRecords/UseCasePageInline/graphql';
import { UserGuidesEpisodeInline } from '~/components/docs/inlineRecords/UserGuidesEpisodeInline';
import { UserGuidesEpisodeInlineFragment } from '~/components/docs/inlineRecords/UserGuidesEpisodeInline/graphql';

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
