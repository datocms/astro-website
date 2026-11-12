// The data of the header menus and the footer. The CMS does not hold it:
// the lists are here. See src/data/AGENTS.md, "Navigation", for the
// structure. Every link goes to a page, never to a list of content, and
// no page has two names. A link without a page on this site goes to '#'.

import type { FaceName } from '~/lib/motion/faces';

interface LinkItem {
  label: string;
  href: string;
  /** A muted line under the link, in the menus of the header. */
  description?: string;
}

/** A muted heading, its links and an optional "All … →" link. */
interface NavSection {
  heading: string;
  links: LinkItem[];
  allLink?: LinkItem;
}

/** One column of a dropdown card. It holds one or more sections. */
interface NavColumn {
  sections: NavSection[];
}

/** A field of the accent in a dropdown card: an action, not a page of the map. */
export interface NavPromo {
  title: string;
  /** The quiet run of the title. The face ends it. */
  aside: string;
  face: FaceName;
  button: { label: string; href: string };
  /** URL of a .pxv file of public/videos. */
  video: string;
  /** The frames of the pose in which the video stays (see `PixelVideo`). */
  videoHold: [number, number];
}

/** A plain link (Philosophy, Pricing), or a group with the columns of a dropdown card. */
export type NavGroup =
  | { label: string; href: string; columns?: undefined; promo?: undefined }
  | { label: string; href?: undefined; columns: NavColumn[]; promo?: NavPromo };

export interface FooterGroup {
  title: string;
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
  /** The legal pages, in the bar at the end of the footer. */
  links: LinkItem[];
}

const l = (label: string, href = '#', description?: string): LinkItem =>
  description ? { label, href, description } : { label, href };

const communityHref = 'https://community.datocms.com';

// The four pillars. Each description is one line of the card: a few of
// the chapters of the pillar, in page order.
const editorExperience = l(
  'Editor experience',
  '/editor-experience',
  'Structured content and visual editing',
);
const developers = l('For developers', '/developers', 'Schema, GraphQL, real-time, cache tags');
const media = l('Media', '/media', 'Images, video and the media library');
const ai = l('AI', '/ai', 'MCP, agent skills, LLM-ready docs');

// The framework pages (/cms/[slug]).
const frameworks = [
  l('Astro', '/cms/astro-cms'),
  l('Next.js', '/cms/nextjs-cms'),
  l('Nuxt', '/cms/nuxtjs-cms'),
  l('SvelteKit', '/cms/svelte-cms'),
];

// The compare pages. They are in the footer only: a visitor who compares
// has decided to look, and the header stays a map of the product.
const compare = [
  l('Contentful', '/compare/datocms-vs-contentful'),
  l('Sanity', '/compare/datocms-vs-sanity'),
  l('Storyblok', '/compare/datocms-vs-storyblok'),
  l('Strapi', '/compare/datocms-vs-strapi'),
  l('WordPress', '/compare/datocms-vs-wordpress'),
];

// The customer pages. The header gives each a line that says what it holds.
const caseStudies = l('Case studies', '/case-studies', 'Projects that teams built on DatoCMS');
const wallOfLove = l('Wall of love', '/wall', 'What customers say about us');
const casualChats = l('Casual chats', '/blog/casual-chats', 'Conversations with customers');

// The partner pages. The header shows the directory and the program, each
// with a line that says what it holds. The footer shows all four.
const agencyDirectory = l('Agency directory', '/partners', 'Agencies that build with DatoCMS');
const partnerProgram = l('Partner program', '/partner-program', 'Become a DatoCMS partner');

// The groups that the header and the footer both show. Each list is here
// once, thus the two show the same links under the same heading.
const learn = [
  l('Docs', '/docs'),
  l('Academy', '/academy'),
  l('User guides', '/user-guides'),
  l('Glossary', '/glossary'),
];
const catalogs = [l('Plugins', '/plugins'), l('Starters', '/starters')];
const help = [l('Support', '/support'), l('Community forum', communityHref), l('Slack', '/slack')];
const news = [l('Blog', '/blog'), l('Product updates', '/product-updates')];

export const mainNavigation: NavGroup[] = [
  {
    label: 'Product',
    columns: [
      {
        sections: [
          {
            heading: 'Product',
            links: [editorExperience, developers, media, ai],
            allLink: l('The full list of features', '/features'),
          },
        ],
      },
      {
        sections: [
          { heading: 'Solutions', links: [l('Enterprise', '/enterprise-headless-cms')] },
          { heading: 'Frameworks', links: frameworks },
        ],
      },
    ],
    promo: {
      title: 'The real product, in 30 seconds.',
      aside: 'No signup, and a few short videos to guide you',
      face: 'wink',
      button: { label: 'Try the demo', href: 'https://try.datocms.com' },
      video: '/videos/hand-ok-2.pxv',
      videoHold: [38, 47],
    },
  },
  {
    label: 'Resources',
    columns: [
      {
        sections: [
          { heading: 'Learn', links: learn },
          { heading: 'Catalogs', links: catalogs },
        ],
      },
      {
        sections: [
          { heading: 'Help', links: help },
          { heading: 'News', links: news },
        ],
      },
    ],
  },
  {
    label: 'Customers',
    columns: [
      {
        sections: [{ heading: 'Customers', links: [caseStudies, wallOfLove, casualChats] }],
      },
    ],
  },
  {
    label: 'Partners',
    columns: [{ sections: [{ heading: 'Partners', links: [agencyDirectory, partnerProgram] }] }],
  },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Pricing', href: '/pricing' },
];

// The footer has no description: only the label of each link shows.
const footerLink = ({ label, href }: LinkItem): LinkItem => ({ label, href });

// Five columns of seven to nine links, in the order of the tasks of a
// visitor: the product, the stack, the use of DatoCMS, the people who use
// it, and the company. The legal pages are in the bar at the end
// (`legal.links`), not in a column.
export const footerColumns: FooterColumn[] = [
  {
    groups: [
      {
        title: 'Product',
        links: [
          ...[editorExperience, developers, media, ai].map(footerLink),
          l('All features', '/features'),
          l('Enterprise', '/enterprise-headless-cms'),
          l('Pricing', '/pricing'),
        ],
      },
    ],
  },
  {
    groups: [
      { title: 'Frameworks', links: frameworks },
      { title: 'Compare', links: compare },
    ],
  },
  {
    groups: [
      { title: 'Learn', links: learn },
      { title: 'Catalogs', links: catalogs },
      { title: 'Help', links: help },
    ],
  },
  {
    groups: [
      {
        title: 'Customers',
        links: [caseStudies, wallOfLove, casualChats].map(footerLink),
      },
      {
        title: 'Partners',
        links: [
          footerLink(agencyDirectory),
          l('Partner showcase', '/partners/showcase'),
          footerLink(partnerProgram),
          l('Tech partners', '/tech-partners'),
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
          l('Research program', '/research-program'),
          l('Brand', '/brand'),
          l('Contact', '/contact'),
        ],
      },
      { title: 'News', links: news },
    ],
    status: { label: 'Status', text: 'All systems normal', href: 'https://status.datocms.com' },
  },
];

export const legal: LegalData = {
  email: 'support@datocms.com',
  text: '©2026 Dato srl, all rights reserved  P.IVA 06969620480',
  links: [
    l('Privacy policy', '/legal/privacy-policy'),
    l('Cookie policy', '/legal/cookie-policy'),
    l('GDPR Compliance', '/legal/gdpr'),
    l('Terms of Service', '/legal/terms'),
  ],
};

/**
 * The paths of the pages of a group. The header marks the group of the
 * page that the visitor reads. A path matches when it is the page or a
 * page below it ('/blog' matches '/blog/casual-chats').
 */
export function groupPaths(group: NavGroup): string[] {
  if (group.href !== undefined) return [group.href];
  return group.columns
    .flatMap((column) => column.sections)
    .flatMap((section) => [...section.links, ...(section.allLink ? [section.allLink] : [])])
    .map((link) => link.href)
    .filter((href) => href.startsWith('/'));
}
