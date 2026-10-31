import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { QuoteData, StatementData } from '~/data/case-studies';
import type { CodeTab, CtaBannerData, HeroData } from '~/data/home';
import type { CategoryNavData } from '~/data/features';
import { dashboardUrl } from '~/lib/datocms/dashboardUrl';

/*
 * Route /cms/[slug]: one page for each frontend framework, from one
 * template (src/pages/cms/[slug]/index.astro). This file holds the type of
 * the copy of a page, the parts that are the same on all the pages, and
 * the helpers of the copy. The copy of each page is in cms-<framework>.ts,
 * its code in cms-<framework>-code.ts. The page files import this file,
 * and this file imports none of them.
 *
 * The pictures of the pages tell one story: Tidewater, a coastal journal
 * (tidewater.press), with posts (a cover, a standfirst, a body, a video)
 * and landing pages made of sections.
 */

/** The copy of one framework page. */
export interface FrameworkPage {
  /** The slug of the route: /cms/<slug>. */
  slug: string;
  /** The name of the framework, as the copy writes it. */
  name: string;
  /** The SEO tags. The layout adds the suffix of the site to the title. */
  seo: { title: string; description: string };
  hero: HeroData;
  chapterNav: CategoryNavData;
  /** The six chapters, in page order. */
  fetch: ChapterLayoutData;
  media: ChapterLayoutData;
  blocks: ChapterLayoutData;
  drafts: ChapterLayoutData;
  realTime: ChapterLayoutData;
  /** The card of the code in the frame of the Real-time chapter. */
  liveCode: CodeTab;
  /**
   * The last chapter. `cache-tags`: the frame is the wall of cached pages,
   * the fragments are code. `build-triggers`: the frame is code, the
   * fragments are the diagrams of the webhooks and of the deploys.
   */
  publishKind: 'cache-tags' | 'build-triggers';
  publish: ChapterLayoutData;
  /** The header of the carousel of the sites built with the framework. */
  showcase: ChapterHeaderData;
  /** The integration records whose websites and showcase projects the carousel shows. */
  integrations: string[];
  starter: CtaBannerData;
  /** The ID of the CMS review of the quote, and the quote to show without it. */
  reviewId: string;
  quote: QuoteData;
  /** The root of the docs of the framework. */
  docsRoot: string;
  /** The GitHub repository of the starter kit, as owner/name. */
  starterRepo: string;
}

/** The docs link of a chapter header. */
export function docs(href: string): ChapterHeaderData['link'] {
  return { label: 'Read The Docs', href, appearance: 'deep-on-white', variant: 'soft' };
}

/** The dashboard link that deploys the starter kit of a repository. */
export function deployUrl(repo: string): string {
  return dashboardUrl(`/deploy?repo=${repo}:main`);
}

// New copy. The one opinion of the pages, after the carousel.
export const opinion: StatementData = {
  label: 'A CMS should not pick your framework.',
  text: 'We write a client and components for yours, and under all of them it is the same GraphQL endpoint. Move from one framework to the next and your content does not notice. Neither do your editors.',
};

// New copy. The call to action of the closer.
export const closer: CtaBannerData = {
  variant: 'light',
  theme: 'green',
  headline: 'Start with the starter kit,',
  muted: 'or with a blank project and the docs.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    {
      label: 'Talk To Sales',
      href: '/contact',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};

/*
 * The chapters. The structure and most of the copy are the same on the
 * four pages: each builder takes the parts that change with the
 * framework (the docs, the code, a sentence or two).
 */

/** The chapter nav: one item for each chapter, in page order. */
export function chapterNav(last: { label: string; href: string }): CategoryNavData {
  return {
    items: [
      { label: 'GraphQL Content Delivery API', href: '#fetch' },
      { label: 'Images and video', href: '#media' },
      { label: 'Modular Content and Structured Text', href: '#blocks' },
      { label: 'Draft Mode and Content Link', href: '#drafts' },
      { label: 'Real-time Updates API', href: '#real-time' },
      last,
    ],
  };
}

// New copy. Chapter 1: the query of a page. The frame is code: the page
// file and the response, side by side. The second fragment is the Ping of
// /developers.
export function fetchChapter(args: {
  docsRoot: string;
  /** The page file and the response. */
  code: CodeTab[];
  /** The helper that all the pages call. */
  client: CodeTab[];
}): ChapterLayoutData {
  return {
    id: 'fetch',
    theme: 'green',
    chapter: {
      label: 'GraphQL Content Delivery API',
      headline: 'One query per page.',
      muted: 'Typed from your schema.',
      intro:
        '@datocms/cda-client wraps fetch. Ask for a post with its cover and its body, and get exactly that back, from the nearest edge.',
      link: docs(args.docsRoot),
    },
    scene:
      'Code, no UI: the page file of a Tidewater post, with its query, and the response of the query, side by side.',
    sceneCode: args.code,
    fragments: [
      {
        title: 'Drafts, validation, tags: one option each.',
        text: 'Pass includeDrafts, excludeInvalid or returnCacheTags to the same call. The client sets the headers; the query does not change.',
        picture: 'Code: the helper that all the pages call, with the token and excludeInvalid.',
        code: args.client,
      },
      {
        title: 'From the edge. Every time.',
        text: 'Every query is answered from the edge node nearest to the visitor. This one is measured from your browser, right now.',
        picture:
          'Your browser and the nearest edge of the Content Delivery API, with the time between them in ms, measured live.',
      },
    ],
  };
}

// New copy. Chapter 2: images and video. The frame is the Lab of /media.
export function mediaChapter(args: {
  docsRoot: string;
  /** The image component of the framework, as the headline writes it. */
  imageTag: string;
  image: CodeTab[];
  video: CodeTab[];
}): ChapterLayoutData {
  return {
    id: 'media',
    theme: 'blue',
    chapter: {
      label: 'Images and video',
      headline: `responsiveImage in, ${args.imageTag} out.`,
      muted: 'Video streams the same way.',
      intro:
        'Query responsiveImage or video, give the result to one component. Srcset, blur-up placeholder, lazy loading and HLS streaming come with it. No image pipeline.',
      link: docs(`${args.docsRoot}/managing-images`),
    },
    scene:
      'The photo with the parameters of its URL as switches: crop, focal point, format, dpr. The pill of DatoCMS in the middle, the served photo on the right with its weight and format. The switches work.',
    fragments: [
      {
        title: 'One prop: the query result.',
        text: 'The component reads src, srcSet, sizes and the base64 placeholder from the API. The browser picks the file for its width.',
        picture:
          'Code: the cover of a post, the responsiveImage of the query given to one component.',
        code: args.image,
      },
      {
        title: 'Video without a video stack.',
        text: 'Upload an MP4 and the API returns a Mux playback id. The player streams it in HLS, with a blurred poster while it starts.',
        picture: 'Code: the video of a post, the video field of the query given to the player.',
        code: args.video,
      },
    ],
  };
}

// New copy. Chapter 3: blocks and Structured Text. The frame is the
// Sections field of the Dynamic layouts chapter of /editor-experience.
export function blocksChapter(args: {
  /** The docs page of Structured Text of the framework. */
  docsHref: string;
  sections: CodeTab[];
  body: CodeTab[];
}): ChapterLayoutData {
  return {
    id: 'blocks',
    theme: 'pink',
    chapter: {
      label: 'Modular Content and Structured Text',
      headline: 'Blocks become components.',
      muted: 'Rich text becomes a tree.',
      intro:
        'A landing page is a list of blocks, each with a __typename. A body is a DAST tree. Both map onto your components.',
      link: docs(args.docsHref),
    },
    scene:
      'The record editor on a landing page, the Sections field alone: the blocks in order, the menu of the block models open at the gap after one of them.',
    fragments: [
      {
        title: 'A switch on __typename.',
        text: 'Each block type is one component. Editors order the list; you render it in order.',
        picture:
          'Code, two tabs: the component that picks a component for each block by its __typename, and the query of the field Sections.',
        code: args.sections,
      },
      {
        title: 'Structured Text, rendered.',
        text: 'Headings and paragraphs render by default. A record or a block in the text gets your component.',
        picture:
          'Code, two tabs: the StructuredText component with a component for a record in the text and one for a block, and the DAST of the paragraph.',
        code: args.body,
      },
    ],
  };
}

// New copy. Chapter 4: draft mode and Content Link. The frame is the tab
// Visual of the Visual editing chapter of /editor-experience.
export function draftsChapter(args: {
  docsRoot: string;
  intro: string;
  draft: CodeTab[];
  contentLink: CodeTab[];
}): ChapterLayoutData {
  return {
    id: 'drafts',
    theme: 'orange',
    chapter: {
      label: 'Draft Mode and Content Link',
      headline: 'Editors see the draft.',
      muted: 'Visitors see the published.',
      intro: args.intro,
      link: docs(`${args.docsRoot}/visual-editing`),
    },
    scene:
      'The tab Visual of the cms: the draft site at the left, the sidebar of the visual editing at the right; "Edit mode" on, the outlines of Content Link over the page, a click on the cover opens the article.',
    fragments: [
      {
        title: 'A cookie decides.',
        text: 'One route sets the cookie, one removes it. The Web Previews plugin opens the draft of a record from the cms, cookie included.',
        picture:
          'Code: the route that checks the token, sets the cookie of draft mode and redirects, then the request that passes includeDrafts from the cookie.',
        code: args.draft,
      },
      {
        title: 'Click the text, edit the field.',
        text: 'With contentLink on, the API wraps each text in invisible metadata. The ContentLink component reads it and draws the outlines. Off in production.',
        picture:
          'Code: the layout that renders ContentLink in draft mode only, and the two options of the request.',
        code: args.contentLink,
      },
    ],
  };
}

// New copy. Chapter 5: the Real-time Updates API. The frame is the Stream
// of /developers, with the code card of the framework. No fragments.
export function realTimeChapter(args: {
  docsRoot: string;
  muted: string;
  intro: string;
  /** The description of the frame, with the name of the hook or of the component. */
  scene: string;
}): ChapterLayoutData {
  return {
    id: 'real-time',
    theme: 'purple',
    chapter: {
      label: 'Real-time Updates API',
      headline: 'Subscribe to the query.',
      muted: args.muted,
      intro: args.intro,
      link: docs(`${args.docsRoot}/real-time-updates`),
    },
    scene: args.scene,
    fragments: [],
  };
}

// New copy. Chapter 6, for a framework with a cache that takes tags: the
// frame is the Wall of /developers, the fragments are the helper and the
// webhook route.
export function cacheTagsChapter(args: {
  docsHref: string;
  intro: string;
  tags: { title: string; text: string; code: CodeTab[] };
  webhook: { title: string; text: string; code: CodeTab[] };
}): ChapterLayoutData {
  return {
    id: 'cache-tags',
    theme: 'green',
    chapter: {
      label: 'Cache tags',
      headline: 'Publish once.',
      muted: 'Purge exactly what changed.',
      intro: args.intro,
      link: docs(args.docsHref),
    },
    scene:
      'A wall of cached pages. Each event purges the few pages that used the record, the others close the gap, new pages join at the end.',
    fragments: [
      {
        ...args.tags,
        picture:
          'Code: the helper that asks for the cache tags with the query and tags the cached page with them.',
      },
      {
        ...args.webhook,
        picture:
          'Code: the route of the invalidation webhook, which checks the secret and invalidates the tags that changed.',
      },
    ],
  };
}

// New copy. Chapter 6, for a framework without a cache that takes tags:
// two roads, a build on each publish or a purge by cache tag. The frame
// is code (the headers and the webhook payload of /developers), the
// fragments are the Hooks and the Deploys of /developers.
export function buildTriggersChapter(args: { headersCode: CodeTab[] }): ChapterLayoutData {
  return {
    id: 'build-triggers',
    theme: 'green',
    chapter: {
      label: 'Build triggers and cache tags',
      headline: 'Rebuild on publish.',
      muted: 'Or purge just what changed.',
      intro:
        'A build trigger redeploys the site when an editor publishes. Cache tags go finer: every response names its records, and a webhook purges only those.',
      link: docs('/docs/content-delivery-api/cache-tags'),
    },
    scene:
      'Code, two columns: the response headers of a query, with the X-Cache-Tags header that names its records, and the payload of the webhook that sends the tags of what changed, for the CDN to purge.',
    sceneCode: args.headersCode,
    fragments: [
      {
        title: 'Webhooks on any event.',
        text: 'Records, uploads, publishing… pick the events and we call your URL, with the cache tags of what changed. Your CDN purges those pages, nothing else.',
        picture:
          'The road of the purge: the panel Events lists the entities of a webhook; one event at a time sends a pulse to your URL with its custom header, and the URL answers 200 OK.',
      },
      {
        title: 'Deploy when editors publish.',
        text: 'The simple road: a full build on every publish. Connect Vercel, Netlify or your own pipeline, and editors see the build status in the cms.',
        picture:
          'The road of the build: the bar of DatoCMS with "Publish changes" and the status; the build goes down to the pipeline, the log comes in, and the status comes back: Deploying, then Deployed.',
      },
    ],
  };
}

/** The starter kit banner. */
export function starter(args: { repo: string; subline: string }): CtaBannerData {
  return {
    variant: 'subtle',
    theme: 'green',
    // New copy.
    headline: 'Start from the starter kit.',
    muted: 'A real project, not a hello world.',
    subline: args.subline,
    buttons: [
      {
        label: 'Deploy The Starter',
        href: deployUrl(args.repo),
        appearance: 'deep-on-light',
        arrow: false,
      },
    ],
  };
}

/** The two buttons of the hero: the starter kit and the docs. */
export function heroButtons(args: { repo: string; docsRoot: string }): HeroData['buttons'] {
  return [
    {
      label: 'Deploy The Starter',
      href: deployUrl(args.repo),
      appearance: 'deep-on-white',
      arrow: false,
    },
    { label: 'Read The Docs', href: args.docsRoot, appearance: 'deep-on-white', variant: 'soft' },
  ];
}
