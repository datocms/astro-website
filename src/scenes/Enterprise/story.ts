// The fake project of the page /enterprise-headless-cms. Northwind Group is
// a company with twelve brands. Each brand has its own project. Do not
// change a text here without a change to the copy (src/data/enterprise.ts).

export const GROUP_NAME = 'Northwind Group';

/** The number of brands of the group, and of its projects */
export const BRAND_COUNT = 12;

export const LANDING_PAGE_ICON = '🚀';

/**
 * The two custom roles of the frame, side by side. Each sees the same
 * models, and each does a different job on them: nobody steps on anyone.
 * A role has no rule for the other models, thus it cannot touch them.
 */
export const ROLES = [
  {
    /** The agency that makes the content of the German market */
    name: 'Agency Berlin',
    summary:
      'Landing pages: it can read the records, edit content in German and move them to the stage Legal, and it cannot publish them. Blog posts: it can read and create records, and edit the records it created.',
    ruleSets: [
      {
        emoji: LANDING_PAGE_ICON,
        title: 'Landing pages',
        apiKey: 'landing_page',
        rules: [
          { action: 'read' },
          { action: 'update', locale: 'German' },
          { action: 'moveToStage', toStage: '⚖️ Legal' },
          { positive: false, action: 'unpublish' },
        ],
      },
      {
        emoji: '📰',
        title: 'Blog posts',
        apiKey: 'blog_post',
        rules: [{ action: 'read' }, { action: 'create' }, { action: 'update', createdBy: 'self' }],
      },
    ],
  },
  {
    /** The legal team of the group: it clears the claims of every brand */
    name: 'Legal team',
    summary:
      'Landing pages and blog posts: it can read the records and move the records in the stage Legal to the stage Brand, and it cannot edit their content.',
    ruleSets: [
      {
        emoji: LANDING_PAGE_ICON,
        title: 'Landing pages',
        apiKey: 'landing_page',
        rules: [
          { action: 'read' },
          { action: 'moveToStage', inStage: '⚖️ Legal', toStage: '🎨 Brand' },
          { positive: false, action: 'update' },
        ],
      },
      {
        emoji: '📰',
        title: 'Blog posts',
        apiKey: 'blog_post',
        rules: [
          { action: 'read' },
          { action: 'moveToStage', inStage: '⚖️ Legal', toStage: '🎨 Brand' },
          { positive: false, action: 'update' },
        ],
      },
    ],
  },
] as const;

/**
 * The stages of the workflow of one brand, in their order, as its settings
 * show them. Every brand has its own workflow.
 */
export const BRAND_WORKFLOW = [
  { name: '✏️ Draft', apiKey: 'draft', description: 'The brand team writes it' },
  { name: '⚖️ Legal', apiKey: 'legal', description: 'Legal clears the claims' },
  { name: '🎨 Brand', apiKey: 'brand', description: 'The brand lead checks the tone' },
  { name: '✅ Approved', apiKey: 'approved', description: 'Ready to go out' },
] as const;

/** The project of the group in the two diagrams: what its export holds */
export const PROJECT_PARTS = [
  'models',
  'records',
  'assets',
  'menus',
  'plugins',
  'workflows',
  'upload collections',
] as const;

/** The export: the schedule (here every night at 02:00; the customer chooses it as a cron expression) and the bucket of the backups */
export const BACKUP = {
  archiveDescription: `A diagram of the backups of ${GROUP_NAME}. Every night at 02:00, an export takes the models, records, assets, menus, plugins, workflows and upload collections of the project, one after the other, each with a check when it is done. Then the archive goes to the bucket s3://northwind-backups, which belongs to the customer.`,
  /** The schedule in words, on the pill */
  schedule: 'Every night at 02:00',
  bucket: 's3://northwind-backups',
} as const;

/** The storage of the assets: the bucket of the customer and the domain that serves the files */
export const STORAGE = {
  assets: ['hero.jpg', 'catalogue.pdf', 'intro.mp4'],
  bucket: 'northwind-media',
  providers: 'AWS S3 · Cloudflare R2 · Google Cloud Storage · Azure Blob Storage',
  url: 'assets.northwind.com/hero.jpg',
  description: `A diagram of the storage of the assets of ${GROUP_NAME}. The assets of the project, such as hero.jpg, catalogue.pdf and intro.mp4, are stored in the bucket northwind-media, which belongs to the customer. The bucket can be on AWS S3, Cloudflare R2, Google Cloud Storage or Azure Blob Storage. The files are served from the domain of the customer, assets.northwind.com.`,
} as const;

/**
 * The white-label CMS of the group: its address, its logo in the
 * navigation bar, and its brand colour (the hue of the theme `green`) on
 * the interface. A landing page of the German market is open.
 */
export const WHITE_LABEL = {
  address: 'cms.northwind.com',
  brandTheme: 'green',
  landingPage: {
    title: 'Autumn collection 2026',
    slugPrefix: 'northwind.com/de/',
    slug: 'autumn-collection-2026',
    intro: 'Twelve brands, one season: the coats, the boots and the bags of the new collection.',
  },
} as const;
