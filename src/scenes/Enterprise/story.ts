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

/** The email in the sign-in page of the cms of the group */
export const SIGN_IN_EMAIL = 'lena.vogel@northwind.com';

/**
 * The single sign-on of the group: SAML with an Okta app, and SCIM with the
 * API token that the cms just made. The values of DatoCMS have the shapes
 * of the cms.
 */
export const SSO = {
  serviceProvider: {
    metadataUrl: 'https://sso.datocms.com/saml/northwind/metadata',
    acsUrl: 'https://sso.datocms.com/saml/northwind/acs',
    samlToken: 'a7c41e9d2b6f8035',
    scimBaseUrl: 'https://sso.datocms.com/scim/northwind/v2',
  },
  identityProviderMetadataUrl: 'https://northwind.okta.com/app/exk4n7w2d/sso/saml/metadata',
  scimToken: 'scim_2c8e5a17f9b04d6e9a3c',
  defaultRole: 'Editor',
} as const;

/**
 * The audit log of the group, newest first. The events touch the other
 * chapters: the roles, the workflow, the single sign-on and the white
 * label. Each event has its environment and the role of its author.
 */
export const AUDIT_LOG = [
  {
    occurredAt: '2026-10-15T09:41:12Z',
    actor: { name: 'Lena Vogel', email: 'lena.vogel@northwind.com' },
    action: 'items.bulk_move_to_stage',
    path: '/items/bulk/move-to-stage',
    environment: 'main',
    role: 'Agency Berlin',
  },
  {
    occurredAt: '2026-10-15T09:32:05Z',
    actor: { name: 'Tomás Herrera', email: 'tomas.herrera@northwind.com' },
    action: 'roles.update',
    path: '/roles/38211',
    environment: 'main',
    role: 'Admin',
  },
  {
    occurredAt: '2026-10-15T09:18:47Z',
    actor: { name: 'Aiko Tanaka', email: 'aiko.tanaka@northwind.com' },
    action: 'items.publish',
    path: '/items/Gd8Qnm7pRUKPjnCVhCYOZw/publish',
    environment: 'main',
    role: 'Brand lead',
  },
  {
    occurredAt: '2026-10-15T09:02:31Z',
    actor: { name: 'Claire Dubois', email: 'claire.dubois@northwind.com' },
    action: 'items.update',
    path: '/items/T4kR9vXbQ0yLm2pZcW8sAa',
    environment: 'main',
    role: 'Legal team',
  },
  {
    occurredAt: '2026-10-15T08:47:59Z',
    actor: { name: 'Tomás Herrera', email: 'tomas.herrera@northwind.com' },
    action: 'environments.promote',
    path: '/environments/autumn-launch/promote',
    environment: 'autumn-launch',
    role: 'Admin',
  },
  {
    occurredAt: '2026-10-15T08:31:40Z',
    actor: { name: 'Jonas Weber', email: 'marco.bellini@northwind.com' },
    action: 'item_types.update',
    path: '/item-types/Kz3mQp9sT1aVx7LrBn4HcE',
    environment: 'autumn-launch',
    role: 'Developer',
  },
  {
    occurredAt: '2026-10-15T08:12:03Z',
    actor: { name: 'Tomás Herrera', email: 'tomas.herrera@northwind.com' },
    action: 'sso_settings.update',
    path: '/sso-settings',
    environment: 'main',
    role: 'Admin',
  },
  {
    occurredAt: '2026-10-15T07:58:26Z',
    actor: { name: 'Jonas Weber', email: 'marco.bellini@northwind.com' },
    action: 'workflows.update',
    path: '/workflows/Wd5yNf2uR8eJb6GtMq0XoA',
    environment: 'autumn-launch',
    role: 'Developer',
  },
  {
    occurredAt: '2026-10-15T07:44:51Z',
    actor: { name: 'Tomás Herrera', email: 'tomas.herrera@northwind.com' },
    action: 'access_tokens.create',
    path: '/access_tokens',
    environment: 'main',
    role: 'Admin',
  },
  {
    occurredAt: '2026-10-15T07:30:18Z',
    actor: { name: 'Tomás Herrera', email: 'tomas.herrera@northwind.com' },
    action: 'white_label_settings.update',
    path: '/white-label-settings',
    environment: 'main',
    role: 'Admin',
  },
] as const;

/**
 * The people of the chat. The DatoCMS team is real: `teamMember` is the ID
 * of the TeamMember record, which gives the photo. The people of Northwind
 * are not real.
 */
const JONAS = { name: 'Jonas Weber', org: 'Northwind' } as const;
const ROGER = {
  name: 'Roger Tuan',
  org: 'DatoCMS',
  teamMember: 'V_7KMMRtTCGmue1QqTZZ_Q',
} as const;
const MARCELO = {
  name: 'Marcelo Finamor',
  org: 'DatoCMS',
  teamMember: '79766956',
} as const;
const PAPADOPOULOS = {
  name: 'Matteo Papadopoulos',
  org: 'DatoCMS',
  teamMember: '142812727',
} as const;
const MATTEO = {
  name: 'Matteo Giaccone',
  org: 'DatoCMS',
  teamMember: '39830610',
} as const;

/**
 * The shared channel of Northwind Group and DatoCMS (the frame of the
 * chapter Support). A developer of Northwind asks how to keep one model the
 * same in the projects of the twelve brands. Marcelo Finamor of the DatoCMS
 * support answers in the thread: one folder of migrations, one profile of
 * the CLI for each project, and `migrations:run` with the profile.
 */
export const SUPPORT_CHAT = {
  workspace: 'Northwind',
  channel: 'northwind-datocms',
  channels: ['general', 'web-platform', 'releases'],
  sharedWith: 'DatoCMS',
  /** The people of DatoCMS in the channel: the banner over the box to write in counts them. */
  externalPeople: 3,
  earlier: [
    {
      ...JONAS,
      time: '17:40',
      text: 'The autumn-launch sandbox is ready. We promote it on Monday.',
    },
  ],
  today: 'Today',
  messages: [
    {
      ...MATTEO,
      time: '09:12',
      text: 'Thanks for the list of feature requests, Jonas. Can we go through it together next week?',
    },
    {
      ...JONAS,
      time: '10:02',
      text: 'Each brand has its own project. How do we keep the Landing page model the same in all twelve?',
      replies: 3,
    },
  ],
  thread: [
    {
      ...MARCELO,
      time: '10:09',
      text: 'Keep the schema changes as migrations in one repo, with a profile for each brand project in datocms.config.json. Then run them on each project:',
      code: 'datocms migrations:run --profile=brand-berlin',
      after: 'Each brand keeps its own content, roles and workflow: only the models move.',
      reaction: { emoji: '🙌', count: 1 },
    },
    {
      ...JONAS,
      time: '10:14',
      text: 'Perfect, we’ll add it to the CI today.',
    },
    {
      ...ROGER,
      time: '10:15',
      text: 'Send me the first migration and I’ll review it with you.',
    },
  ],
} as const;

/**
 * The fragment of the SLAs: the two service levels of the contract of the
 * group. Only the facts of the copy (src/data/enterprise.ts): no other
 * priority and no other figure.
 */
export const SLA = {
  label: `${GROUP_NAME} contract`,
  levels: [
    { name: 'Performance SLA', value: '99.99%', term: 'Uptime' },
    { name: 'Support SLA', value: '1 hour', term: 'First answer to a priority-one issue, 24/7' },
  ],
  description:
    'The service levels in the contract of Northwind Group: the performance SLA, 99.99% uptime; the support SLA, an answer to a priority-one issue in one hour, around the clock.',
} as const;

/**
 * The fragment of the onboarding: the plan of Northwind Group, one row for
 * each session, with the person of DatoCMS who runs it. Technical
 * onboarding is with the developers (Marcelo Finamor), editorial
 * onboarding is with the team of each brand (Matteo Papadopoulos). The
 * topics stay general: the copy says only that the sessions exist.
 */
export const ONBOARDING = {
  label: `${GROUP_NAME} onboarding`,
  sessions: [
    {
      title: 'Technical onboarding',
      audience: 'The developers',
      person: MARCELO,
      status: 'done',
      when: 'Done',
    },
    {
      title: 'Editorial onboarding',
      audience: 'The Berlin team',
      person: PAPADOPOULOS,
      status: 'next',
      when: 'Thu 10:00',
    },
    {
      title: 'Editorial onboarding',
      audience: 'The other 11 brands',
      person: PAPADOPOULOS,
      status: 'later',
      when: 'Next',
    },
  ],
  description:
    'The onboarding plan of Northwind Group: technical onboarding with the developers, run by Marcelo Finamor, is done; editorial onboarding with the Berlin team, run by Matteo Papadopoulos, is on Thursday at 10:00; the other eleven brands are next.',
} as const;
