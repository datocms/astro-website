import { AcademyChapterInline } from '~/components/StructuredText/inlineRecords/AcademyChapterInline';
import { AcademyChapterInlineFragment } from '~/components/StructuredText/inlineRecords/AcademyChapterInline/graphql';
import { AcademyCourseInline } from '~/components/StructuredText/inlineRecords/AcademyCourseInline';
import { AcademyCourseInlineFragment } from '~/components/StructuredText/inlineRecords/AcademyCourseInline/graphql';
import { BlogPostInline } from '~/components/StructuredText/inlineRecords/BlogPostInline';
import { BlogPostInlineFragment } from '~/components/StructuredText/inlineRecords/BlogPostInline/graphql';
import { ChangelogEntryInline } from '~/components/StructuredText/inlineRecords/ChangelogEntryInline';
import { ChangelogEntryInlineFragment } from '~/components/StructuredText/inlineRecords/ChangelogEntryInline/graphql';
import { CustomerStoryInline } from '~/components/StructuredText/inlineRecords/CustomerStoryInline';
import { CustomerStoryInlineFragment } from '~/components/StructuredText/inlineRecords/CustomerStoryInline/graphql';
import { DocGroupInline } from '~/components/StructuredText/inlineRecords/DocGroupInline';
import { DocGroupInlineFragment } from '~/components/StructuredText/inlineRecords/DocGroupInline/graphql';
import { DocPageInline } from '~/components/StructuredText/inlineRecords/DocPageInline';
import { DocPageInlineFragment } from '~/components/StructuredText/inlineRecords/DocPageInline/graphql';
import { EnterpriseAppInline } from '~/components/StructuredText/inlineRecords/EnterpriseAppInline';
import { EnterpriseAppInlineFragment } from '~/components/StructuredText/inlineRecords/EnterpriseAppInline/graphql';
import { FeatureInline } from '~/components/StructuredText/inlineRecords/FeatureInline';
import { FeatureInlineFragment } from '~/components/StructuredText/inlineRecords/FeatureInline/graphql';
import { HostingAppInline } from '~/components/StructuredText/inlineRecords/HostingAppInline';
import { HostingAppInlineFragment } from '~/components/StructuredText/inlineRecords/HostingAppInline/graphql';
import { LandingPageInline } from '~/components/StructuredText/inlineRecords/LandingPageInline';
import { LandingPageInlineFragment } from '~/components/StructuredText/inlineRecords/LandingPageInline/graphql';
import { PartnerInline } from '~/components/StructuredText/inlineRecords/PartnerInline';
import { PartnerInlineFragment } from '~/components/StructuredText/inlineRecords/PartnerInline/graphql';
import { PluginInline } from '~/components/StructuredText/inlineRecords/PluginInline';
import { PluginInlineFragment } from '~/components/StructuredText/inlineRecords/PluginInline/graphql';
import { ProductComparisonInline } from '~/components/StructuredText/inlineRecords/ProductComparisonInline';
import { ProductComparisonInlineFragment } from '~/components/StructuredText/inlineRecords/ProductComparisonInline/graphql';
import { RecipeInline } from '~/components/StructuredText/inlineRecords/RecipeInline';
import { RecipeInlineFragment } from '~/components/StructuredText/inlineRecords/RecipeInline/graphql';
import { ShowcaseProjectInline } from '~/components/StructuredText/inlineRecords/ShowcaseProjectInline';
import { ShowcaseProjectInlineFragment } from '~/components/StructuredText/inlineRecords/ShowcaseProjectInline/graphql';
import { SuccessStoryInline } from '~/components/StructuredText/inlineRecords/SuccessStoryInline';
import { SuccessStoryInlineFragment } from '~/components/StructuredText/inlineRecords/SuccessStoryInline/graphql';
import { TechPartnerInline } from '~/components/StructuredText/inlineRecords/TechPartnerInline';
import { TechPartnerInlineFragment } from '~/components/StructuredText/inlineRecords/TechPartnerInline/graphql';
import { TemplateDemoInline } from '~/components/StructuredText/inlineRecords/TemplateDemoInline';
import { TemplateDemoInlineFragment } from '~/components/StructuredText/inlineRecords/TemplateDemoInline/graphql';
import { UseCasePageInline } from '~/components/StructuredText/inlineRecords/UseCasePageInline';
import { UseCasePageInlineFragment } from '~/components/StructuredText/inlineRecords/UseCasePageInline/graphql';
import { UserGuidesEpisodeInline } from '~/components/StructuredText/inlineRecords/UserGuidesEpisodeInline';
import { UserGuidesEpisodeInlineFragment } from '~/components/StructuredText/inlineRecords/UserGuidesEpisodeInline/graphql';

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
