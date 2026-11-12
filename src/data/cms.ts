import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { CodeTab } from '~/components/CodeSnippetPreview';
import type { CategoryNavData } from '~/components/CategoryNav';
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
   * What a screen reader hears for the frame of the Real-time chapter (the
   * Stream), with the name of the hook or of the component.
   */
  liveDescription: string;
  /**
   * The last chapter. `cache-tags`: the frame is the wall of cached pages,
   * the fragments are code. `build-triggers`: the frame is code, the
   * fragments are the diagrams of the webhooks and of the deploys.
   */
  publishKind: 'cache-tags' | 'build-triggers';
  publish: ChapterLayoutData;
  /** The header of the carousel of the projects built with the framework. */
  showcase: ChapterHeaderData;
  /** The integration records whose showcase projects the carousel shows. */
  integrations: string[];
  /** The call to action of the closer: the starter kit. */
  closer: CtaBannerData;
  /** The ID of the CMS review of the quote after the real-time chapter. */
  reviewId: string;
  /** The root of the docs of the framework. */
  docsRoot: string;
  /** The GitHub repository of the starter kit, as owner/name. */
  starterRepo: string;
}

/** The docs link of a chapter header. */
export function docs(href: string): ChapterHeaderData['link'] {
  return { label: 'Read the docs', href, variant: 'soft' };
}

/** The dashboard link that deploys the starter kit of a repository. */
export function deployUrl(repo: string): string {
  return dashboardUrl(`/deploy?repo=${repo}:main`);
}

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

// Chapter 1: the query of a page. The frame is code: the page
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
        '`@datocms/cda-client` wraps `fetch`. Query a post with its cover and its body, and you get back exactly that, served from the nearest edge.',
      link: docs(args.docsRoot),
    },
    sceneCode: args.code,
    fragments: [
      {
        title: 'Drafts, validations and tags, all in the same call.',
        text: 'Pass `includeDrafts`, `excludeInvalid` or `returnCacheTags` to the same query. The client sets the headers without your query changing.',
        code: args.client,
      },
      {
        title: 'Served from the nearest edge.',
        text: 'Every query is answered from the edge node nearest to the visitor. This one was just measured from your browser.',
      },
    ],
  };
}

// Chapter 2: images and video. The frame is the Lab of /media.
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
        'Query `responsiveImage` or `video`, and pass the result to one component. Srcset, blur-up placeholders, lazy loading and HLS streaming are built in, so you don’t need an image pipeline.',
      link: docs(`${args.docsRoot}/managing-images`),
    },
    fragments: [
      {
        title: 'Pass the query result as one prop.',
        text: 'The component reads `src`, `srcSet` and the base64 placeholder from the API. The `sizes` are automatic: the browser picks the right file for the width of the image on the screen.',
        code: args.image,
      },
      {
        title: 'Video without a video stack.',
        text: 'Upload an MP4 and the API returns a Mux playback ID. The player streams it in HLS, with a blurred poster placeholder.',
        code: args.video,
      },
    ],
  };
}

// Chapter 3: blocks and Structured Text. The frame is the
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
        'A landing page is a list of blocks, each with a `__typename`, and a body is a DAST tree. Both map onto your components with minimal configuration.',
      link: docs(args.docsHref),
    },
    fragments: [
      {
        title: 'A switch on __typename.',
        text: 'Each block type is one component. Editors order the list as they build pages, and you render it in that order.',
        code: args.sections,
      },
      {
        title: 'Structured Text, rendered.',
        text: 'Headings and paragraphs render by default, and any record or block inside the text renders with your own component.',
        code: args.body,
      },
    ],
  };
}

// Chapter 4: draft mode and Content Link. The frame is the tab
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
      muted: 'Visitors see what’s published.',
      intro: args.intro,
      link: docs(`${args.docsRoot}/visual-editing`),
    },
    fragments: [
      {
        title: 'One cookie.',
        text: 'One route sets the cookie, one removes it. The Web Previews plugin opens the draft of a record from the CMS with the cookie included.',
        code: args.draft,
      },
      {
        title: 'Click the text, edit the field.',
        text: 'With `contentLink` on, the API wraps each text in invisible metadata. The component reads it and draws the outlines. This stays off in production.',
        code: args.contentLink,
      },
    ],
  };
}

// Chapter 5: the Real-time Updates API. The frame is the Stream
// of /developers, with the code card of the framework. No fragments.
export function realTimeChapter(args: {
  docsRoot: string;
  muted: string;
  intro: string;
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
    fragments: [],
  };
}

// Chapter 6, for a framework with a cache that takes tags: the
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
    fragments: [
      {
        ...args.tags,
      },
      {
        ...args.webhook,
      },
    ],
  };
}

// Chapter 6, for a framework without a cache that takes tags:
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
        'A build trigger redeploys the site when an editor publishes a change. Cache tags go even finer: every response names the records it uses, and a webhook only purges the ones that changed.',
      link: docs('/docs/content-delivery-api/cache-tags'),
    },
    sceneCode: args.headersCode,
    fragments: [
      {
        title: 'Webhooks on any event.',
        text: 'Pick the events you care about, from records to uploads to publishing, and we call your URL with the cache tags of what changed. Your CDN purges only those pages.',
      },
      {
        title: 'Deploy when editors publish.',
        text: 'The simplest option is a full build on every publish. Connect Vercel, Netlify or your own pipeline, and editors see the build status in the CMS.',
      },
    ],
  };
}

/** The call to action of the closer: the starter kit and the docs of the framework. */
export function closer(args: { repo: string; docsRoot: string; subline: string }): CtaBannerData {
  return {
    variant: 'light',
    theme: 'green',
    headline: 'Start from a working project.',
    muted: 'Deploy it, then make it yours.',
    subline: args.subline,
    buttons: [
      {
        label: 'Deploy the starter',
        href: deployUrl(args.repo),
        arrow: false,
      },
      { label: 'Read the docs', href: args.docsRoot, variant: 'soft' },
    ],
  };
}

/** The two buttons of the hero: the starter kit and the docs. */
export function heroButtons(args: { repo: string; docsRoot: string }): HeroData['buttons'] {
  return [
    {
      label: 'Deploy the starter',
      href: deployUrl(args.repo),
      arrow: false,
    },
    { label: 'Read the docs', href: args.docsRoot, variant: 'soft' },
  ];
}
