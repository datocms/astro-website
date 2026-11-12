// The data of the home page. The CMS does not hold it: the data is here.
// The types have the names of CMS fragments.

import type { FaceName } from '~/lib/motion/faces';
import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData } from '~/components/Button';
import type { CodeTab } from '~/components/CodeSnippetPreview';
import type { CodeToken } from '~/components/UserExperience';
import type { LogoItem } from '~/components/LogosLine';
import type { Theme } from '~/lib/theme';
import { clientLogos as c } from '~/data/clientLogos';

/**
 * The theme of the home page. The layout, the hero and the first band (the
 * product scene) read it, thus the page starts and ends in this hue.
 */
export const homeTheme: Theme = 'purple';

export interface HeroData {
  label?: string;
  /** The strong run of the h1. */
  headline: string;
  /**
   * The muted run of the h1. It follows the headline on the same line,
   * in the same text.
   */
  subheadline?: string;
  /**
   * The face after the subheadline. Only hand-written copy has a face: text
   * from the CMS, a title alone and a legal page have none (DESIGN.md,
   * "The Text Face Rule"). Without a face, the h1 ends with the subheadline.
   */
  face?: FaceName;
  /** The body text below the h1: the description that does not go in the h1. */
  intro?: string;
  buttons?: ButtonData[];
  logos?: LogoItem[];
}

export interface UserExperienceData {
  developer: { headline: string; button: ButtonData };
  editor: { headline: string; button: ButtonData };
  /** The fake record. The three windows of the mock-up show it. */
  record: { title: string; subtitle: string; url: string };
  /** The header of the fake site: the brand at the left, the links at the right. */
  site: { brand: string; links: string[] };
  /** The query in the code window. `thread` is the index of the line that fetches the title. */
  query: { file: string; lines: CodeToken[][]; thread: number };
  /**
   * The hero video of the site window. `palette`: a name of `palettes` in
   * src/lib/pixel-video/styles.ts. `lens: false` removes the lens.
   */
  video: { src: string; palette?: string; lens?: boolean };
  /** The theme of the band, of its windows and of its scene. */
  theme: Theme;
}

export interface ContentSourceData {
  headline: string;
  /** The face at the end of the headline. It plays when it comes into view. */
  face?: FaceName;
  paragraph: string;
  /** The button below the paragraph. */
  button: ButtonData;
  channels: string[];
  activeChannel: string;
}

interface FeatureItem {
  title: string;
  description: string;
  theme: Theme;
  image?: { src: string; alt: string };
  /** The page of the feature: the title is a link to it. */
  href?: string;
}

export interface FeaturesData {
  title?: string;
  features: FeatureItem[];
  button?: ButtonData;
}

interface TextWithImageData {
  title: string;
  tagline: string;
  button: ButtonData;
  code: { tabs: CodeTab[]; active: number };
}

export interface QuestionAnswerData {
  headline: string;
  /** The face at the end of the headline. It plays when it comes into view. */
  face?: FaceName;
  subline: string;
  ask: { title: string; href: string; question: string; models: string[]; answer: string };
  install: { title: string; href: string; command: string; folders: string[] };
  /** A line under the cards that leads to the page of the subject. */
  more?: { text: string; button: ButtonData };
}

/** A thread of community.datocms.com. The page shows the dates as a time before now. */
interface CommunityPost {
  /** A user of the forum: the avatar shows the initials of the name. */
  author: { name: string };
  /** The ISO date-time of the first post. */
  askedAt: string;
  title: string;
  tag?: string;
  /** shipped: a feature request that we launched. solved: a question with an accepted answer. */
  outcome: 'shipped' | 'solved';
  /** A person of the DatoCMS team: `teamMember` is the ID of a TeamMember record, which gives the photo. */
  closedBy: { name: string; teamMember: string };
  /** The ISO date-time of the post that closed the thread. */
  closedAt: string;
}

export interface CommunityData {
  headline: string;
  /** The second line of the heading, in the muted colour. */
  muted: string;
  paragraph: string;
  button: ButtonData;
  posts: CommunityPost[];
}

export interface CtaBannerData {
  /** dark: inverse surface. light: accent. subtle: accent-subtle. plain: default surface. */
  variant: 'dark' | 'light' | 'subtle' | 'plain';
  theme?: Theme;
  headline: string;
  muted?: string;
  subline?: string;
  buttons?: ButtonData[];
}

/** The copy of ProductUpdates. The entries come from the changelog in DatoCMS. */
export interface ProductUpdatesData {
  headline: string;
  muted: string;
  allHref: string;
}

export interface CaseStudiesData {
  headline: string;
  subheadline?: string;
  buttons?: ButtonData[];
}

export interface PartnersData {
  eyebrow: string;
  paragraph: string;
  buttons: ButtonData[];
  /** `palette`: a name of `palettes` in src/lib/pixel-video/styles.ts. */
  video: { src: string; palette?: string };
}

export const hero: HeroData = {
  headline: 'Thoughtfully built and ambitiously used.',
  subheadline: 'The AI-agnostic headless CMS with human support and transparent pricing',
  face: 'smile',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      variant: 'accent',
      arrow: false,
      theme: homeTheme,
    },
    { label: 'Read the docs', href: '/docs', variant: 'soft', arrow: false },
  ],
};

/** The hero of the home page, on the page ground (HomeHero). */
export interface HomeHeroData {
  /** The theme of the hero and of the page. */
  theme: Theme;
  headline: string;
  subheadline: string;
  /** The face after the subheadline (src/lib/motion/faces.ts). */
  face?: FaceName;
  buttons: ButtonData[];
  /** The accessible name of the logos. It does not show. */
  logosLabel: string;
  logos: LogoItem[];
}

export const homeHero: HomeHeroData = {
  theme: homeTheme,
  headline: hero.headline,
  subheadline: hero.subheadline ?? '',
  face: hero.face,
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      variant: 'accent',
      arrow: false,
    },
    { label: 'Read the docs', href: '/docs', variant: 'soft', arrow: false },
  ],
  logosLabel: 'Trusted by teams at',
  logos: [
    {
      ...c.polestar,
      href: '/case-studies/polestar',
      description: '250+ editors powering 28+ locales across 35 roles',
    },
    {
      ...c.hashicorp,
      href: '/case-studies/hashicorp',
      description: '5M API calls and 2 TB of traffic a month, stress-free',
    },
    {
      ...c.arduino,
      href: '/case-studies/arduino',
      description: '92.5% less code and 50% faster time to market',
    },
    {
      ...c.ricola,
      href: '/partners/dept/showcase/ricola',
      description: 'A futureproof platform for a globally loved brand',
    },
    {
      ...c.lofficiel,
      href: '/partners/cantiere-creativo/showcase/l-officiel',
      description: '30 magazines powered from a single instance',
    },
    {
      ...c.satispay,
      href: '/partners/quinck/showcase/satispay',
      description: 'A powerhouse stack for Europe’s leading fintech',
    },
    {
      ...c.wild,
      href: '/partners/rotate/showcase/wild',
      description: 'Shopify and DatoCMS, for ecommerce',
    },
    {
      ...c.freitag,
      href: '/partners/dept/showcase/freitag-f-cut',
      description: 'A central database layer for 300K products in 5 locales',
    },
    {
      ...c.payfit,
      href: '/partners/nicolas-spehler/showcase/payfit',
      description: 'A modern website for the UK’s leading Payroll SaaS',
    },
    {
      ...c.netflix,
      href: '/partners/thomas-aufresne/showcase/netflix-france-10-year-anniversary',
      description: 'A digital experience marking 10 years of Netflix France',
    },
  ],
};

export const userExperience: UserExperienceData = {
  theme: homeTheme,
  developer: {
    headline: 'Fresh tools, predictable workflows, and full control.',
    button: { label: 'Developer comfort', href: '/developers' },
  },
  editor: {
    headline: 'Familiar editing, structured content, and fewer bottlenecks.',
    button: { label: 'Editor happiness', href: '/editor-experience' },
  },
  record: {
    title: 'Infrastructure with human skills',
    subtitle: 'Brand and Website for Human Interface',
    url: 'humaninterface.studio/work/infrastructure',
  },
  site: { brand: 'Human Interface', links: ['Work', 'Studio', 'Contact'] },
  query: {
    file: 'query.graphql',
    lines: [
      [
        { text: 'query', tone: 'accent' },
        ' ',
        { text: 'CaseStudy', tone: 'strong' },
        '($slug: String) {',
      ],
      ['  ', { text: 'caseStudy', tone: 'strong' }, '(filter: { slug: { eq: $slug } }) {'],
      ['    ', { text: 'title', tone: 'strong' }],
      ['    ', { text: 'subtitle', tone: 'strong' }],
      ['    ', { text: 'heroVideo', tone: 'strong' }, ' { video { mp4Url } }'],
      ['  }'],
      ['}'],
    ],
    thread: 2,
  },
  // No grid on the background, the pixel highlight of the theme (the
  // lilac of the purple theme), and no lens.
  video: { src: '/videos/fist-bump.pxv', palette: 'tonalHighlight', lens: false },
};

export const contentSource: ContentSourceData = {
  headline: 'Give your content a long, healthy life',
  face: 'relaxed',
  paragraph:
    'Website, chatbot, mobile, a car dashboard? One place for every role to manage content across every output.',
  button: {
    label: 'Get started',
    href: dashboardUrl('/signup'),
    variant: 'accent',
  },
  channels: [
    'Kiosk',
    'Watch',
    'Alexa',
    'Store',
    'Chatbot',
    'Website',
    'App',
    'Smart TV',
    'Car Widget',
  ],
  activeChannel: 'Chatbot',
};

// The four pillars, as in the Product menu. Each row links to its page and
// shows a fragment of that page (src/pages/index.astro). A description is
// two lines at most from 1152px: the list keeps its height on hover. Each
// row has the theme of the first chapter of its page: change both together.
export const features: FeaturesData = {
  title: 'Meet the product.',
  features: [
    {
      title: 'Editor experience',
      href: '/editor-experience',
      description: 'A calm environment for editors. Structure for the developers who build on it.',
      theme: 'green',
    },
    {
      title: 'For developers',
      href: '/developers',
      description: 'Modular how you like it. Steady how you need it. From the schema to the CDN.',
      theme: 'orange',
    },
    {
      title: 'Media',
      href: '/media',
      description:
        'Upload once, query everywhere. Every file in one library, sized for each screen.',
      theme: 'pink',
    },
    {
      title: 'AI',
      href: '/ai',
      description: 'Bring the assistant you already use, or none at all. Your models, your call.',
      theme: 'blue',
    },
  ],
  button: {
    label: 'See all features',
    href: '/features',
    variant: 'soft',
  },
};

// A blog post page in each framework with an official guide (llms.txt),
// with the components of our library for that framework (responsive
// image, Structured Text, SEO tags). Each page calls the helper that its
// guide puts in lib/datocms (performRequest, useQuery, executeQuery) with
// the query of the last tab. Keep the lines short (56 characters at
// most): the card is 500px wide.
const queryCode = `// lib/queries.ts: one query for every framework
export const postQuery = /* GraphQL */ \`
  query Post($slug: String) {
    post(filter: { slug: { eq: $slug } }) {
      # The SEO and social tags, ready to render
      _seoMetaTags {
        attributes content tag
      }
      cover {
        # Every size, plus a blurred preview
        responsiveImage(imgixParams: { w: 1200 }) {
          src srcSet width height
          alt base64
        }
      }
      # Structured Text: a JSON tree, not HTML
      content { value }
    }
  }
\`;`;

const nextCode = `// app/blog/[slug]/page.js
import {
  SRCImage, StructuredText, toNextMetadata,
} from 'react-datocms';
import { performRequest } from '@/lib/datocms';
import { postQuery } from '@/lib/queries';

const getPost = async ({ params }) =>
  performRequest(postQuery, {
    variables: await params,
  });

// Title, description and social cards
export async function generateMetadata(props) {
  const { post } = await getPost(props);
  return toNextMetadata(post._seoMetaTags);
}

export default async function Page(props) {
  const { post } = await getPost(props);
  return (
    <article>
      {/* Responsive, with a blur-up placeholder */}
      <SRCImage data={post.cover.responsiveImage} />
      <StructuredText data={post.content} />
    </article>
  );
}`;

const nuxtCode = `<!-- pages/blog/[slug].vue -->
<script setup>
import {
  Image as DatocmsImage,
  StructuredText as DatocmsStructuredText,
  toHead,
} from 'vue-datocms';
import { postQuery } from '~/lib/queries';

const { data } = await useQuery(postQuery, {
  variables: useRoute().params,
});
const post = computed(() => data.value.post);

// Title, description and social cards
useHead(() => toHead(post.value._seoMetaTags));
</script>

<template>
  <article>
    <!-- Responsive, with a blur-up placeholder -->
    <DatocmsImage :data="post.cover.responsiveImage" />
    <DatocmsStructuredText :data="post.content" />
  </article>
</template>`;

const svelteKitCode = `<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  import {
    Head, Image, StructuredText,
  } from '@datocms/svelte';

  // load() in +page.server.ts sends postQuery
  // ($lib/queries) and gives the post to the page
  let { data } = $props();
</script>

<!-- Title, description and social cards -->
<Head data={data.post._seoMetaTags} />

<article>
  <!-- Responsive, with a blur-up placeholder -->
  <Image data={data.post.cover.responsiveImage} />
  <StructuredText data={data.post.content} />
</article>`;

const astroCode = `---
// src/pages/blog/[slug].astro
import {
  Image, Seo, StructuredText,
} from '@datocms/astro';
import { executeQuery } from '~/lib/datocms';
import { postQuery } from '~/lib/queries';

const { post } = await executeQuery(postQuery, {
  variables: Astro.params,
});
---

<head>
  <!-- Title, description and social cards -->
  <Seo data={post._seoMetaTags} />
</head>
<article>
  <!-- Responsive, with a blur-up placeholder -->
  <Image data={post.cover.responsiveImage} />
  <StructuredText data={post.content} />
</article>`;

export const frameworkIntegration: TextWithImageData = {
  title: 'Integrate with one line of code.',
  // Each :name: is the mark of the framework (src/components/Emoji).
  tagline:
    'Use the frameworks you prefer. Our official guides and SDKs cover :astro: Astro, :nextjs: Next.js, :nuxt: Nuxt, and :sveltekit: SvelteKit.',
  button: {
    label: 'Explore integrations',
    href: '/docs',
    variant: 'soft',
    logos: ['astro', 'nextjs', 'nuxt', 'sveltekit'],
  },
  code: {
    active: 0,
    tabs: [
      {
        label: 'Astro',
        lang: 'astro',
        code: astroCode,
        notes: [
          { comment: 15, point: 'Seo' },
          { comment: 19, point: 'Image' },
        ],
      },
      {
        label: 'Next.js',
        lang: 'tsx',
        code: nextCode,
        notes: [
          { comment: 13, point: 'toNextMetadata' },
          { comment: 23, point: 'SRCImage' },
        ],
      },
      {
        label: 'Nuxt',
        lang: 'vue',
        code: nuxtCode,
        notes: [
          { comment: 15, point: 'toHead' },
          { comment: 21, point: 'DatocmsImage' },
        ],
      },
      {
        label: 'SvelteKit',
        lang: 'svelte',
        code: svelteKitCode,
        notes: [
          { comment: 12, point: 'Head' },
          { comment: 16, point: 'Image' },
        ],
      },
      {
        label: 'Query',
        lang: 'ts',
        code: queryCode,
        notes: [
          { comment: 5, point: '_seoMetaTags' },
          { comment: 10, point: 'responsiveImage' },
          { comment: 16, point: 'content' },
        ],
      },
    ],
  },
};

export const questionAnswer: QuestionAnswerData = {
  headline: 'Bring your AI',
  face: 'aha',
  subline: 'Your AI assistant feels right at home in DatoCMS.',
  ask: {
    title: 'Connect your AI',
    href: '/docs/mcp-server',
    question: 'How many pages are still missing SEO descriptions?',
    models: ['Claude', 'ChatGPT', 'Gemini'],
    answer: '8 pages are missing them',
  },
  install: {
    title: 'Teach it DatoCMS',
    href: '/docs/agent-skills',
    command: 'npx skills add datocms',
    folders: ['datocms-setup/', 'datocms-cda/', 'datocms-cli/'],
  },
  // Leads to the AI pillar.
  more: {
    text: 'Translations, image tags, video captions, and whatever ships next. All opt-in.',
    button: { label: 'Explore AI', href: '/ai', variant: 'solid', size: 'l' },
  },
};

// The TeamMember records of the people of the team who close the threads.
const MATTEO_GIACCONE = '39830610';
const STEFANO_VERNA = '39830606';
const MARCELO_FINAMOR = '79766956';

export const community: CommunityData = {
  headline: 'Community',
  // :heart: reads "love" (src/components/Emoji).
  muted: 'Ask us anything. We’d :heart: to help you build.',
  paragraph: 'Connect with developers who already run DatoCMS in production.',
  button: {
    label: 'Visit community',
    href: 'https://community.datocms.com',
    variant: 'soft',
  },
  // Left to right. The first post is the open card on top of the pile.
  // Mostly feature requests that we shipped, from community.datocms.com.
  posts: [
    {
      author: { name: 'Flumi' },
      askedAt: '2025-05-01T20:00:27Z',
      title: 'Support MCP?',
      tag: 'Feature Request',
      outcome: 'shipped',
      closedBy: { name: 'mat_jack1', teamMember: MATTEO_GIACCONE },
      closedAt: '2025-12-11T00:00:00Z',
    },
    {
      author: { name: 'kalle.laakso' },
      askedAt: '2026-06-16T00:00:00Z',
      title: 'Allow disabling automatic bullet list generation',
      tag: 'Feature Request',
      outcome: 'shipped',
      closedBy: { name: 's.verna', teamMember: STEFANO_VERNA },
      closedAt: '2026-06-25T00:00:00Z',
    },
    {
      author: { name: 'yiying.lim' },
      askedAt: '2026-07-20T08:03:29Z',
      title: 'Hitting MODULAR_BLOCK_IN_USE when performing migration',
      outcome: 'solved',
      closedBy: { name: 'm.finamor', teamMember: MARCELO_FINAMOR },
      closedAt: '2026-07-21T11:17:57Z',
    },
    {
      author: { name: 'Lee' },
      askedAt: '2020-10-27T20:47:47Z',
      title: 'Control Video Thumbnail/Poster',
      tag: 'Feature Request',
      outcome: 'shipped',
      closedBy: { name: 'mat_jack1', teamMember: MATTEO_GIACCONE },
      closedAt: '2026-07-20T00:00:00Z',
    },
  ],
};

export const ctaPricing: CtaBannerData = {
  variant: 'light',
  theme: 'yellow',
  headline: 'Pricing as it should be.',
  muted: 'Transparent and predictable (even when renewing).',
  buttons: [{ label: 'Explore pricing', href: '/pricing', variant: 'soft' }],
};

export const productUpdates: ProductUpdatesData = {
  headline: 'We ship and ship and ship.',
  muted: 'Here’s what’s new in DatoCMS.',
  allHref: '/product-updates',
};

export const caseStudies: CaseStudiesData = {
  headline: 'Trusted by teams who build things we’re both proud of.',
  buttons: [
    {
      label: 'Talk to sales',
      href: '/contact',
      arrow: false,
      contact: 'sales',
    },
    {
      label: 'All case studies',
      href: '/case-studies',
      variant: 'soft',
    },
  ],
};

export const partners: PartnersData = {
  eyebrow: 'Agency Partners',
  paragraph: 'Our partners are seriously creative, and they ship all over the world.',
  buttons: [
    {
      label: 'Become a Partner',
      href: '/partner-program',
      arrow: false,
      contact: 'partners',
    },
    {
      label: 'Explore all partners',
      href: '/partners',
      variant: 'soft',
    },
  ],
  // Space becomes the accent surface, the ocean dark squares and the land
  // accent squares.
  video: { src: '/videos/spinning-globe.pxv', palette: 'globe' },
};
