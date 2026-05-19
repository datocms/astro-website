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
