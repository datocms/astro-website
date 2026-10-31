// Static data for the search popup.
// The popup filters this static index on the client by substring. No
// search service is behind it.

export interface SearchLink {
  label: string;
  href: string;
}

export interface SearchEntry {
  /** The path above the title, for example "Docs > Content Management API". */
  breadcrumb: string;
  title: string;
  excerpt: string;
  href: string;
}

export const placeholder = 'Search or ask anything';

export const quickLinksHeading = 'Quick Links';

export const quickLinks: SearchLink[] = [
  { label: 'General Concepts', href: '#' },
  { label: 'Content Modelling', href: '#' },
  { label: 'Content Delivery API (CDA)', href: '#' },
  { label: 'Content Management API (CMA)', href: '#' },
  { label: 'Plugin SDK', href: '#' },
  { label: 'Next.js quickstart', href: '#' },
];

export const askAiLabel = 'Ask AI';

export const noResults = {
  heading: 'No results',
  text: 'Try another word, or ask the AI assistant.',
};

export const index: SearchEntry[] = [
  {
    breadcrumb: 'Case Studies',
    title: 'HashiCorp',
    excerpt:
      'How HashiCorp uses the API of DatoCMS to publish docs and marketing pages for all its products.',
    href: '#',
  },
  {
    breadcrumb: 'Case Studies',
    title: 'Arduino',
    excerpt:
      'Arduino moved its websites to a headless CMS and an API-first workflow for the whole team.',
    href: '/case-studies/arduino',
  },
  {
    breadcrumb: 'Docs > Content Management API',
    title: 'API token',
    excerpt:
      'Each API token has a role. The role sets what the token can read and change in the project.',
    href: '#',
  },
  {
    breadcrumb: 'Docs > DatoCMS APIs at a glance',
    title: 'Overview of DatoCMS APIs',
    excerpt:
      'DatoCMS has a Content Delivery API to read content and a Content Management API to change it.',
    href: '#',
  },
  {
    breadcrumb: 'Docs > Content Delivery API',
    title: 'GraphQL API',
    excerpt:
      'Read your content with GraphQL, with filters, pagination, localization and responsive images.',
    href: '#',
  },
  {
    breadcrumb: 'Docs > Content Modelling',
    title: 'Models and blocks',
    excerpt:
      'A model defines the fields of a record. A block is a group of fields that you can use inside records.',
    href: '#',
  },
  {
    breadcrumb: 'Docs > Content Modelling',
    title: 'Structured Text',
    excerpt: 'Structured Text keeps rich text, blocks and links to records in one field, as JSON.',
    href: '#',
  },
  {
    breadcrumb: 'Docs > Plugin SDK',
    title: 'Build your first plugin',
    excerpt:
      'Use the Plugin SDK to add field editors, sidebars and pages to the DatoCMS interface.',
    href: '#',
  },
  {
    breadcrumb: 'Docs > Next.js',
    title: 'Next.js quickstart',
    excerpt:
      'Connect a Next.js project to DatoCMS, with draft mode, cache tags and visual editing.',
    href: '#',
  },
  {
    breadcrumb: 'Features',
    title: 'Visual Editing',
    excerpt:
      'Click any text on your website preview and edit the record of that content in DatoCMS.',
    href: '/editor-experience#visual-editing',
  },
  {
    breadcrumb: 'Features',
    title: 'Localization',
    excerpt:
      'Translate each field into many locales, with fallback locales and per-locale publishing.',
    href: '/editor-experience#localization',
  },
  {
    breadcrumb: 'Features',
    title: 'Cache Tags',
    excerpt: 'Invalidate only the pages that use a record when that record changes, on any CDN.',
    href: '/developers#delivery',
  },
  {
    breadcrumb: 'Product',
    title: 'AI',
    excerpt:
      'Connect your AI tools to your project with the MCP server, and translate and caption content with AI.',
    href: '/ai',
  },
  {
    breadcrumb: 'Product',
    title: 'Media',
    excerpt:
      'Keep images and videos in one media library, and serve them at the right size from the Images and Video APIs.',
    href: '/media',
  },
  {
    breadcrumb: 'Product',
    title: 'For developers',
    excerpt:
      'Build the schema, read content with GraphQL, and deliver it from a CDN with cache tags and environments.',
    href: '/developers',
  },
  {
    breadcrumb: 'Pricing',
    title: 'Plans and pricing',
    excerpt: 'Start for free. Upgrade when your project needs more records, locales or API calls.',
    href: '/pricing',
  },
  {
    breadcrumb: 'Company',
    title: 'Contact',
    excerpt: 'Talk to our team about your project, a demo, or an enterprise plan.',
    href: '/contact',
  },
];
