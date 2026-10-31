// The data of the mega-menu and the footer. The CMS does not hold it: the
// lists are here. See src/data/AGENTS.md, "Navigation", for the
// structure. Every link goes to a page, never to a
// list of content, and no page has two names. A link without a page on
// this site goes to '#'.

export interface LinkItem {
  label: string;
  href: string;
  /** A muted line under the link, in the menus of the header. */
  description?: string;
}

/** A muted heading, its links and an optional "→ All …" link. */
export interface NavSection {
  heading: string;
  links: LinkItem[];
  allLink?: LinkItem;
}

/** One column of the mega-menu. It holds one or more sections. */
export interface NavColumn {
  sections: NavSection[];
}

export interface NavGroup {
  label: string;
  /** A group without columns is a plain link (Philosophy, Pricing). */
  href?: string;
  columns?: NavColumn[];
}

export interface FooterGroup {
  /** A group without a title is a plain list of links (legal). */
  title?: string;
  links: LinkItem[];
}

export interface FooterColumn {
  groups: FooterGroup[];
  /** Shows the system status at the end of the column. */
  status?: { label: string; text: string; href: string };
}

export interface LegalData {
  email: string;
  text: string;
}

const l = (label: string, href = '#', description?: string): LinkItem =>
  description ? { label, href, description } : { label, href };

const communityHref = 'https://community.datocms.com';

// The four pillars. Each description names the chapters of the pillar,
// in page order (the chapter labels of src/data/developers-pillar.ts,
// src/data/editor-experience.ts, src/data/media.ts and
// src/data/ai-pillar.ts). When a chapter changes, change its line here.
const developers = l(
  'For developers',
  '/developers',
  'Schema, GraphQL, real-time, cache tags, environments, automation, plugins',
);
const editorExperience = l(
  'Editor experience',
  '/editor-experience',
  'Structured content, visual editing, layouts, localization, workflows, collaboration, SEO',
);
const media = l('Media', '/media', 'Media library, asset fields, images, video, components');
const ai = l('AI', '/ai', 'MCP, agent skills, LLM-ready docs, translations, tags and captions');

export const mainNavigation: NavGroup[] = [
  {
    label: 'Product',
    columns: [
      {
        sections: [
          {
            heading: 'Product',
            links: [editorExperience, developers, media, ai],
            allLink: l('All features', '/features'),
          },
        ],
      },
      {
        sections: [
          { heading: 'Solutions', links: [l('Enterprise', '/enterprise-headless-cms')] },
          {
            heading: 'Compare',
            links: [
              l('Contentful', '/compare/datocms-vs-contentful'),
              l('Sanity', '/compare/datocms-vs-sanity'),
              l('Storyblok', '/compare/datocms-vs-storyblok'),
              l('Strapi', '/compare/datocms-vs-strapi'),
              l('WordPress', '/compare/datocms-vs-wordpress'),
            ],
          },
        ],
      },
    ],
  },
  // The one customers page. It becomes /customers, and /case-studies merges into it.
  {
    label: 'Resources',
    columns: [
      {
        sections: [
          {
            heading: 'Learn',
            links: [
              l('Docs', '/docs'),
              l('Academy', '/academy'),
              l('User guides', '/user-guides'),
              l('Glossary', '/glossary'),
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: 'Help',
            links: [
              l('Support', '/support'),
              l('Community forum', communityHref),
              l('Slack', '/slack'),
            ],
          },
          {
            heading: 'News',
            links: [l('Blog', '/blog'), l('Product updates', '/product-updates')],
          },
        ],
      },
      {
        sections: [
          {
            heading: 'Ecosystem',
            links: [l('Plugins', '/plugins'), l('Starters', '/starters')],
          },
        ],
      },
    ],
  },
  { label: 'Customers', href: '/case-studies' },
  { label: 'Partners', href: '/partners' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Pricing', href: '/pricing' },
];

// The footer has no description: only the label of each link shows.
const footerLink = ({ label, href }: LinkItem): LinkItem => ({ label, href });

export const footerColumns: FooterColumn[] = [
  {
    groups: [
      {
        title: 'Product',
        links: [
          ...[developers, editorExperience, media, ai].map(footerLink),
          l('All features', '/features'),
          l('Enterprise', '/enterprise-headless-cms'),
          l('Pricing', '/pricing'),
        ],
      },
      // The legal pages. They have no column of their own.
      {
        links: [
          l('Privacy policy', '/legal/privacy-policy'),
          l('Cookie policy', '/legal/cookie-policy'),
          l('GDPR Compliance', '/legal/gdpr'),
          l('Terms of Service', '/legal/terms'),
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Customers',
        links: [
          l('Case studies', '/case-studies'),
          l('Wall of love', '/wall'),
          l('Casual chats', '/blog/casual-chats'),
          l('Compare', '/compare/datocms-vs-contentful'),
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Partners',
        links: [
          l('Agency directory', '/partners'),
          l('Partner showcase', '/partners/showcase'),
          l('Become a partner', '/partner-program'),
          l('Tech partners', '/tech-partners'),
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Resources',
        links: [
          l('Docs', '/docs'),
          l('Blog', '/blog'),
          l('Product updates', '/product-updates'),
          l('Academy', '/academy'),
          l('User guides', '/user-guides'),
          l('Glossary', '/glossary'),
          l('Plugins', '/plugins'),
          l('Starters', '/starters'),
          l('Community', communityHref),
          l('Slack', '/slack'),
          l('Support', '/support'),
        ],
      },
      // The framework pages (/cms/[slug]).
      {
        title: 'Frameworks',
        links: [
          l('Next.js', '/cms/nextjs-cms'),
          l('Nuxt', '/cms/nuxtjs-cms'),
          l('SvelteKit', '/cms/svelte-cms'),
          l('Astro', '/cms/astro-cms'),
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Company',
        links: [
          l('Philosophy', '/philosophy'),
          l('Security', '/security'),
          l('Profit sharing', '/company/profit-sharing'),
          l('Research program', '/research-program'),
          l('Contact', '/contact'),
        ],
      },
    ],
    status: { label: 'Status', text: 'All systems normal', href: 'https://status.datocms.com' },
  },
];

export const legal: LegalData = {
  email: 'support@datocms.com',
  text: '©2026 Dato srl, all rights reserved  P.IVA 06969620480',
};
