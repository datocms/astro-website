import type { ItemTypeDefinition } from '@datocms/cma-client';

type EnvironmentSettings = {
  locales: 'en';
};

export type CloneButtonForm = ItemTypeDefinition<
  EnvironmentSettings,
  '810884',
  {}
>;
export const CloneButtonForm = {
  ID: '810884',
  REF: { type: 'item_type', id: '810884' },
} as const;

export type DeployButtonForm = ItemTypeDefinition<
  EnvironmentSettings,
  '810885',
  {}
>;
export const DeployButtonForm = {
  ID: '810885',
  REF: { type: 'item_type', id: '810885' },
} as const;

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
export const CodeExcerptBlock = {
  ID: '810886',
  REF: { type: 'item_type', id: '810886' },
} as const;

export type SuccessStory = ItemTypeDefinition<
  EnvironmentSettings,
  '810887',
  {
    challenge: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo | Video | InDepthCtaBlock;
    };
    cover_image: {
      type: 'file';
    };
    duotone_color1: {
      type: 'color';
    };
    tags: {
      type: 'links';
    };
    project_url: {
      type: 'string';
    };
    main_results_image: {
      type: 'file';
    };
    use_case: {
      type: 'link';
    };
    title: {
      type: 'structured_text';
    };
    slug: {
      type: 'slug';
    };
    result: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    main_results: {
      type: 'rich_text';
      blocks: SuccessStoryResult;
    };
    duotone_color2: {
      type: 'color';
    };
    numbers: {
      type: 'rich_text';
      blocks: SuccessStoryNumber;
    };
    logo: {
      type: 'file';
    };
    key_features: {
      type: 'links';
    };
    subtitle: {
      type: 'structured_text';
    };
    accent_color: {
      type: 'color';
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
export const SuccessStory = {
  ID: '810887',
  REF: { type: 'item_type', id: '810887' },
} as const;

export type Demo = ItemTypeDefinition<
  EnvironmentSettings,
  '810890',
  {
    demo: {
      type: 'link';
    };
  }
>;
export const Demo = {
  ID: '810890',
  REF: { type: 'item_type', id: '810890' },
} as const;

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
        | CloneButtonForm
        | DeployButtonForm
        | Demo
        | Image
        | MultipleDemosBlock
        | InternalVideo
        | PluginSdkHookGroup
        | DocCallout
        | ReactUiLiveExample
        | TutorialVideo
        | Table
        | TabsBlock
        | CopyPromptButtonBlock
        | GithubNpmBadge;
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const DocPage = {
  ID: '810891',
  REF: { type: 'item_type', id: '810891' },
} as const;

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
export const Website = {
  ID: '810892',
  REF: { type: 'item_type', id: '810892' },
} as const;

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
export const ImageTransformationsBlock = {
  ID: '810893',
  REF: { type: 'item_type', id: '810893' },
} as const;

export type AboutPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810894',
  {
    seo_field: {
      type: 'seo';
    };
  }
>;
export const AboutPage = {
  ID: '810894',
  REF: { type: 'item_type', id: '810894' },
} as const;

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
export const PluginsPage = {
  ID: '810895',
  REF: { type: 'item_type', id: '810895' },
} as const;

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
export const HomePage = {
  ID: '810896',
  REF: { type: 'item_type', id: '810896' },
} as const;

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
export const IntegrationsPage = {
  ID: '810897',
  REF: { type: 'item_type', id: '810897' },
} as const;

export type DocsPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810898',
  {
    seo: {
      type: 'seo';
    };
    sections: {
      type: 'rich_text';
      blocks: DocsHomeSectionBlock;
    };
  }
>;
export const DocsPage = {
  ID: '810898',
  REF: { type: 'item_type', id: '810898' },
} as const;

export type Blog = ItemTypeDefinition<
  EnvironmentSettings,
  '810899',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const Blog = {
  ID: '810899',
  REF: { type: 'item_type', id: '810899' },
} as const;

export type Changelog = ItemTypeDefinition<
  EnvironmentSettings,
  '810900',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const Changelog = {
  ID: '810900',
  REF: { type: 'item_type', id: '810900' },
} as const;

export type PricingPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810901',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const PricingPage = {
  ID: '810901',
  REF: { type: 'item_type', id: '810901' },
} as const;

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
export const UseCasesPage = {
  ID: '810903',
  REF: { type: 'item_type', id: '810903' },
} as const;

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
export const Continent = {
  ID: '810904',
  REF: { type: 'item_type', id: '810904' },
} as const;

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
export const Country = {
  ID: '810905',
  REF: { type: 'item_type', id: '810905' },
} as const;

export type LandingPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810906',
  {
    demo: {
      type: 'link';
    };
    name: {
      type: 'string';
    };
    seo_h1: {
      type: 'string';
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
export const LandingPage = {
  ID: '810906',
  REF: { type: 'item_type', id: '810906' },
} as const;

export type BlogPost = ItemTypeDefinition<
  EnvironmentSettings,
  '810907',
  {
    cover_image: {
      type: 'file';
    };
    seo_h1: {
      type: 'string';
    };
    seo_settings: {
      type: 'seo';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    yoast_analysis: {
      type: 'json';
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
        | Demo
        | Image
        | QuestionAnswer
        | MultipleDemosBlock
        | InternalVideo
        | Video
        | CodesandboxEmbedBlock
        | CtaButton
        | TutorialVideo
        | ShowcaseProjectBlock
        | Table
        | ImageCarousel
        | TabsBlock
        | CopyPromptButtonBlock;
    };
    author: {
      type: 'links';
    };
  }
>;
export const BlogPost = {
  ID: '810907',
  REF: { type: 'item_type', id: '810907' },
} as const;

export type ChangelogEntry = ItemTypeDefinition<
  EnvironmentSettings,
  '810908',
  {
    slug: {
      type: 'slug';
    };
    title: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
    show_in_blog: {
      type: 'boolean';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo | TabsBlock | CopyPromptButtonBlock;
    };
    categories: {
      type: 'links';
    };
  }
>;
export const ChangelogEntry = {
  ID: '810908',
  REF: { type: 'item_type', id: '810908' },
} as const;

export type SchemaMigration = ItemTypeDefinition<
  EnvironmentSettings,
  '810909',
  {
    name: {
      type: 'string';
    };
  }
>;
export const SchemaMigration = {
  ID: '810909',
  REF: { type: 'item_type', id: '810909' },
} as const;

export type TemplateDemo = ItemTypeDefinition<
  EnvironmentSettings,
  '810910',
  {
    name: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
    code: {
      type: 'slug';
    };
    seo_h1: {
      type: 'string';
    };
    starter_type: {
      type: 'string';
    };
    yoast_analysis: {
      type: 'json';
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
export const TemplateDemo = {
  ID: '810910',
  REF: { type: 'item_type', id: '810910' },
} as const;

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
export const Review = {
  ID: '810911',
  REF: { type: 'item_type', id: '810911' },
} as const;

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
export const Author = {
  ID: '810912',
  REF: { type: 'item_type', id: '810912' },
} as const;

export type Plugin = ItemTypeDefinition<
  EnvironmentSettings,
  '810913',
  {
    cover_image: {
      type: 'file';
    };
    installs: {
      type: 'integer';
    };
    legacy: {
      type: 'boolean';
    };
    manually_deprecated: {
      type: 'boolean';
    };
    package_name: {
      type: 'string';
    };
    preview_image: {
      type: 'file';
    };
    version: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    tags_csv: {
      type: 'string';
    };
    readme: {
      type: 'text';
    };
    plugin_type: {
      type: 'link';
    };
    description: {
      type: 'text';
    };
    entry_point: {
      type: 'string';
    };
    field_types: {
      type: 'links';
    };
    seo_settings: {
      type: 'seo';
    };
    permissions: {
      type: 'json';
    };
    parameters: {
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
    last_update: {
      type: 'date_time';
    };
  }
>;
export const Plugin = {
  ID: '810913',
  REF: { type: 'item_type', id: '810913' },
} as const;

export type Partner = ItemTypeDefinition<
  EnvironmentSettings,
  '810914',
  {
    description: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    npm_user: {
      type: 'link';
    };
    public_contact_email: {
      type: 'string';
    };
    short_description: {
      type: 'structured_text';
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
    featured_projects: {
      type: 'links';
    };
  }
>;
export const Partner = {
  ID: '810914',
  REF: { type: 'item_type', id: '810914' },
} as const;

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
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const EnterpriseApp = {
  ID: '810915',
  REF: { type: 'item_type', id: '810915' },
} as const;

export type PricingHint = ItemTypeDefinition<
  EnvironmentSettings,
  '810916',
  {
    name: {
      type: 'string';
    };
    api_id: {
      type: 'slug';
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
export const PricingHint = {
  ID: '810916',
  REF: { type: 'item_type', id: '810916' },
} as const;

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
export const TeamMember = {
  ID: '810917',
  REF: { type: 'item_type', id: '810917' },
} as const;

export type Integration = ItemTypeDefinition<
  EnvironmentSettings,
  '810918',
  {
    logo: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    logo_dark: {
      type: 'file';
    };
    integration_type: {
      type: 'link';
    };
    square_logo: {
      type: 'file';
    };
    project_url: {
      type: 'string';
    };
    square_logo_dark: {
      type: 'file';
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
export const Integration = {
  ID: '810918',
  REF: { type: 'item_type', id: '810918' },
} as const;

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
export const SupportTopic = {
  ID: '810919',
  REF: { type: 'item_type', id: '810919' },
} as const;

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
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const HostingApp = {
  ID: '810920',
  REF: { type: 'item_type', id: '810920' },
} as const;

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
export const Customer = {
  ID: '810921',
  REF: { type: 'item_type', id: '810921' },
} as const;

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
export const PluginFieldType = {
  ID: '810922',
  REF: { type: 'item_type', id: '810922' },
} as const;

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
export const Tutorial = {
  ID: '810923',
  REF: { type: 'item_type', id: '810923' },
} as const;

export type PluginTag = ItemTypeDefinition<
  EnvironmentSettings,
  '810924',
  {
    tag: {
      type: 'string';
    };
  }
>;
export const PluginTag = {
  ID: '810924',
  REF: { type: 'item_type', id: '810924' },
} as const;

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
export const DocGroup = {
  ID: '810925',
  REF: { type: 'item_type', id: '810925' },
} as const;

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
export const ChangelogCategory = {
  ID: '810926',
  REF: { type: 'item_type', id: '810926' },
} as const;

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
export const PluginType = {
  ID: '810928',
  REF: { type: 'item_type', id: '810928' },
} as const;

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
export const PluginAuthor = {
  ID: '810929',
  REF: { type: 'item_type', id: '810929' },
} as const;

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
export const IntegrationType = {
  ID: '810930',
  REF: { type: 'item_type', id: '810930' },
} as const;

export type Faq = ItemTypeDefinition<
  EnvironmentSettings,
  '810931',
  {
    question: {
      type: 'string';
    };
    answer: {
      type: 'structured_text';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Faq = {
  ID: '810931',
  REF: { type: 'item_type', id: '810931' },
} as const;

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
export const Image = {
  ID: '810933',
  REF: { type: 'item_type', id: '810933' },
} as const;

export type QuestionAnswer = ItemTypeDefinition<
  EnvironmentSettings,
  '810941',
  {
    question: {
      type: 'structured_text';
    };
    answer: {
      type: 'structured_text';
    };
  }
>;
export const QuestionAnswer = {
  ID: '810941',
  REF: { type: 'item_type', id: '810941' },
} as const;

export type MultipleDemosBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810947',
  {
    demos: {
      type: 'links';
    };
  }
>;
export const MultipleDemosBlock = {
  ID: '810947',
  REF: { type: 'item_type', id: '810947' },
} as const;

export type InternalVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '810948',
  {
    video: {
      type: 'file';
    };
  }
>;
export const InternalVideo = {
  ID: '810948',
  REF: { type: 'item_type', id: '810948' },
} as const;

export type Video = ItemTypeDefinition<
  EnvironmentSettings,
  '810949',
  {
    video: {
      type: 'video';
    };
  }
>;
export const Video = {
  ID: '810949',
  REF: { type: 'item_type', id: '810949' },
} as const;

export type QuoteLink = ItemTypeDefinition<
  EnvironmentSettings,
  '810950',
  {
    quote: {
      type: 'link';
    };
  }
>;
export const QuoteLink = {
  ID: '810950',
  REF: { type: 'item_type', id: '810950' },
} as const;

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
export const PageLink = {
  ID: '810951',
  REF: { type: 'item_type', id: '810951' },
} as const;

export type DocGroupPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810952',
  {
    page: {
      type: 'link';
    };
  }
>;
export const DocGroupPage = {
  ID: '810952',
  REF: { type: 'item_type', id: '810952' },
} as const;

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
export const SuccessStoryNumber = {
  ID: '810953',
  REF: { type: 'item_type', id: '810953' },
} as const;

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
export const SuccessStoryResult = {
  ID: '810954',
  REF: { type: 'item_type', id: '810954' },
} as const;

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
export const ModularBlocksBlock = {
  ID: '810955',
  REF: { type: 'item_type', id: '810955' },
} as const;

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
export const LandingProgressiveImagesBlock = {
  ID: '810956',
  REF: { type: 'item_type', id: '810956' },
} as const;

export type GraphqlDemoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810957',
  {}
>;
export const GraphqlDemoBlock = {
  ID: '810957',
  REF: { type: 'item_type', id: '810957' },
} as const;

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
export const LandingCdnMapBlock = {
  ID: '810958',
  REF: { type: 'item_type', id: '810958' },
} as const;

export type TryDemoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810959',
  {
    title: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export const TryDemoBlock = {
  ID: '810959',
  REF: { type: 'item_type', id: '810959' },
} as const;

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
export const LandingVideoBlock = {
  ID: '810960',
  REF: { type: 'item_type', id: '810960' },
} as const;

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
export const SuccessStoryTag = {
  ID: '810961',
  REF: { type: 'item_type', id: '810961' },
} as const;

export type InDepthCtaBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810963',
  {
    cta: {
      type: 'link';
    };
  }
>;
export const InDepthCtaBlock = {
  ID: '810963',
  REF: { type: 'item_type', id: '810963' },
} as const;

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
export const InDepthCta = {
  ID: '810975',
  REF: { type: 'item_type', id: '810975' },
} as const;

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
    slug: {
      type: 'slug';
    };
    title: {
      type: 'string';
    };
    announcement: {
      type: 'structured_text';
    };
    blog_post: {
      type: 'link';
    };
  }
>;
export const ProductAnnouncement = {
  ID: '830205',
  REF: { type: 'item_type', id: '830205' },
} as const;

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
export const Feature = {
  ID: '1004242',
  REF: { type: 'item_type', id: '1004242' },
} as const;

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
export const TeamPage = {
  ID: '1099227',
  REF: { type: 'item_type', id: '1099227' },
} as const;

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
export const CodesandboxEmbedBlock = {
  ID: '1113148',
  REF: { type: 'item_type', id: '1113148' },
} as const;

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
export const ExpertiseArea = {
  ID: '1246759',
  REF: { type: 'item_type', id: '1246759' },
} as const;

export type ShowcaseProject = ItemTypeDefinition<
  EnvironmentSettings,
  '1246867',
  {
    main_image: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    project_url: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    headline: {
      type: 'structured_text';
    };
    in_depth_explanation: {
      type: 'structured_text';
    };
    partner: {
      type: 'link';
    };
    video: {
      type: 'file';
    };
    project_screenshots: {
      type: 'gallery';
    };
    technologies: {
      type: 'links';
    };
    areas_of_expertise: {
      type: 'links';
    };
    datocms_screenshots: {
      type: 'gallery';
    };
  }
>;
export const ShowcaseProject = {
  ID: '1246867',
  REF: { type: 'item_type', id: '1246867' },
} as const;

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
export const DocGroupSection = {
  ID: '1410358',
  REF: { type: 'item_type', id: '1410358' },
} as const;

export type PluginSdkHookGroup = ItemTypeDefinition<
  EnvironmentSettings,
  '1410429',
  {
    group_name: {
      type: 'string';
    };
  }
>;
export const PluginSdkHookGroup = {
  ID: '1410429',
  REF: { type: 'item_type', id: '1410429' },
} as const;

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
    };
  }
>;
export const DocCallout = {
  ID: '1437522',
  REF: { type: 'item_type', id: '1437522' },
} as const;

export type ReactUiLiveExample = ItemTypeDefinition<
  EnvironmentSettings,
  '1470085',
  {
    component_name: {
      type: 'string';
    };
  }
>;
export const ReactUiLiveExample = {
  ID: '1470085',
  REF: { type: 'item_type', id: '1470085' },
} as const;

export type PartnersPage = ItemTypeDefinition<
  EnvironmentSettings,
  '1561524',
  {
    highlighted_partners: {
      type: 'links';
    };
  }
>;
export const PartnersPage = {
  ID: '1561524',
  REF: { type: 'item_type', id: '1561524' },
} as const;

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
export const CtaButton = {
  ID: '1989011',
  REF: { type: 'item_type', id: '1989011' },
} as const;

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
export const VideoTutorial = {
  ID: '1989693',
  REF: { type: 'item_type', id: '1989693' },
} as const;

export type YoutubeVideoResource = ItemTypeDefinition<
  EnvironmentSettings,
  '1989694',
  {
    video: {
      type: 'video';
    };
  }
>;
export const YoutubeVideoResource = {
  ID: '1989694',
  REF: { type: 'item_type', id: '1989694' },
} as const;

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
export const OtherVideoResource = {
  ID: '1989695',
  REF: { type: 'item_type', id: '1989695' },
} as const;

export type TutorialVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '1989853',
  {
    tutorials: {
      type: 'links';
    };
  }
>;
export const TutorialVideo = {
  ID: '1989853',
  REF: { type: 'item_type', id: '1989853' },
} as const;

export type ShowcaseProjectBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '2023385',
  {
    showcase_projects: {
      type: 'links';
    };
  }
>;
export const ShowcaseProjectBlock = {
  ID: '2023385',
  REF: { type: 'item_type', id: '2023385' },
} as const;

export type Table = ItemTypeDefinition<
  EnvironmentSettings,
  '2033750',
  {
    table: {
      type: 'json';
    };
  }
>;
export const Table = {
  ID: '2033750',
  REF: { type: 'item_type', id: '2033750' },
} as const;

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
export const PlanFeatureGroup = {
  ID: '2086758',
  REF: { type: 'item_type', id: '2086758' },
} as const;

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
    related_pricing_hint: {
      type: 'link';
    };
  }
>;
export const PlanFeature = {
  ID: '2086759',
  REF: { type: 'item_type', id: '2086759' },
} as const;

export type ShopifyProduct = ItemTypeDefinition<
  EnvironmentSettings,
  '2093824',
  {
    shopify_product_id: {
      type: 'string';
    };
  }
>;
export const ShopifyProduct = {
  ID: '2093824',
  REF: { type: 'item_type', id: '2093824' },
} as const;

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
    features_header: {
      type: 'string';
    };
    quotes_header: {
      type: 'structured_text';
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
    hero_customer: {
      type: 'file';
    };
    summary: {
      type: 'structured_text';
    };
    description: {
      type: 'structured_text';
    };
    quotes: {
      type: 'links';
    };
    callout: {
      type: 'rich_text';
      blocks: UseCaseCallout;
    };
    case_study: {
      type: 'link';
    };
    starter_title: {
      type: 'structured_text';
    };
    hero_product: {
      type: 'file';
    };
    starter_description: {
      type: 'structured_text';
    };
    image: {
      type: 'file';
    };
    hero_image: {
      type: 'file';
    };
    slug: {
      type: 'slug';
    };
    link: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
    starter_image: {
      type: 'file';
    };
    readability: {
      type: 'json';
    };
  }
>;
export const UseCasePage = {
  ID: 'AEpdxu11TLq_NGCUWlqJcA',
  REF: { type: 'item_type', id: 'AEpdxu11TLq_NGCUWlqJcA' },
} as const;

export type CustomerStory = ItemTypeDefinition<
  EnvironmentSettings,
  'AwLZL1fhRjaTglnFeGDgyw',
  {
    cover_image: {
      type: 'file';
    };
    seo_h1: {
      type: 'string';
    };
    seo_settings: {
      type: 'seo';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    yoast_analysis: {
      type: 'json';
    };
    agency: {
      type: 'link';
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
        | Demo
        | Image
        | QuestionAnswer
        | MultipleDemosBlock
        | InternalVideo
        | Video
        | CodesandboxEmbedBlock
        | CtaButton
        | TutorialVideo
        | ShowcaseProjectBlock
        | Table
        | TabsBlock;
    };
    partner: {
      type: 'link';
    };
    people: {
      type: 'links';
    };
  }
>;
export const CustomerStory = {
  ID: 'AwLZL1fhRjaTglnFeGDgyw',
  REF: { type: 'item_type', id: 'AwLZL1fhRjaTglnFeGDgyw' },
} as const;

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
export const ManagedNavigationBarGroup = {
  ID: 'BIdlCMW1Sf24mfJF-OcQGg',
  REF: { type: 'item_type', id: 'BIdlCMW1Sf24mfJF-OcQGg' },
} as const;

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
export const TechPartnersPage = {
  ID: 'BnnwdGVQRIePQMTC-j94lA',
  REF: { type: 'item_type', id: 'BnnwdGVQRIePQMTC-j94lA' },
} as const;

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
export const TestimonialCard = {
  ID: 'CM-WSZTuQAKndTLqw0czvg',
  REF: { type: 'item_type', id: 'CM-WSZTuQAKndTLqw0czvg' },
} as const;

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
export const GlossaryEntry = {
  ID: 'DZJw1D-_Scyp6GOWQzQhBA',
  REF: { type: 'item_type', id: 'DZJw1D-_Scyp6GOWQzQhBA' },
} as const;

export type FeatureRegularCard = ItemTypeDefinition<
  EnvironmentSettings,
  'DhWS-NuPT9ma66Cwmoii5w',
  {
    title: {
      type: 'string';
    };
    emoji: {
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
export const FeatureRegularCard = {
  ID: 'DhWS-NuPT9ma66Cwmoii5w',
  REF: { type: 'item_type', id: 'DhWS-NuPT9ma66Cwmoii5w' },
} as const;

export type ProcessStepBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'EUBHsUumSRyGOoCzHEV3YA',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'structured_text';
    };
  }
>;
export const ProcessStepBlock = {
  ID: 'EUBHsUumSRyGOoCzHEV3YA',
  REF: { type: 'item_type', id: 'EUBHsUumSRyGOoCzHEV3YA' },
} as const;

export type ResearchProgramPage = ItemTypeDefinition<
  EnvironmentSettings,
  'Fty0JKs5Ql2Bvy-EjndP-Q',
  {
    faqs: {
      type: 'rich_text';
      blocks: QuestionAnswer;
    };
    hero_cta_label: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
    steps: {
      type: 'rich_text';
      blocks: ProcessStepBlock;
    };
    bottom_cta_button_label: {
      type: 'string';
    };
    cta_url: {
      type: 'string';
    };
  }
>;
export const ResearchProgramPage = {
  ID: 'Fty0JKs5Ql2Bvy-EjndP-Q',
  REF: { type: 'item_type', id: 'Fty0JKs5Ql2Bvy-EjndP-Q' },
} as const;

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
export const OverviewFeature = {
  ID: 'FxswcKSLS-ynk9q4v11-Xw',
  REF: { type: 'item_type', id: 'FxswcKSLS-ynk9q4v11-Xw' },
} as const;

export type TabBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'GjLOu646QL6-cZv7-xrZOw',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks: Image | Video | DocCallout;
    };
  }
>;
export const TabBlock = {
  ID: 'GjLOu646QL6-cZv7-xrZOw',
  REF: { type: 'item_type', id: 'GjLOu646QL6-cZv7-xrZOw' },
} as const;

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
export const NavigationBarGroupCta = {
  ID: 'GvnWj4HNTdaAdK90Ed9ryA',
  REF: { type: 'item_type', id: 'GvnWj4HNTdaAdK90Ed9ryA' },
} as const;

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
export const OverviewPillar = {
  ID: 'G-P0C9L0SDiGyQ0UQZXYhg',
  REF: { type: 'item_type', id: 'G-P0C9L0SDiGyQ0UQZXYhg' },
} as const;

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
export const FreeformNavigationBarGroup = {
  ID: 'HEFBIntvTYG8eQQ6frevmw',
  REF: { type: 'item_type', id: 'HEFBIntvTYG8eQQ6frevmw' },
} as const;

export type ImageCarousel = ItemTypeDefinition<
  EnvironmentSettings,
  'HX6gB2qVTHqjaHQL6EnJkw',
  {
    gallery: {
      type: 'gallery';
    };
    carousel_height: {
      type: 'integer';
    };
  }
>;
export const ImageCarousel = {
  ID: 'HX6gB2qVTHqjaHQL6EnJkw',
  REF: { type: 'item_type', id: 'HX6gB2qVTHqjaHQL6EnJkw' },
} as const;

export type FeaturesIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'IFE-sYUmTDao2ng75Qc6Jw',
  {
    content_integrity_blocks: {
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
    extensibility_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    governance_and_compliance_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    image_video_management_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    localization_blocks: {
      type: 'rich_text';
      blocks: TestimonialCard | FeatureRegularCard;
    };
    security_and_infrastructure_blocks: {
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
  }
>;
export const FeaturesIndex = {
  ID: 'IFE-sYUmTDao2ng75Qc6Jw',
  REF: { type: 'item_type', id: 'IFE-sYUmTDao2ng75Qc6Jw' },
} as const;

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
export const TryTutorial = {
  ID: 'IRlMog2vQN2RnipE9NZCTw',
  REF: { type: 'item_type', id: 'IRlMog2vQN2RnipE9NZCTw' },
} as const;

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
export const UseCaseCallout = {
  ID: 'IlHaJt28TL6yyA3s7LeOpg',
  REF: { type: 'item_type', id: 'IlHaJt28TL6yyA3s7LeOpg' },
} as const;

export type ProductOverview = ItemTypeDefinition<
  EnvironmentSettings,
  'JR9d8BiLTEafv4WeQoQe-w',
  {
    features: {
      type: 'rich_text';
      blocks: OverviewFeature;
    };
    header: {
      type: 'structured_text';
    };
    pillars: {
      type: 'rich_text';
      blocks: OverviewPillar;
    };
    seo: {
      type: 'seo';
    };
    testimonials: {
      type: 'links';
    };
    readability: {
      type: 'json';
    };
    subheader: {
      type: 'structured_text';
    };
  }
>;
export const ProductOverview = {
  ID: 'JR9d8BiLTEafv4WeQoQe-w',
  REF: { type: 'item_type', id: 'JR9d8BiLTEafv4WeQoQe-w' },
} as const;

export type NavigationBar = ItemTypeDefinition<
  EnvironmentSettings,
  'Ji-dZddXQ26-y-jFa-JRvA',
  {
    who_is_it_for_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    wall_of_love_quote: {
      type: 'link';
    };
    video_guides_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    use_cases_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    product_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    product_call_to_action: {
      type: 'single_block';
      blocks: NavigationBarCta;
    };
    partners_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    partners_call_to_action: {
      type: 'single_block';
      blocks: NavigationBarCta;
    };
    partner_projects_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    marketplace_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    knowledge_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    help_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    features_group: {
      type: 'single_block';
      blocks: FreeformNavigationBarGroup;
    };
    enterprise_stories_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    doc_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    customers_call_to_action: {
      type: 'single_block';
      blocks: NavigationBarCta;
    };
    customer_chats_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    blog_group: {
      type: 'single_block';
      blocks: ManagedNavigationBarGroup;
    };
    partner_projects: {
      type: 'links';
    };
    partners_description: {
      type: 'string';
    };
    enterprise_stories: {
      type: 'links';
    };
    doc_pages: {
      type: 'links';
    };
    use_cases: {
      type: 'links';
    };
    video_guides: {
      type: 'links';
    };
    customer_chats: {
      type: 'links';
    };
  }
>;
export const NavigationBar = {
  ID: 'Ji-dZddXQ26-y-jFa-JRvA',
  REF: { type: 'item_type', id: 'Ji-dZddXQ26-y-jFa-JRvA' },
} as const;

export type TechPartner = ItemTypeDefinition<
  EnvironmentSettings,
  'J2XQLT3VQ82Zxk7OMx7eFQ',
  {
    description: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    npm_user: {
      type: 'link';
    };
    public_contact_email: {
      type: 'string';
    };
    short_description: {
      type: 'structured_text';
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
export const TechPartner = {
  ID: 'J2XQLT3VQ82Zxk7OMx7eFQ',
  REF: { type: 'item_type', id: 'J2XQLT3VQ82Zxk7OMx7eFQ' },
} as const;

export type Recipe = ItemTypeDefinition<
  EnvironmentSettings,
  'KqL8W3bSSSCZIZJgUEWPqQ',
  {
    card_image: {
      type: 'file';
    };
    featured_image: {
      type: 'file';
    };
    seo_settings: {
      type: 'seo';
    };
    title: {
      type: 'string';
    };
    card_description: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks: Image | InternalVideo;
    };
    recipe: {
      type: 'file';
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Recipe = {
  ID: 'KqL8W3bSSSCZIZJgUEWPqQ',
  REF: { type: 'item_type', id: 'KqL8W3bSSSCZIZJgUEWPqQ' },
} as const;

export type DocsHomeSectionBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'LPUbZKMLS4eQxDdRsESXFg',
  {
    kicker: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    width: {
      type: 'string';
    };
    columns: {
      type: 'string';
    };
    cards: {
      type: 'rich_text';
      blocks: DocsHomeDocCardBlock | DocsHomeExternalCardBlock;
    };
  }
>;
export const DocsHomeSectionBlock = {
  ID: 'LPUbZKMLS4eQxDdRsESXFg',
  REF: { type: 'item_type', id: 'LPUbZKMLS4eQxDdRsESXFg' },
} as const;

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
export const DifferencesOnTopic = {
  ID: 'M8ubDKZ1TpaB-IOqO_h7MQ',
  REF: { type: 'item_type', id: 'M8ubDKZ1TpaB-IOqO_h7MQ' },
} as const;

export type AcademyPage = ItemTypeDefinition<
  EnvironmentSettings,
  'NF8A8JWdSwC0FixwtuZ4aA',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const AcademyPage = {
  ID: 'NF8A8JWdSwC0FixwtuZ4aA',
  REF: { type: 'item_type', id: 'NF8A8JWdSwC0FixwtuZ4aA' },
} as const;

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
export const Industry = {
  ID: 'NjblK_ClRVapciBad3DU9g',
  REF: { type: 'item_type', id: 'NjblK_ClRVapciBad3DU9g' },
} as const;

export type ReasonToConsider = ItemTypeDefinition<
  EnvironmentSettings,
  'NwCxRpLVQ3q-CoPiDVO-Iw',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export const ReasonToConsider = {
  ID: 'NwCxRpLVQ3q-CoPiDVO-Iw',
  REF: { type: 'item_type', id: 'NwCxRpLVQ3q-CoPiDVO-Iw' },
} as const;

export type TabsBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'Ofx0DBoZT4qi3lR538stGQ',
  {
    tabs: {
      type: 'rich_text';
      blocks: TabBlock;
    };
  }
>;
export const TabsBlock = {
  ID: 'Ofx0DBoZT4qi3lR538stGQ',
  REF: { type: 'item_type', id: 'Ofx0DBoZT4qi3lR538stGQ' },
} as const;

export type AssetsHardcodedInWebsite = ItemTypeDefinition<
  EnvironmentSettings,
  'PKb12X7FSmCFNPGwEfimrw',
  {
    assets: {
      type: 'gallery';
    };
  }
>;
export const AssetsHardcodedInWebsite = {
  ID: 'PKb12X7FSmCFNPGwEfimrw',
  REF: { type: 'item_type', id: 'PKb12X7FSmCFNPGwEfimrw' },
} as const;

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
export const PartnerTestimonial = {
  ID: 'PTojBPaHTryBkxOuSi49mA',
  REF: { type: 'item_type', id: 'PTojBPaHTryBkxOuSi49mA' },
} as const;

export type ProductDifference = ItemTypeDefinition<
  EnvironmentSettings,
  'PwpYYgGtTUShgE8OhyQrpA',
  {
    datocms_take: {
      type: 'structured_text';
    };
    competitor_take: {
      type: 'structured_text';
    };
  }
>;
export const ProductDifference = {
  ID: 'PwpYYgGtTUShgE8OhyQrpA',
  REF: { type: 'item_type', id: 'PwpYYgGtTUShgE8OhyQrpA' },
} as const;

export type CopyPromptButtonBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'QHwi-9HiQ56AAymCe-1spg',
  {
    prompt: {
      type: 'text';
    };
  }
>;
export const CopyPromptButtonBlock = {
  ID: 'QHwi-9HiQ56AAymCe-1spg',
  REF: { type: 'item_type', id: 'QHwi-9HiQ56AAymCe-1spg' },
} as const;

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
export const UseCaseFeature = {
  ID: 'RTkvuDGkQIaOL47H-TxDIg',
  REF: { type: 'item_type', id: 'RTkvuDGkQIaOL47H-TxDIg' },
} as const;

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
export const NavigationBarGroupCtaItem = {
  ID: 'S2m3MgQ9QsOYO9TcOl0onQ',
  REF: { type: 'item_type', id: 'S2m3MgQ9QsOYO9TcOl0onQ' },
} as const;

export type CustomerStoriesIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'S9fiDLO0SE2OWqJrSIKDcA',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const CustomerStoriesIndex = {
  ID: 'S9fiDLO0SE2OWqJrSIKDcA',
  REF: { type: 'item_type', id: 'S9fiDLO0SE2OWqJrSIKDcA' },
} as const;

export type GithubNpmBadge = ItemTypeDefinition<
  EnvironmentSettings,
  'T6Mjq1StSxW48KN6GVaqKA',
  {
    github_url: {
      type: 'string';
    };
    npm_url: {
      type: 'string';
    };
  }
>;
export const GithubNpmBadge = {
  ID: 'T6Mjq1StSxW48KN6GVaqKA',
  REF: { type: 'item_type', id: 'T6Mjq1StSxW48KN6GVaqKA' },
} as const;

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
      blocks: Image | InternalVideo | Table | TabsBlock;
    };
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
  }
>;
export const AcademyChapter = {
  ID: 'UJ1OC5KlT226qOIdOvQ7Hg',
  REF: { type: 'item_type', id: 'UJ1OC5KlT226qOIdOvQ7Hg' },
} as const;

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
export const AcademyCourse = {
  ID: 'U3kd4iQNQbeKldEq1whk8Q',
  REF: { type: 'item_type', id: 'U3kd4iQNQbeKldEq1whk8Q' },
} as const;

export type ProductComparison = ItemTypeDefinition<
  EnvironmentSettings,
  'U_IVjjGWTvKdFmOfUlJWHQ',
  {
    datocms_characterization: {
      type: 'structured_text';
    };
    importer: {
      type: 'single_block';
      blocks: Importer;
    };
    reasons: {
      type: 'rich_text';
      blocks: ReasonToConsider;
    };
    slug: {
      type: 'slug';
    };
    testimonials: {
      type: 'links';
    };
    topics: {
      type: 'rich_text';
      blocks: DifferencesOnTopic;
    };
    competitor_characterization: {
      type: 'structured_text';
    };
    product: {
      type: 'string';
    };
    seo_social: {
      type: 'seo';
    };
  }
>;
export const ProductComparison = {
  ID: 'U_IVjjGWTvKdFmOfUlJWHQ',
  REF: { type: 'item_type', id: 'U_IVjjGWTvKdFmOfUlJWHQ' },
} as const;

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
export const Badge = {
  ID: 'ViekJq7wTlmlB-9xmNQnzw',
  REF: { type: 'item_type', id: 'ViekJq7wTlmlB-9xmNQnzw' },
} as const;

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
export const Importer = {
  ID: 'WTE6HYFdTXq8Co90Q1Zbuw',
  REF: { type: 'item_type', id: 'WTE6HYFdTXq8Co90Q1Zbuw' },
} as const;

export type DocsHomeDocCardBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'WtrhSbwkSV6aSaKolhcS_g',
  {
    badge: {
      type: 'string';
    };
    target: {
      type: 'link';
    };
    override_title: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
  }
>;
export const DocsHomeDocCardBlock = {
  ID: 'WtrhSbwkSV6aSaKolhcS_g',
  REF: { type: 'item_type', id: 'WtrhSbwkSV6aSaKolhcS_g' },
} as const;

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
export const FeatureLink = {
  ID: 'Xf3p8bFyR5qekJmSD8n80A',
  REF: { type: 'item_type', id: 'Xf3p8bFyR5qekJmSD8n80A' },
} as const;

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
export const SuccessStoriesIndex = {
  ID: 'YXVZj4IQRdiaCWcSp0bm-Q',
  REF: { type: 'item_type', id: 'YXVZj4IQRdiaCWcSp0bm-Q' },
} as const;

export type RecipesPage = ItemTypeDefinition<
  EnvironmentSettings,
  'Ye9qbJIORQuaI3oHPNuuwQ',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const RecipesPage = {
  ID: 'Ye9qbJIORQuaI3oHPNuuwQ',
  REF: { type: 'item_type', id: 'Ye9qbJIORQuaI3oHPNuuwQ' },
} as const;

export type HowToDatocmsIndex = ItemTypeDefinition<
  EnvironmentSettings,
  'Y2WZFMgnRUqEesXi2f59kg',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const HowToDatocmsIndex = {
  ID: 'Y2WZFMgnRUqEesXi2f59kg',
  REF: { type: 'item_type', id: 'Y2WZFMgnRUqEesXi2f59kg' },
} as const;

export type GlossaryPage = ItemTypeDefinition<
  EnvironmentSettings,
  'aS9vaBovQeSezaqiNBFqag',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const GlossaryPage = {
  ID: 'aS9vaBovQeSezaqiNBFqag',
  REF: { type: 'item_type', id: 'aS9vaBovQeSezaqiNBFqag' },
} as const;

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
export const Person = {
  ID: 'aT1tvicdQxipzFSYwVpX3w',
  REF: { type: 'item_type', id: 'aT1tvicdQxipzFSYwVpX3w' },
} as const;

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
    content: {
      type: 'structured_text';
      blocks: InternalVideo;
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const UserGuidesEpisode = {
  ID: 'bj_G4ihTRk-DvhI3fFazIw',
  REF: { type: 'item_type', id: 'bj_G4ihTRk-DvhI3fFazIw' },
} as const;

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
export const PluginCollection = {
  ID: 'dNFtu9DSSZSP4LY8yxmc3w',
  REF: { type: 'item_type', id: 'dNFtu9DSSZSP4LY8yxmc3w' },
} as const;

export type DocsHomeExternalCardBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'dZccjTdAT76O6Zn1K9NCzA',
  {
    badge: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    description: {
      type: 'string';
    };
    cta_label: {
      type: 'string';
    };
  }
>;
export const DocsHomeExternalCardBlock = {
  ID: 'dZccjTdAT76O6Zn1K9NCzA',
  REF: { type: 'item_type', id: 'dZccjTdAT76O6Zn1K9NCzA' },
} as const;

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
export const UserGuidesChapter = {
  ID: 'd5_WObmoRb-vKEv8wUTznA',
  REF: { type: 'item_type', id: 'd5_WObmoRb-vKEv8wUTznA' },
} as const;

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
export const NavigationBarCta = {
  ID: 'eTcRGXLTR7G2h9auKeUOcw',
  REF: { type: 'item_type', id: 'eTcRGXLTR7G2h9auKeUOcw' },
} as const;

export type UserGuidesHome = ItemTypeDefinition<
  EnvironmentSettings,
  'fZ9TOtxBS1qbDL3FBP_aSg',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const UserGuidesHome = {
  ID: 'fZ9TOtxBS1qbDL3FBP_aSg',
  REF: { type: 'item_type', id: 'fZ9TOtxBS1qbDL3FBP_aSg' },
} as const;

export type AnyBlock =
  | CloneButtonForm
  | DeployButtonForm
  | CodeExcerptBlock
  | Demo
  | ImageTransformationsBlock
  | Image
  | QuestionAnswer
  | MultipleDemosBlock
  | InternalVideo
  | Video
  | QuoteLink
  | PageLink
  | DocGroupPage
  | SuccessStoryNumber
  | SuccessStoryResult
  | ModularBlocksBlock
  | LandingProgressiveImagesBlock
  | GraphqlDemoBlock
  | LandingCdnMapBlock
  | TryDemoBlock
  | LandingVideoBlock
  | InDepthCtaBlock
  | CodesandboxEmbedBlock
  | DocGroupSection
  | PluginSdkHookGroup
  | DocCallout
  | ReactUiLiveExample
  | CtaButton
  | YoutubeVideoResource
  | OtherVideoResource
  | TutorialVideo
  | ShowcaseProjectBlock
  | Table
  | ShopifyProduct
  | ManagedNavigationBarGroup
  | TestimonialCard
  | FeatureRegularCard
  | ProcessStepBlock
  | OverviewFeature
  | TabBlock
  | NavigationBarGroupCta
  | OverviewPillar
  | FreeformNavigationBarGroup
  | ImageCarousel
  | UseCaseCallout
  | DocsHomeSectionBlock
  | DifferencesOnTopic
  | ReasonToConsider
  | TabsBlock
  | ProductDifference
  | CopyPromptButtonBlock
  | UseCaseFeature
  | NavigationBarGroupCtaItem
  | GithubNpmBadge
  | Importer
  | DocsHomeDocCardBlock
  | FeatureLink
  | DocsHomeExternalCardBlock
  | NavigationBarCta;
export type AnyModel =
  | SuccessStory
  | DocPage
  | Website
  | AboutPage
  | PluginsPage
  | HomePage
  | IntegrationsPage
  | DocsPage
  | Blog
  | Changelog
  | PricingPage
  | UseCasesPage
  | Continent
  | Country
  | LandingPage
  | BlogPost
  | ChangelogEntry
  | SchemaMigration
  | TemplateDemo
  | Review
  | Author
  | Plugin
  | Partner
  | EnterpriseApp
  | PricingHint
  | TeamMember
  | Integration
  | SupportTopic
  | HostingApp
  | Customer
  | PluginFieldType
  | Tutorial
  | PluginTag
  | DocGroup
  | ChangelogCategory
  | PluginType
  | PluginAuthor
  | IntegrationType
  | Faq
  | SuccessStoryTag
  | InDepthCta
  | ProductAnnouncement
  | Feature
  | TeamPage
  | ExpertiseArea
  | ShowcaseProject
  | PartnersPage
  | VideoTutorial
  | PlanFeatureGroup
  | PlanFeature
  | UseCasePage
  | CustomerStory
  | TechPartnersPage
  | GlossaryEntry
  | ResearchProgramPage
  | FeaturesIndex
  | TryTutorial
  | ProductOverview
  | NavigationBar
  | TechPartner
  | Recipe
  | AcademyPage
  | Industry
  | AssetsHardcodedInWebsite
  | PartnerTestimonial
  | CustomerStoriesIndex
  | AcademyChapter
  | AcademyCourse
  | ProductComparison
  | Badge
  | SuccessStoriesIndex
  | RecipesPage
  | HowToDatocmsIndex
  | GlossaryPage
  | Person
  | UserGuidesEpisode
  | PluginCollection
  | UserGuidesChapter
  | UserGuidesHome;
export type AnyBlockOrModel = AnyBlock | AnyModel;
