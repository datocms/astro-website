import type { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'en';
};
export type Llmstxt = ItemTypeDefinition<
  EnvironmentSettings,
  'PvVIeFX5QROO2tUujtmr6g',
  {
    llmstxt: {
      type: 'text';
    };
    llmstxt_full: {
      type: 'text';
    };
  }
>;
export type AssetsHardcodedInWebsite = ItemTypeDefinition<
  EnvironmentSettings,
  'PKb12X7FSmCFNPGwEfimrw',
  {
    assets: {
      type: 'gallery';
    };
  }
>;
export type ManagedNavigationBarGroup = ItemTypeDefinition<
  EnvironmentSettings,
  'BIdlCMW1Sf24mfJF-OcQGg',
  {
    title: {
      type: 'string';
    };
    call_to_action: {
      type: 'single_block';
      blocks: NavigationBarGroupCta;
    };
  }
>;
export type NavigationBarGroupCta = ItemTypeDefinition<
  EnvironmentSettings,
  'GvnWj4HNTdaAdK90Ed9ryA',
  {
    label: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
  }
>;
export type NavigationBarGroupCtaItem = ItemTypeDefinition<
  EnvironmentSettings,
  'S2m3MgQ9QsOYO9TcOl0onQ',
  {
    label: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
  }
>;
export type Table = ItemTypeDefinition<
  EnvironmentSettings,
  '2033750',
  {
    table: {
      type: 'json';
    };
  }
>;
export type FeatureLink = ItemTypeDefinition<
  EnvironmentSettings,
  'Xf3p8bFyR5qekJmSD8n80A',
  {
    content: {
      type: 'link';
    };
    link_title: {
      type: 'string';
    };
  }
>;
export type FeatureHighlightCard = ItemTypeDefinition<
  EnvironmentSettings,
  'ZkcaTdMtToeCy95LTLI0-g',
  {
    card_type: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    description: {
      type: 'structured_text';
    };
    links: {
      type: 'rich_text';
      blocks: FeatureLink;
    };
  }
>;
export type CloneButtonForm = ItemTypeDefinition<EnvironmentSettings, '810884', {}>;
export type DeployButtonForm = ItemTypeDefinition<EnvironmentSettings, '810885', {}>;
export type CodeExcerptBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810886',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
    };
    code: {
      type: 'text';
    };
    language: {
      type: 'string';
    };
    github_repo_title: {
      type: 'string';
    };
    github_package_name: {
      type: 'string';
    };
  }
>;
export type Demo = ItemTypeDefinition<
  EnvironmentSettings,
  '810890',
  {
    demo: {
      type: 'link';
    };
  }
>;
export type ImageTransformationsBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810893',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export type QuestionAnswer = ItemTypeDefinition<
  EnvironmentSettings,
  '810941',
  {
    question: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    answer: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
  }
>;
export type MultipleDemosBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810947',
  {
    demos: {
      type: 'links';
    };
  }
>;
export type Video = ItemTypeDefinition<
  EnvironmentSettings,
  '810949',
  {
    video: {
      type: 'video';
    };
  }
>;
export type PageLink = ItemTypeDefinition<
  EnvironmentSettings,
  '810951',
  {
    title: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
  }
>;
export type DocGroupPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810952',
  {
    page: {
      type: 'link';
    };
  }
>;
export type SuccessStoryNumber = ItemTypeDefinition<
  EnvironmentSettings,
  '810953',
  {
    number: {
      type: 'string';
    };
    label: {
      type: 'string';
    };
  }
>;
export type SuccessStoryResult = ItemTypeDefinition<
  EnvironmentSettings,
  '810954',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
  }
>;
export type ModularBlocksBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810955',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export type QuoteLink = ItemTypeDefinition<
  EnvironmentSettings,
  '810950',
  {
    quote: {
      type: 'link';
    };
  }
>;
export type LandingProgressiveImagesBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810956',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
    };
    github_repo_title: {
      type: 'string';
    };
    github_package_name: {
      type: 'string';
    };
  }
>;
export type GraphqlDemoBlock = ItemTypeDefinition<EnvironmentSettings, '810957', {}>;
export type LandingCdnMapBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810958',
  {
    title: {
      type: 'structured_text';
    };
    description: {
      type: 'structured_text';
    };
  }
>;
export type TryDemoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810959',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
  }
>;
export type LandingVideoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810960',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
    };
    video: {
      type: 'file';
    };
  }
>;
export type TeamPage = ItemTypeDefinition<
  EnvironmentSettings,
  '1099227',
  {
    seo_h1: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
  }
>;
export type CodesandboxEmbedBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '1113148',
  {
    slug: {
      type: 'string';
    };
    preview: {
      type: 'file';
    };
  }
>;
export type DocGroupSection = ItemTypeDefinition<
  EnvironmentSettings,
  '1410358',
  {
    title: {
      type: 'string';
    };
    pages: {
      type: 'rich_text';
      blocks: DocGroupPage;
    };
  }
>;
export type PluginSdkHookGroup = ItemTypeDefinition<
  EnvironmentSettings,
  '1410429',
  {
    group_name: {
      type: 'string';
    };
  }
>;
export type DocCallout = ItemTypeDefinition<
  EnvironmentSettings,
  '1437522',
  {
    callout_type: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    text: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
  }
>;
export type ReactUiLiveExample = ItemTypeDefinition<
  EnvironmentSettings,
  '1470085',
  {
    component_name: {
      type: 'string';
    };
  }
>;
export type CtaButton = ItemTypeDefinition<
  EnvironmentSettings,
  '1989011',
  {
    text: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    font_size: {
      type: 'string';
    };
    padding: {
      type: 'string';
    };
    style: {
      type: 'string';
    };
    alignment: {
      type: 'string';
    };
  }
>;
export type YoutubeVideoResource = ItemTypeDefinition<
  EnvironmentSettings,
  '1989694',
  {
    video: {
      type: 'video';
    };
  }
>;
export type OtherVideoResource = ItemTypeDefinition<
  EnvironmentSettings,
  '1989695',
  {
    cover_image: {
      type: 'file';
    };
    url: {
      type: 'string';
    };
  }
>;
export type ShowcaseProjectBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '2023385',
  {
    showcase_projects: {
      type: 'links';
    };
  }
>;
export type ShopifyProduct = ItemTypeDefinition<
  EnvironmentSettings,
  '2093824',
  {
    shopify_product_id: {
      type: 'string';
    };
  }
>;
export type TutorialVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '1989853',
  {
    tutorials: {
      type: 'links';
    };
  }
>;
export type ReasonToConsider = ItemTypeDefinition<
  EnvironmentSettings,
  'NwCxRpLVQ3q-CoPiDVO-Iw',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
  }
>;
export type Importer = ItemTypeDefinition<
  EnvironmentSettings,
  'WTE6HYFdTXq8Co90Q1Zbuw',
  {
    header: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    learn_more_slug: {
      type: 'slug';
    };
  }
>;
export type DifferencesOnTopic = ItemTypeDefinition<
  EnvironmentSettings,
  'M8ubDKZ1TpaB-IOqO_h7MQ',
  {
    topic: {
      type: 'string';
    };
    differences: {
      type: 'rich_text';
      blocks: ProductDifference;
    };
  }
>;
export type ProductDifference = ItemTypeDefinition<
  EnvironmentSettings,
  'PwpYYgGtTUShgE8OhyQrpA',
  {
    datocms_take: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    competitor_take: {
      type: 'structured_text';
    };
  }
>;
export type UseCaseFeature = ItemTypeDefinition<
  EnvironmentSettings,
  'RTkvuDGkQIaOL47H-TxDIg',
  {
    icon: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
  }
>;
export type UseCaseCallout = ItemTypeDefinition<
  EnvironmentSettings,
  'IlHaJt28TL6yyA3s7LeOpg',
  {
    image: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
    features: {
      type: 'rich_text';
      blocks: UseCaseFeature;
    };
  }
>;
export type InDepthCtaBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810963',
  {
    cta: {
      type: 'link';
    };
  }
>;
export type OverviewPillar = ItemTypeDefinition<
  EnvironmentSettings,
  'G-P0C9L0SDiGyQ0UQZXYhg',
  {
    theme: {
      type: 'string';
    };
    title: {
      type: 'structured_text';
    };
    image: {
      type: 'file';
    };
    pillar_callout: {
      type: 'text';
    };
    capability1: {
      type: 'structured_text';
    };
    capability2: {
      type: 'structured_text';
    };
    capability3: {
      type: 'structured_text';
    };
  }
>;
export type OverviewFeature = ItemTypeDefinition<
  EnvironmentSettings,
  'FxswcKSLS-ynk9q4v11-Xw',
  {
    icon: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
    highlight: {
      type: 'boolean';
    };
    image: {
      type: 'file';
    };
    hardcoded_link: {
      type: 'string';
    };
    link: {
      type: 'link';
    };
    feature_group: {
      type: 'string';
    };
  }
>;
export type FeatureRegularCard = ItemTypeDefinition<
  EnvironmentSettings,
  'DhWS-NuPT9ma66Cwmoii5w',
  {
    title: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    description: {
      type: 'structured_text';
    };
    links: {
      type: 'rich_text';
      blocks: FeatureLink;
    };
    badge: {
      type: 'string';
    };
  }
>;
export type TestimonialCard = ItemTypeDefinition<
  EnvironmentSettings,
  'CM-WSZTuQAKndTLqw0czvg',
  {
    testimonial: {
      type: 'link';
    };
    related_feature: {
      type: 'string';
    };
  }
>;
export type FreeformNavigationBarGroup = ItemTypeDefinition<
  EnvironmentSettings,
  'HEFBIntvTYG8eQQ6frevmw',
  {
    title: {
      type: 'string';
    };
    links: {
      type: 'rich_text';
      blocks: NavigationBarGroupCtaItem;
    };
    call_to_action: {
      type: 'single_block';
      blocks: NavigationBarGroupCta;
    };
  }
>;
export type NavigationBarCta = ItemTypeDefinition<
  EnvironmentSettings,
  'eTcRGXLTR7G2h9auKeUOcw',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
    call_to_action: {
      type: 'single_block';
      blocks: NavigationBarGroupCta;
    };
  }
>;
export type Image = ItemTypeDefinition<
  EnvironmentSettings,
  '810933',
  {
    image: {
      type: 'file';
    };
    frameless: {
      type: 'boolean';
    };
  }
>;
export type InternalVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '810948',
  {
    video: {
      type: 'file';
    };
    thumb_time_seconds: {
      type: 'integer';
    };
  }
>;
export type Partner = ItemTypeDefinition<
  EnvironmentSettings,
  '810914',
  {
    name: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    slug: {
      type: 'slug';
    };
    public_contact_email: {
      type: 'string';
    };
    short_description: {
      type: 'structured_text';
    };
    npm_user: {
      type: 'link';
    };
    website_url: {
      type: 'string';
    };
    logo: {
      type: 'file';
    };
    areas_of_expertise: {
      type: 'links';
    };
    technologies: {
      type: 'links';
    };
    locations: {
      type: 'links';
    };
    featured_projects: {
      type: 'links';
    };
  }
>;
export type IntegrationType = ItemTypeDefinition<
  EnvironmentSettings,
  '810930',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type DocGroup = ItemTypeDefinition<
  EnvironmentSettings,
  '810925',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    pages: {
      type: 'rich_text';
      blocks: DocGroupPage | DocGroupSection;
    };
    tech_starter_kit: {
      type: 'link';
    };
    position: {
      type: 'integer';
    };
    parent_id: {
      type: 'string';
    };
  }
>;
export type VideoTutorial = ItemTypeDefinition<
  EnvironmentSettings,
  '1989693',
  {
    title: {
      type: 'string';
    };
    video_tutorial_resource: {
      type: 'single_block';
      blocks: YoutubeVideoResource | OtherVideoResource;
    };
    show_in_docs_homepage: {
      type: 'boolean';
    };
  }
>;
export type DocFeedback = ItemTypeDefinition<
  EnvironmentSettings,
  'dAVknVWrSCuheQ6Da9v0kQ',
  {
    url: {
      type: 'string';
    };
    positive_reaction: {
      type: 'boolean';
    };
    notes: {
      type: 'text';
    };
    email: {
      type: 'string';
    };
  }
>;
export type ChangelogCategory = ItemTypeDefinition<
  EnvironmentSettings,
  '810926',
  {
    name: {
      type: 'string';
    };
    color: {
      type: 'color';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Website = ItemTypeDefinition<
  EnvironmentSettings,
  '810892',
  {
    title: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    technologies: {
      type: 'links';
    };
    made_by: {
      type: 'link';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Tutorial = ItemTypeDefinition<
  EnvironmentSettings,
  '810923',
  {
    title: {
      type: 'string';
    };
    excerpt: {
      type: 'structured_text';
    };
    url: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Review = ItemTypeDefinition<
  EnvironmentSettings,
  '810911',
  {
    image: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    role: {
      type: 'string';
    };
    quote: {
      type: 'structured_text';
    };
    website: {
      type: 'string';
    };
    use_in_dashboard: {
      type: 'boolean';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type PricingHint = ItemTypeDefinition<
  EnvironmentSettings,
  '810916',
  {
    name: {
      type: 'string';
    };
    api_id: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
    documentation_url: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Integration = ItemTypeDefinition<
  EnvironmentSettings,
  '810918',
  {
    name: {
      type: 'string';
    };
    square_logo: {
      type: 'file';
    };
    logo: {
      type: 'file';
    };
    integration_type: {
      type: 'link';
    };
    project_url: {
      type: 'string';
    };
    landing_url: {
      type: 'string';
    };
    documentation_url: {
      type: 'string';
    };
    plugin_url: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    websites: {
      type: 'json';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Customer = ItemTypeDefinition<
  EnvironmentSettings,
  '810921',
  {
    logo: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type PluginFieldType = ItemTypeDefinition<
  EnvironmentSettings,
  '810922',
  {
    name: {
      type: 'string';
    };
    code: {
      type: 'string';
    };
  }
>;
export type PluginTag = ItemTypeDefinition<
  EnvironmentSettings,
  '810924',
  {
    tag: {
      type: 'string';
    };
  }
>;
export type PluginType = ItemTypeDefinition<
  EnvironmentSettings,
  '810928',
  {
    name: {
      type: 'string';
    };
    code: {
      type: 'string';
    };
  }
>;
export type PluginAuthor = ItemTypeDefinition<
  EnvironmentSettings,
  '810929',
  {
    name: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
  }
>;
export type SuccessStoryTag = ItemTypeDefinition<
  EnvironmentSettings,
  '810961',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type InDepthCta = ItemTypeDefinition<
  EnvironmentSettings,
  '810975',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
    cta_label: {
      type: 'string';
    };
    cta_url: {
      type: 'string';
    };
  }
>;
export type ProductAnnouncement = ItemTypeDefinition<
  EnvironmentSettings,
  '830205',
  {
    area: {
      type: 'string';
    };
    cover: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    announcement: {
      type: 'structured_text';
    };
    blog_post: {
      type: 'link';
    };
  }
>;
export type PlanFeatureGroup = ItemTypeDefinition<
  EnvironmentSettings,
  '2086758',
  {
    name: {
      type: 'string';
    };
    features: {
      type: 'links';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type PlanFeature = ItemTypeDefinition<
  EnvironmentSettings,
  '2086759',
  {
    name: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
    available_on_professional_plan: {
      type: 'boolean';
    };
    more_details_url: {
      type: 'string';
    };
    tags: {
      type: 'json';
    };
  }
>;
export type AcademyCourse = ItemTypeDefinition<
  EnvironmentSettings,
  'U3kd4iQNQbeKldEq1whk8Q',
  {
    illustration: {
      type: 'string';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    introduction: {
      type: 'structured_text';
    };
    chapters: {
      type: 'links';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Badge = ItemTypeDefinition<
  EnvironmentSettings,
  'ViekJq7wTlmlB-9xmNQnzw',
  {
    name: {
      type: 'string';
    };
    emoji: {
      type: 'string';
    };
  }
>;
export type UserGuidesChapter = ItemTypeDefinition<
  EnvironmentSettings,
  'd5_WObmoRb-vKEv8wUTznA',
  {
    title: {
      type: 'string';
    };
    introduction: {
      type: 'structured_text';
    };
    slug: {
      type: 'slug';
    };
    videos: {
      type: 'links';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type SchemaMigration = ItemTypeDefinition<
  EnvironmentSettings,
  '810909',
  {
    name: {
      type: 'string';
    };
  }
>;
export type SupportTopic = ItemTypeDefinition<
  EnvironmentSettings,
  '810919',
  {
    title: {
      type: 'string';
    };
    subtopic_question: {
      type: 'string';
    };
    common_questions: {
      type: 'rich_text';
      blocks: PageLink;
    };
    description: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    disable_contact_form: {
      type: 'boolean';
    };
    contact_form_type: {
      type: 'string';
    };
    auto_responder_type: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
    parent_id: {
      type: 'string';
    };
  }
>;
export type HostingApp = ItemTypeDefinition<
  EnvironmentSettings,
  '810920',
  {
    logo: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    short_description: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
    gallery: {
      type: 'gallery';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo | Video;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type DocPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810891',
  {
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Table
        | CloneButtonForm
        | DeployButtonForm
        | Demo
        | Image
        | MultipleDemosBlock
        | InternalVideo
        | PluginSdkHookGroup
        | DocCallout
        | ReactUiLiveExample
        | TutorialVideo;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    seo: {
      type: 'seo';
    };
  }
>;
export type ProductComparison = ItemTypeDefinition<
  EnvironmentSettings,
  'U_IVjjGWTvKdFmOfUlJWHQ',
  {
    testimonials: {
      type: 'links';
    };
    importer: {
      type: 'single_block';
      blocks: Importer;
    };
    topics: {
      type: 'rich_text';
      blocks: DifferencesOnTopic;
    };
    reasons: {
      type: 'rich_text';
      blocks: ReasonToConsider;
    };
    datocms_characterization: {
      type: 'structured_text';
    };
    slug: {
      type: 'slug';
    };
    seo_social: {
      type: 'seo';
    };
    product: {
      type: 'string';
    };
    competitor_characterization: {
      type: 'structured_text';
    };
  }
>;
export type Faq = ItemTypeDefinition<
  EnvironmentSettings,
  '810931',
  {
    question: {
      type: 'string';
    };
    answer: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    position: {
      type: 'integer';
    };
  }
>;
export type TechPartner = ItemTypeDefinition<
  EnvironmentSettings,
  'J2XQLT3VQ82Zxk7OMx7eFQ',
  {
    name: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    slug: {
      type: 'slug';
    };
    short_description: {
      type: 'structured_text';
    };
    public_contact_email: {
      type: 'string';
    };
    npm_user: {
      type: 'link';
    };
    logo: {
      type: 'file';
    };
    website_url: {
      type: 'string';
    };
    areas_of_expertise: {
      type: 'links';
    };
    technologies: {
      type: 'links';
    };
    locations: {
      type: 'links';
    };
  }
>;
export type PluginCollection = ItemTypeDefinition<
  EnvironmentSettings,
  'dNFtu9DSSZSP4LY8yxmc3w',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    slug: {
      type: 'slug';
    };
    plugins: {
      type: 'links';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type SuccessStory = ItemTypeDefinition<
  EnvironmentSettings,
  '810887',
  {
    siblings: {
      type: 'links';
    };
    project_url: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo | Video | InDepthCtaBlock;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    tags: {
      type: 'links';
    };
    cover_image: {
      type: 'file';
    };
    duotone_color1: {
      type: 'color';
    };
    main_results_image: {
      type: 'file';
    };
    challenge: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    use_case: {
      type: 'link';
    };
    result: {
      type: 'structured_text';
    };
    duotone_color2: {
      type: 'color';
    };
    main_results: {
      type: 'rich_text';
      blocks: SuccessStoryResult;
    };
    title: {
      type: 'structured_text';
    };
    logo: {
      type: 'file';
    };
    numbers: {
      type: 'rich_text';
      blocks: SuccessStoryNumber;
    };
    accent_color: {
      type: 'color';
    };
    subtitle: {
      type: 'structured_text';
    };
    key_features: {
      type: 'links';
    };
    industry: {
      type: 'links';
    };
    partner: {
      type: 'link';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type AcademyChapter = ItemTypeDefinition<
  EnvironmentSettings,
  'UJ1OC5KlT226qOIdOvQ7Hg',
  {
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo | Table;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
  }
>;
export type EnterpriseApp = ItemTypeDefinition<
  EnvironmentSettings,
  '810915',
  {
    logo: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    short_description: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
    gallery: {
      type: 'gallery';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo | Video;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type ChangelogEntry = ItemTypeDefinition<
  EnvironmentSettings,
  '810908',
  {
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    seo: {
      type: 'seo';
    };
    show_in_blog: {
      type: 'boolean';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    categories: {
      type: 'links';
    };
  }
>;
export type Continent = ItemTypeDefinition<
  EnvironmentSettings,
  '810904',
  {
    code: {
      type: 'string';
    };
    name: {
      type: 'string';
    };
  }
>;
export type Person = ItemTypeDefinition<
  EnvironmentSettings,
  'aT1tvicdQxipzFSYwVpX3w',
  {
    avatar: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    company: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type ExpertiseArea = ItemTypeDefinition<
  EnvironmentSettings,
  '1246759',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type GlossaryEntry = ItemTypeDefinition<
  EnvironmentSettings,
  'DZJw1D-_Scyp6GOWQzQhBA',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
    url: {
      type: 'string';
    };
  }
>;
export type Country = ItemTypeDefinition<
  EnvironmentSettings,
  '810905',
  {
    name: {
      type: 'string';
    };
    code: {
      type: 'string';
    };
    continent: {
      type: 'link';
    };
    capital: {
      type: 'string';
    };
    emoji: {
      type: 'string';
    };
    coordinates: {
      type: 'lat_lon';
    };
  }
>;
export type Author = ItemTypeDefinition<
  EnvironmentSettings,
  '810912',
  {
    avatar: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type LandingPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810906',
  {
    seo_h1: {
      type: 'string';
    };
    name: {
      type: 'string';
    };
    demo: {
      type: 'link';
    };
    docs_url: {
      type: 'string';
    };
    integration: {
      type: 'link';
    };
    slug: {
      type: 'slug';
    };
    seo: {
      type: 'seo';
    };
    title: {
      type: 'structured_text';
    };
    subtitle: {
      type: 'text';
    };
    yoast_analysis: {
      type: 'json';
    };
    content: {
      type: 'rich_text';
      blocks:
        | CodeExcerptBlock
        | ImageTransformationsBlock
        | QuoteLink
        | ModularBlocksBlock
        | LandingProgressiveImagesBlock
        | GraphqlDemoBlock
        | LandingCdnMapBlock
        | TryDemoBlock
        | LandingVideoBlock
        | ShopifyProduct;
    };
  }
>;
export type Industry = ItemTypeDefinition<
  EnvironmentSettings,
  'NjblK_ClRVapciBad3DU9g',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type CustomerStory = ItemTypeDefinition<
  EnvironmentSettings,
  'AwLZL1fhRjaTglnFeGDgyw',
  {
    seo_h1: {
      type: 'string';
    };
    cover_image: {
      type: 'file';
    };
    siblings: {
      type: 'links';
    };
    seo_settings: {
      type: 'seo';
    };
    title: {
      type: 'string';
    };
    yoast_analysis: {
      type: 'json';
    };
    slug: {
      type: 'slug';
    };
    canonical_url: {
      type: 'string';
    };
    excerpt: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Table
        | Demo
        | Image
        | QuestionAnswer
        | MultipleDemosBlock
        | InternalVideo
        | Video
        | CodesandboxEmbedBlock
        | CtaButton
        | ShowcaseProjectBlock
        | TutorialVideo;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    partner: {
      type: 'link';
    };
    people: {
      type: 'links';
    };
  }
>;
export type TeamMember = ItemTypeDefinition<
  EnvironmentSettings,
  '810917',
  {
    legacy_avatar: {
      type: 'file';
    };
    avatar: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    role: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type UseCasePage = ItemTypeDefinition<
  EnvironmentSettings,
  'AEpdxu11TLq_NGCUWlqJcA',
  {
    title: {
      type: 'structured_text';
    };
    success_story_header: {
      type: 'structured_text';
    };
    quotes_header: {
      type: 'structured_text';
    };
    features_header: {
      type: 'string';
    };
    subtitle: {
      type: 'structured_text';
    };
    navigation_bar_title: {
      type: 'string';
    };
    headline: {
      type: 'structured_text';
    };
    heading: {
      type: 'string';
    };
    header: {
      type: 'structured_text';
    };
    summary: {
      type: 'structured_text';
    };
    hero_customer: {
      type: 'file';
    };
    quotes: {
      type: 'links';
    };
    description: {
      type: 'structured_text';
    };
    callout: {
      type: 'rich_text';
      blocks: UseCaseCallout;
    };
    starter_title: {
      type: 'structured_text';
    };
    hero_product: {
      type: 'file';
    };
    case_study: {
      type: 'link';
    };
    image: {
      type: 'file';
    };
    starter_description: {
      type: 'structured_text';
    };
    hero_image: {
      type: 'file';
    };
    link: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    starter_image: {
      type: 'file';
    };
    seo: {
      type: 'seo';
    };
    readability: {
      type: 'json';
    };
  }
>;
export type PartnerTestimonial = ItemTypeDefinition<
  EnvironmentSettings,
  'PTojBPaHTryBkxOuSi49mA',
  {
    partner: {
      type: 'link';
    };
    quote: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    role: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
  }
>;
export type TemplateDemo = ItemTypeDefinition<
  EnvironmentSettings,
  '810910',
  {
    seo: {
      type: 'seo';
    };
    name: {
      type: 'string';
    };
    seo_h1: {
      type: 'string';
    };
    code: {
      type: 'slug';
    };
    yoast_analysis: {
      type: 'json';
    };
    starter_type: {
      type: 'string';
    };
    badge: {
      type: 'link';
    };
    label: {
      type: 'string';
    };
    cms_description: {
      type: 'text';
    };
    technology: {
      type: 'link';
    };
    github_repo: {
      type: 'string';
    };
    screenshot: {
      type: 'file';
    };
    backend_screenshot: {
      type: 'file';
    };
    readme: {
      type: 'text';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Feature = ItemTypeDefinition<
  EnvironmentSettings,
  '1004242',
  {
    seo_h1: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    video: {
      type: 'file';
    };
    video2: {
      type: 'file';
    };
    video3: {
      type: 'file';
    };
    quote: {
      type: 'link';
    };
    quote2: {
      type: 'link';
    };
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
    github_url: {
      type: 'string';
    };
  }
>;
export type ShowcaseProject = ItemTypeDefinition<
  EnvironmentSettings,
  '1246867',
  {
    name: {
      type: 'string';
    };
    project_url: {
      type: 'string';
    };
    main_image: {
      type: 'file';
    };
    slug: {
      type: 'slug';
    };
    partner: {
      type: 'link';
    };
    video: {
      type: 'file';
    };
    headline: {
      type: 'structured_text';
    };
    in_depth_explanation: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    project_screenshots: {
      type: 'gallery';
    };
    technologies: {
      type: 'links';
    };
    datocms_screenshots: {
      type: 'gallery';
    };
    areas_of_expertise: {
      type: 'links';
    };
  }
>;
export type TryTutorial = ItemTypeDefinition<
  EnvironmentSettings,
  'IRlMog2vQN2RnipE9NZCTw',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    video: {
      type: 'file';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Recipe = ItemTypeDefinition<
  EnvironmentSettings,
  'KqL8W3bSSSCZIZJgUEWPqQ',
  {
    title: {
      type: 'string';
    };
    seo_settings: {
      type: 'seo';
    };
    featured_image: {
      type: 'file';
    };
    card_image: {
      type: 'file';
    };
    recipe: {
      type: 'file';
    };
    card_description: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Plugin = ItemTypeDefinition<
  EnvironmentSettings,
  '810913',
  {
    preview_image: {
      type: 'file';
    };
    installs: {
      type: 'integer';
    };
    manually_deprecated: {
      type: 'boolean';
    };
    package_name: {
      type: 'string';
    };
    plugin_type: {
      type: 'link';
    };
    cover_image: {
      type: 'file';
    };
    readme: {
      type: 'text';
    };
    field_types: {
      type: 'links';
    };
    title: {
      type: 'string';
    };
    version: {
      type: 'string';
    };
    tags_csv: {
      type: 'string';
    };
    certified_version: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    parameters: {
      type: 'json';
    };
    seo_settings: {
      type: 'seo';
    };
    entry_point: {
      type: 'string';
    };
    permissions: {
      type: 'json';
    };
    homepage: {
      type: 'string';
    };
    author: {
      type: 'link';
    };
    tags: {
      type: 'links';
    };
    released_at: {
      type: 'date_time';
    };
    legacy: {
      type: 'boolean';
    };
    last_update: {
      type: 'date_time';
    };
  }
>;
export type BlogPost = ItemTypeDefinition<
  EnvironmentSettings,
  '810907',
  {
    seo_h1: {
      type: 'string';
    };
    cover_image: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    seo_settings: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
    slug: {
      type: 'slug';
    };
    canonical_url: {
      type: 'string';
    };
    excerpt: {
      type: 'structured_text';
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    content: {
      type: 'structured_text';
      blocks:
        | Table
        | Demo
        | Image
        | QuestionAnswer
        | MultipleDemosBlock
        | InternalVideo
        | Video
        | CodesandboxEmbedBlock
        | CtaButton
        | ShowcaseProjectBlock
        | TutorialVideo;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    author: {
      type: 'links';
    };
  }
>;
export type UserGuidesEpisode = ItemTypeDefinition<
  EnvironmentSettings,
  'bj_G4ihTRk-DvhI3fFazIw',
  {
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    video: {
      type: 'file';
    };
    thumb_time_seconds: {
      type: 'integer';
    };
    content: {
      type: 'structured_text';
      blocks: InternalVideo;
      inline_blocks:
        | Partner
        | ShowcaseProject
        | EnterpriseApp
        | SuccessStory
        | DocGroup
        | AcademyCourse
        | CustomerStory
        | HostingApp
        | DocPage
        | ChangelogEntry
        | TemplateDemo
        | Feature
        | ProductComparison
        | TechPartner
        | AcademyChapter
        | Plugin
        | UseCasePage
        | LandingPage
        | BlogPost
        | UserGuidesEpisode
        | Recipe;
    };
    seo: {
      type: 'seo';
    };
  }
>;
export type ProductOverview = ItemTypeDefinition<
  EnvironmentSettings,
  'JR9d8BiLTEafv4WeQoQe-w',
  {
    seo: {
      type: 'seo';
    };
    pillars: {
      type: 'rich_text';
      blocks: OverviewPillar;
    };
    testimonials: {
      type: 'links';
    };
    features: {
      type: 'rich_text';
      blocks: OverviewFeature;
    };
    header: {
      type: 'structured_text';
    };
    subheader: {
      type: 'structured_text';
    };
    readability: {
      type: 'json';
    };
  }
>;
export type HowToDatocmsIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'Y2WZFMgnRUqEesXi2f59kg',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type IntegrationsPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810897',
  {
    demos: {
      type: 'links';
    };
    plugins: {
      type: 'links';
    };
    hosting_building: {
      type: 'links';
    };
    enterprise_apps: {
      type: 'links';
    };
  }
>;
export type UserGuidesHome = ItemTypeDefinition<
  EnvironmentSettings,
  'fZ9TOtxBS1qbDL3FBP_aSg',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type CustomerStoriesIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'S9fiDLO0SE2OWqJrSIKDcA',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type AcademyPage = ItemTypeDefinition<
  EnvironmentSettings,
  'NF8A8JWdSwC0FixwtuZ4aA',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type SuccessStoriesIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'YXVZj4IQRdiaCWcSp0bm-Q',
  {
    seo: {
      type: 'seo';
    };
    highlight: {
      type: 'link';
    };
  }
>;
export type RecipesPage = ItemTypeDefinition<
  EnvironmentSettings,
  'Ye9qbJIORQuaI3oHPNuuwQ',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type PartnersPage = ItemTypeDefinition<
  EnvironmentSettings,
  '1561524',
  {
    highlighted_partners: {
      type: 'links';
    };
  }
>;
export type GlossaryPage = ItemTypeDefinition<
  EnvironmentSettings,
  'aS9vaBovQeSezaqiNBFqag',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type DocsPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810898',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type Changelog = ItemTypeDefinition<
  EnvironmentSettings,
  '810900',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type PricingPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810901',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type HomePage = ItemTypeDefinition<
  EnvironmentSettings,
  '810896',
  {
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
  }
>;
export type TechPartnersPage = ItemTypeDefinition<
  EnvironmentSettings,
  'BnnwdGVQRIePQMTC-j94lA',
  {
    highlighted_partners: {
      type: 'links';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export type AboutPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810894',
  {
    seo_field: {
      type: 'seo';
    };
  }
>;
export type Blog = ItemTypeDefinition<
  EnvironmentSettings,
  '810899',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export type PluginsPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810895',
  {
    highlighted: {
      type: 'links';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export type UseCasesPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810903',
  {
    title: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export type NavigationBar = ItemTypeDefinition<
  EnvironmentSettings,
  'Ji-dZddXQ26-y-jFa-JRvA',
  {
    wall_of_love_quote: {
      type: 'link';
    };
    partners_call_to_action: {
      type: 'single_block';
      blocks: NavigationBarCta;
    };
    customers_call_to_action: {
      type: 'single_block';
      blocks: NavigationBarCta;
    };
    product_call_to_action: {
      type: 'single_block';
      blocks: NavigationBarCta;
    };
    partners_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    knowledge_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    use_cases_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    marketplace_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    blog_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    product_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    video_guides_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    help_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    doc_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    partner_projects_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    customer_chats_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    features_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    who_is_it_for_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    enterprise_stories_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    partner_projects: {
      type: 'links';
    };
    partners_description: {
      type: 'string';
    };
    video_guides: {
      type: 'links';
    };
    use_cases: {
      type: 'links';
    };
    enterprise_stories: {
      type: 'links';
    };
    customer_chats: {
      type: 'links';
    };
    doc_pages: {
      type: 'links';
    };
  }
>;
export type FeaturesIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'IFE-sYUmTDao2ng75Qc6Jw',
  {
    security_and_infrastructure_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    core_features_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    developer_experience_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    editor_experience_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    localization_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    extensibility_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    content_integrity_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    image_video_management_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    governance_and_compliance_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    seo: {
      type: 'seo';
    };
    title: {
      type: 'structured_text';
    };
    readability: {
      type: 'json';
    };
    subtitle: {
      type: 'structured_text';
    };
    hero_image_left: {
      type: 'file';
    };
    hero_image_right: {
      type: 'file';
    };
    highlight_cards: {
      type: 'rich_text';
      blocks: FeatureHighlightCard;
    };
  }
>;
export type AnyBlock =
  | ManagedNavigationBarGroup
  | NavigationBarGroupCta
  | NavigationBarGroupCtaItem
  | Table
  | FeatureLink
  | FeatureHighlightCard
  | CloneButtonForm
  | DeployButtonForm
  | CodeExcerptBlock
  | Demo
  | ImageTransformationsBlock
  | QuestionAnswer
  | MultipleDemosBlock
  | Video
  | PageLink
  | DocGroupPage
  | SuccessStoryNumber
  | SuccessStoryResult
  | ModularBlocksBlock
  | QuoteLink
  | LandingProgressiveImagesBlock
  | GraphqlDemoBlock
  | LandingCdnMapBlock
  | TryDemoBlock
  | LandingVideoBlock
  | CodesandboxEmbedBlock
  | DocGroupSection
  | PluginSdkHookGroup
  | DocCallout
  | ReactUiLiveExample
  | CtaButton
  | YoutubeVideoResource
  | OtherVideoResource
  | ShowcaseProjectBlock
  | ShopifyProduct
  | TutorialVideo
  | ReasonToConsider
  | Importer
  | DifferencesOnTopic
  | ProductDifference
  | UseCaseFeature
  | UseCaseCallout
  | InDepthCtaBlock
  | OverviewPillar
  | OverviewFeature
  | FeatureRegularCard
  | TestimonialCard
  | FreeformNavigationBarGroup
  | NavigationBarCta
  | Image
  | InternalVideo;
export type AnyModel =
  | Llmstxt
  | AssetsHardcodedInWebsite
  | TeamPage
  | Partner
  | IntegrationType
  | DocGroup
  | VideoTutorial
  | DocFeedback
  | ChangelogCategory
  | Website
  | Tutorial
  | Review
  | PricingHint
  | Integration
  | Customer
  | PluginFieldType
  | PluginTag
  | PluginType
  | PluginAuthor
  | SuccessStoryTag
  | InDepthCta
  | ProductAnnouncement
  | PlanFeatureGroup
  | PlanFeature
  | AcademyCourse
  | Badge
  | UserGuidesChapter
  | SchemaMigration
  | SupportTopic
  | HostingApp
  | DocPage
  | ProductComparison
  | Faq
  | TechPartner
  | PluginCollection
  | SuccessStory
  | AcademyChapter
  | EnterpriseApp
  | ChangelogEntry
  | Continent
  | Person
  | ExpertiseArea
  | GlossaryEntry
  | Country
  | Author
  | LandingPage
  | Industry
  | CustomerStory
  | TeamMember
  | UseCasePage
  | PartnerTestimonial
  | TemplateDemo
  | Feature
  | ShowcaseProject
  | TryTutorial
  | Recipe
  | Plugin
  | BlogPost
  | UserGuidesEpisode
  | ProductOverview
  | HowToDatocmsIndex
  | IntegrationsPage
  | UserGuidesHome
  | CustomerStoriesIndex
  | AcademyPage
  | SuccessStoriesIndex
  | RecipesPage
  | PartnersPage
  | GlossaryPage
  | DocsPage
  | Changelog
  | PricingPage
  | HomePage
  | TechPartnersPage
  | AboutPage
  | Blog
  | PluginsPage
  | UseCasesPage
  | NavigationBar
  | FeaturesIndex;
export type AnyBlockOrModel = AnyBlock | AnyModel;
