export type Framework = {
  id: string;
  name: string;
  logo: string;
  href: string;
};

export const FRAMEWORKS: Framework[] = [
  { id: 'next', name: 'Next.js', logo: 'svg/logos/next-squared', href: '/docs/next-js' },
  { id: 'nuxt', name: 'Nuxt', logo: 'svg/logos/nuxt-squared', href: '/docs/nuxt' },
  { id: 'sveltekit', name: 'SvelteKit', logo: 'svg/logos/svelte-squared', href: '/docs/svelte' },
  { id: 'astro', name: 'Astro', logo: 'svg/logos/astro-squared', href: '/docs/astro' },
];

export type Api = {
  name: string;
  protocol: string;
  desc: string;
  pkg: string | null;
  endpoint: string;
  href: string;
  language: string;
  code: string;
};

export const APIS: Api[] = [
  {
    name: 'Content Delivery API',
    protocol: 'GraphQL',
    desc: 'Read published content from any front-end via a fast, cached GraphQL endpoint.',
    pkg: '@datocms/cda-client',
    endpoint: 'graphql.datocms.com',
    href: '/docs/content-delivery-api',
    language: 'ts',
    code: `import { buildClient } from '@datocms/cda-client';

const client = buildClient({
  apiToken: process.env.DATOCMS_TOKEN,
});

const { allPosts } = await client.request({
  query: \`{
    allPosts(first: 10) {
      id title slug _publishedAt
    }
  }\`,
});`,
  },
  {
    name: 'Content Management API',
    protocol: 'REST',
    desc: 'Create, update, and publish records programmatically through a typed client.',
    pkg: '@datocms/cma-client',
    endpoint: 'site-api.datocms.com',
    href: '/docs/content-management-api',
    language: 'ts',
    code: `import { buildClient } from '@datocms/cma-client';

const client = buildClient({
  apiToken: process.env.DATOCMS_CMA_TOKEN,
});

const post = await client.items.create({
  item_type: Schema.BlogPost.REF,
  title: 'Hello, world',
  slug: 'hello-world',
});

await client.items.publish(post.id);`,
  },
  {
    name: 'Asset API',
    protocol: 'CDN',
    desc: 'Upload, transform, and serve images, video, and files from a global CDN.',
    pkg: null,
    endpoint: 'www.datocms-assets.com',
    href: '/docs/asset-api',
    language: 'bash',
    code: `# Upload a file via the CMA, then transform via the CDN.
curl https://www.datocms-assets.com/12345/hero.jpg \\
  ?fit=crop&w=1200&h=630&auto=format

# Or in GraphQL — responsive variants from the CDA:
{
  hero {
    responsiveImage(imgixParams: {
      w: 400, h: 400, fit: crop
    }) {
      src srcSet sizes width height alt blurUpThumb
    }
  }
}`,
  },
  {
    name: 'Real-time Updates API',
    protocol: 'SSE',
    desc: 'Stream live content changes to power instant previews and live published views.',
    pkg: 'datocms-listen',
    endpoint: 'graphql-listen.datocms.com',
    href: '/docs/real-time-updates-api',
    language: 'ts',
    code: `import { subscribeToQuery } from 'datocms-listen';

const unsubscribe = await subscribeToQuery({
  query: \`{ allPosts { id title } }\`,
  token: process.env.DATOCMS_TOKEN,
  includeDrafts: true,
  onUpdate: ({ response }) => {
    console.log('content changed', response.data);
  },
});`,
  },
];

export type Badge = 'NEW' | 'SOON' | 'MOVED';

export type Card = {
  name: string;
  desc: string;
  href: string;
  badge?: Badge;
};

export const AI_CARDS: Card[] = [
  {
    name: 'MCP Server',
    desc: 'Plug DatoCMS into Claude, Cursor, Zed via the Model Context Protocol.',
    href: '/docs/mcp-server',
    badge: 'NEW',
  },
  {
    name: 'Agent Skills',
    desc: 'Drop-in skills for AI coding agents — the natural companion to MCP.',
    href: '/docs/agent-skills',
    badge: 'NEW',
  },
  {
    name: 'LLM-ready docs',
    desc: 'llms.txt, per-page .md endpoints, agent-friendly retrieval.',
    href: '/docs/llm-ready-docs',
  },
  {
    name: 'Translating with AI',
    desc: 'Auto-translate field content at publish time.',
    href: '/docs/ai-translations',
  },
];

export const BUILD_CARDS: Card[] = [
  {
    name: 'Visual Editing',
    desc: 'Real-time edit overlays on the front-end.',
    href: '/docs/visual-editing',
  },
  {
    name: 'Structured Text',
    desc: 'The dast format, renderers, migration from rich text.',
    href: '/docs/structured-text-fields',
  },
  {
    name: 'Plugin SDK',
    desc: 'Field extensions, sidebars, dropdowns, hooks.',
    href: '/docs/building-plugins',
  },
  {
    name: 'Site Search',
    desc: 'Configuration, crawling, React & Vue widgets.',
    href: '/docs/site-search',
  },
  {
    name: 'Streaming Videos',
    desc: 'HLS vs MP4, Mux analytics, player config.',
    href: '/docs/streaming-videos',
  },
  {
    name: 'Webhooks',
    desc: 'Subscribe to record / model / asset events.',
    href: '/docs/webhooks',
  },
];

export const OPERATE_CARDS: Card[] = [
  {
    name: 'Environments & migrations',
    desc: 'Sandbox, primary, scripting migrations with the CLI.',
    href: '/docs/scripting-migrations',
  },
  {
    name: 'Import & Export',
    desc: 'Contentful import, WordPress import, enterprise exports.',
    href: '/docs/import-and-export',
  },
  {
    name: 'SSO & security',
    desc: 'Conceptual primer for the CMA SSO endpoints.',
    href: '/docs/single-sign-on',
    badge: 'NEW',
  },
  {
    name: 'Audit logs',
    desc: 'Who did what, when. Compliance-ready.',
    href: '/docs/audit-log',
  },
  {
    name: 'Custom asset domains',
    desc: 'Serve assets from your own domain.',
    href: '/docs/custom-asset-domain',
  },
  {
    name: 'Pro tips',
    desc: 'Customize admin domain, live/preview, more.',
    href: '/docs/pro-tips',
  },
];

export type CommunityPanel = {
  title: string;
  desc: string;
  cta: string;
  href: string;
};

export const COMMUNITY_PANEL: CommunityPanel = {
  title: 'Tutorials, livestreams & talks',
  desc: 'A curated library of community tutorials, conference talks, and livestream recordings from the DatoCMS team and folks shipping with it every day.',
  cta: 'Browse the library',
  href: '/docs/community-tutorials',
};

export const HELP_CARDS: Card[] = [
  {
    name: 'Agency Partner Program',
    desc: 'For agencies building on DatoCMS.',
    href: '/partners',
  },
  {
    name: 'Plans & pricing',
    desc: 'Billing, plans, upgrades.',
    href: '/pricing',
  },
];
