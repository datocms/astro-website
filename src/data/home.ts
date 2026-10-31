// The data of the home page. The CMS does not hold it: the data is here.
// The types have the names of CMS fragments.

import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonAppearance, ButtonImage } from '~/components/Button';
import type { LogoItem } from '~/components/LogosLine';
import type { PixelVideoSettings } from '~/lib/pixel-video/settings';
import type { Theme } from '~/lib/theme';
import arduinoClient from '~/assets/home/clients/arduino.svg?raw';
import telekomClient from '~/assets/home/clients/deutsche-telekom.svg?raw';
import freitagClient from '~/assets/home/clients/freitag.svg?raw';
import lofficielClient from '~/assets/home/clients/lofficiel.svg?raw';
import mitClient from '~/assets/home/clients/mit.svg?raw';
import netflixClient from '~/assets/home/clients/netflix.svg?raw';
import polestarClient from '~/assets/home/clients/polestar.svg?raw';
import ricolaClient from '~/assets/home/clients/ricola.svg?raw';
import satispayClient from '~/assets/home/clients/satispay.svg?raw';
import vercelClient from '~/assets/home/clients/vercel.svg?raw';
import verizonClient from '~/assets/home/clients/verizon.svg?raw';
import wildClient from '~/assets/home/clients/wild.svg?raw';
import type { CodeLang } from '~/lib/code/highlight';

export interface ButtonData {
  label: string;
  href: string;
  appearance: ButtonAppearance;
  variant?: 'solid' | 'soft';
  arrow?: boolean;
  leading?: 'userpic' | 'logos';
  leadingImages?: ButtonImage[];
  /** Overrides the theme of the section. */
  theme?: Theme;
}

export interface HeroData {
  label?: string;
  /** The strong run of the h1. */
  headline: string;
  /**
   * The muted run of the h1. It follows the headline on the same line,
   * in the same text.
   */
  subheadline?: string;
  /** The face after the subheadline. Default: `[••]`. */
  face?: string;
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
  /** The hero video of the site window. */
  video: { src: string; settings?: Partial<PixelVideoSettings> };
}

export interface ContentSourceData {
  headline: string;
  paragraph: string;
  channels: string[];
  activeChannel: string;
}

export interface FeatureItem {
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

/** A tab of CodeSnippetPreview: the code as text, highlighted by Shiki. */
export interface CodeTab {
  label: string;
  /** The code, as it is written in the file. */
  code: string;
  lang: CodeLang;
  /**
   * The lines that carry the point of the snippet, from 1: a line, or the
   * first and the last line of a range. The other lines are dim. Without
   * it, no line is dim.
   */
  focus?: (number | [number, number])[];
  /**
   * From 1152px, a comment line of the code shows as a note next to the
   * card, with a line to the code it tells about. Below 1152px, and with
   * no JavaScript, the comment stays in the code.
   */
  notes?: CodeNote[];
}

export interface CodeNote {
  /** The line of the comment, from 1. */
  comment: number;
  /** The text that the note points to, on a line after the comment. */
  point: string;
}

export type CodeToken = string | { text: string; tone: 'strong' | 'accent' };

export interface TextWithImageData {
  title: string;
  tagline: string;
  button: ButtonData;
  code: { tabs: CodeTab[]; active: number };
}

export interface QuestionAnswerData {
  headline: string;
  subline: string;
  ask: { title: string; href: string; question: string; models: string[]; answer: string };
  install: { title: string; href: string; command: string; folders: string[] };
  /** A line under the cards that leads to the page of the subject. */
  more?: { text: string; button: ButtonData };
}

export interface CommunityPost {
  author: { name: string; avatar: string };
  age: string;
  title: string;
  tag?: string;
  solvedBy: { name: string; avatar: string };
  solvedAge: string;
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
  video: { src: string; settings?: Partial<PixelVideoSettings> };
}

/** Make a logo from SVG markup. The size comes from the root attributes. */
export function svgLogo(svg: string, alt: string): LogoItem {
  const width = Number(svg.match(/\bwidth="([\d.]+)"/)?.[1] ?? 0);
  const height = Number(svg.match(/\bheight="([\d.]+)"/)?.[1] ?? 0);
  return { svg, alt, width, height };
}

export const hero: HeroData = {
  headline: 'Thoughtfully built and ambitiously used.',
  subheadline: "The AI-agnostic Headless CMS that's human on support and transparent in pricing",
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'light-on-white',
      arrow: false,
      theme: 'orange',
    },
    { label: 'Docs', href: '/docs', appearance: 'deep-on-white', variant: 'soft', arrow: false },
  ],
  logos: [
    svgLogo(polestarClient, 'Polestar'),
    svgLogo(netflixClient, 'Netflix'),
    svgLogo(verizonClient, 'Verizon'),
    svgLogo(vercelClient, 'Vercel'),
    svgLogo(telekomClient, 'Deutsche Telekom'),
    svgLogo(mitClient, 'MIT'),
    svgLogo(arduinoClient, 'Arduino'),
  ],
};

/** The hero of the home page, on a dark purple section (HomeHero). */
export interface HomeHeroData {
  headline: string;
  subheadline: string;
  /** The face after the subheadline. Default: `[••]`. */
  face?: string;
  buttons: ButtonData[];
  /** The accessible name of the logos. It does not show. */
  logosLabel: string;
  logos: LogoItem[];
}

export const homeHero: HomeHeroData = {
  headline: hero.headline,
  subheadline: hero.subheadline ?? '',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'light-on-white',
      arrow: false,
    },
    { label: 'Docs', href: '/docs', appearance: 'deep-on-white', variant: 'soft', arrow: false },
  ],
  logosLabel: 'Trusted by teams at',
  logos: [
    svgLogo(arduinoClient, 'Arduino'),
    svgLogo(ricolaClient, 'Ricola'),
    svgLogo(lofficielClient, 'L’Officiel'),
    svgLogo(satispayClient, 'Satispay'),
    svgLogo(netflixClient, 'Netflix'),
    svgLogo(freitagClient, 'Freitag'),
    svgLogo(wildClient, 'Wild'),
  ],
};

export const userExperience: UserExperienceData = {
  developer: {
    headline: 'Fresh tools, predictable workflows, and full control for devs.',
    button: { label: 'Developer Comfort', href: '/developers', appearance: 'deep-on-light' },
  },
  editor: {
    headline: 'Familiar editing, structured content, and fewer bottlenecks for editors.',
    button: { label: 'Editor Happiness', href: '/editor-experience', appearance: 'deep-on-light' },
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
  video: {
    src: '/videos/fist-bump.pxv',
    settings: {
      // The file gives the mid colour and the cell sizes. These settings
      // replace only the background, the high colour and the lens.
      // The background has no grid.
      extend: true,
      bgStrokeDisabled: true,
      hover: false,
      bgFill: 'var(--surface-inverse)',
      bgStroke: 'var(--surface-inverse)',
      // The file gives "yellow". This token is the yellow of the orange theme.
      highFill: 'var(--surface-pixel-highlight)',
    },
  },
};

export const contentSource: ContentSourceData = {
  headline: 'Give your content a long, healthy life [•*•]',
  paragraph:
    'Website, chatbot, mobile, a smart fridge? One place for every role to manage content across every output.',
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

// Only the first feature has a description. The other
// descriptions are placeholders.
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
      description:
        'A calm editing environment for editors, and structure for the developers who build on it.',
      theme: 'green',
    },
    {
      title: 'For developers',
      href: '/developers',
      description:
        'Modular how you like it, and steady how you need it. From the schema to the CDN.',
      theme: 'orange',
    },
    {
      title: 'Media',
      href: '/media',
      description:
        'Serve every screen in any size with just the right optimizations. Upload once and query everywhere.',
      theme: 'pink',
    },
    {
      title: 'AI',
      href: '/ai',
      description:
        'BYO-AI. All AI features are opt-in, so bring the assistants you already use, or none at all.',
      theme: 'blue',
    },
  ],
  button: {
    label: 'See All Features',
    href: '/features',
    appearance: 'deep-on-light',
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
          src srcSet sizes width height
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
  // New copy. Each :name: is the mark of the framework (src/components/Emoji).
  tagline:
    'Keep working with the frameworks you know and love. Integrate DatoCMS seamlessly with :nextjs: Next.js, :nuxt: Nuxt, :sveltekit: SvelteKit, and :astro: Astro, with our official integration guides and SDKs.',
  button: {
    label: 'Explore Integrations',
    href: '/docs',
    appearance: 'deep-on-white',
    variant: 'soft',
    leading: 'logos',
    leadingImages: [
      { src: '/images/home/frameworks/react.png' },
      { src: '/images/home/frameworks/nuxt.png' },
      { src: '/images/home/frameworks/svelte.png' },
    ],
  },
  code: {
    active: 0,
    tabs: [
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
        label: 'Astro',
        lang: 'astro',
        code: astroCode,
        notes: [
          { comment: 15, point: 'Seo' },
          { comment: 19, point: 'Image' },
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
  headline: 'Bring your AI [•ᴥ•]',
  subline: 'Use your fave AI your way. They feel right at home in the CMS, the CLI, or via MCP.',
  ask: {
    title: 'Connect your AI',
    href: '/docs/mcp',
    question: 'How many pages are still missing SEO descriptions?',
    models: ['Claude', 'Chat-GPT', 'Gemini'],
    answer: '8 pages are missing them',
  },
  install: {
    title: 'Teach it DatoCMS',
    href: '/docs/skills',
    command: 'npx skills add datocms',
    folders: ['datocms-setup/', 'datocms-cda/', 'datocms-cli/'],
  },
  // New copy. Leads to the AI pillar.
  more: {
    text: 'Translations, image tags, video captions and more: every AI feature is opt-in, and runs on the model you choose.',
    button: { label: 'Explore AI', href: '/ai', appearance: 'deep-on-light', variant: 'soft' },
  },
};

const forumAvatar = (n: number) => `/images/home/community/avatar-${n}.png`;

export const community: CommunityData = {
  headline: 'Community',
  // New copy. :heart: reads "love" (src/components/Emoji).
  muted: 'Ask us anything. We’d :heart: to help you build.',
  paragraph: 'Connect with 1,000s of developers actively using DatoCMS in production.',
  button: {
    label: 'Visit Community',
    href: 'https://community.datocms.com',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
  // Left to right.
  posts: [
    {
      author: { name: 'Lee', avatar: forumAvatar(5) },
      age: 'Yesterday',
      title: 'Control Video Thumbnail/Poster',
      tag: 'Feature Request',
      solvedBy: { name: 'mat_jack1', avatar: forumAvatar(6) },
      solvedAge: '23d',
    },
    {
      author: { name: 'Dev7', avatar: forumAvatar(1) },
      age: '16d',
      title: 'Vercel builds fail with connection error to graphql.datocms.com',
      solvedBy: { name: 'roger', avatar: forumAvatar(2) },
      solvedAge: '16d',
    },
    {
      author: { name: 'yiying.lim', avatar: forumAvatar(3) },
      age: '23d',
      title: 'Hitting MODULAR_BLOCK_IN_USE when performing migration',
      solvedBy: { name: 'm.finamor', avatar: forumAvatar(4) },
      solvedAge: '22d',
    },
    {
      author: { name: 'thomas.vanleynseele', avatar: forumAvatar(1) },
      age: '30d',
      title:
        'Manual drag & drop record sorting not working anymore and all have the same position (when created in parallel)',
      solvedBy: { name: 'roger', avatar: forumAvatar(2) },
      solvedAge: 'Month Ago',
    },
  ],
};

export const ctaSlack: CtaBannerData = {
  variant: 'light',
  theme: 'green',
  headline: 'Or join us on Slack.',
  subline: 'Connect with us and 3,000+ developers actively helping one another.',
  buttons: [
    {
      label: 'Join Us On Slack',
      href: 'https://datocms.com/slack',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};

export const ctaPricing: CtaBannerData = {
  variant: 'light',
  theme: 'default',
  headline: 'Pricing as it should be.',
  muted: 'Transparent, fair, and predictable. Without any renewal gotchas.',
  buttons: [
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-light', variant: 'soft' },
  ],
};

export const productUpdates: ProductUpdatesData = {
  headline: 'We ship, ship, ship.',
  muted: 'Here’s what’s new in DatoCMS.',
  allHref: '/product-updates',
};

export const caseStudies: CaseStudiesData = {
  headline: 'Trusted by incredible companies to build ambitious projects we’re both proud of.',
  buttons: [
    {
      label: 'Lets Talk!',
      href: '/contact',
      appearance: 'deep-on-white',
      arrow: false,
      leading: 'userpic',
      leadingImages: [{ src: '/images/home/userpic-talk.png' }],
    },
    {
      label: 'All Case Studies',
      href: '/case-studies',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  ],
};

export const partners: PartnersData = {
  eyebrow: 'Agency Partners',
  paragraph:
    'We’ve helped enable some seriously bold projects with some seriously creative partners across the globe.',
  buttons: [
    {
      label: 'Become a Partner',
      href: '/partner-program',
      appearance: 'light-on-deep',
      arrow: false,
      leading: 'userpic',
      leadingImages: [{ src: '/images/home/userpic-partner.png' }],
    },
    {
      label: 'Explore All Partners',
      href: '/partners',
      appearance: 'light-on-deep',
      variant: 'soft',
    },
  ],
  // The globe video has black space, a grey ocean and white land. Space
  // becomes the accent surface, the ocean dark squares with an accent grid,
  // and the land accent squares with a light grid.
  video: {
    src: '/videos/spinning-globe.pxv',
    settings: {
      bgFill: 'var(--surface-accent)',
      bgStroke: 'var(--surface-accent)',
      midFill: 'var(--surface-inverse)',
      midStroke: 'var(--surface-accent)',
      highFill: 'var(--surface-accent)',
      highStroke: 'var(--surface-default)',
    },
  },
};
