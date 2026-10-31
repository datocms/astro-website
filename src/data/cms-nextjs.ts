import {
  blocksChapter,
  cacheTagsChapter,
  chapterNav,
  draftsChapter,
  fetchChapter,
  heroButtons,
  mediaChapter,
  realTimeChapter,
  starter,
  type FrameworkPage,
} from '~/data/cms';
import * as code from '~/data/cms-nextjs-code';

/*
 * Route /cms/nextjs-cms: DatoCMS with Next.js (src/data/cms.ts). Next.js 16
 * and the App Router, as datocms/nextjs-starter-kit.
 */

const docsRoot = '/docs/next-js';
const starterRepo = 'datocms/nextjs-starter-kit';

export const page: FrameworkPage = {
  slug: 'nextjs-cms',
  name: 'Next.js',
  seo: {
    title: 'The most complete headless CMS to work with Next.js',
    // New copy.
    description:
      'DatoCMS with Next.js: GraphQL from Server Components, responsive images and video, Draft Mode with visual editing, real-time updates and cache tags.',
  },
  // New copy.
  hero: {
    label: 'Next.js + DatoCMS',
    headline: 'Next.js in front, DatoCMS behind.',
    subheadline:
      'Server Components fetch it, Draft Mode previews it, cache tags keep it fresh. Nothing to host but your app',
    buttons: heroButtons({ repo: starterRepo, docsRoot }),
  },
  chapterNav: chapterNav({ label: 'Cache tags', href: '#cache-tags' }),
  fetch: fetchChapter({ docsRoot, code: code.fetchCode, client: code.clientCode }),
  media: mediaChapter({
    docsRoot,
    imageTag: '<SRCImage>',
    image: code.imageCode,
    video: code.videoCode,
  }),
  blocks: blocksChapter({
    docsHref: `${docsRoot}/rendering-structured-text-fields`,
    sections: code.sectionsCode,
    body: code.bodyCode,
  }),
  drafts: draftsChapter({
    docsRoot,
    // New copy.
    intro:
      'Draft Mode sets a cookie, and the page passes includeDrafts from it. Add contentLink and one <ContentLink />: every text links to its field.',
    draft: code.draftCode,
    contentLink: code.contentLinkCode,
  }),
  realTime: realTimeChapter({
    docsRoot,
    // New copy.
    muted: 'Posts land without a reload.',
    intro:
      'useQuerySubscription from react-datocms keeps a Client Component in sync over Server-Sent Events. For editors in Draft Mode, or for every visitor of a live page.',
    scene:
      'Events Record created on the left, the component with its useQuerySubscription hook under it, the live blog Cup final: live on the right. Each event goes down the stream into the hook, and its post comes in at the top of the blog, with no reload.',
  }),
  liveCode: code.liveCode,
  publishKind: 'cache-tags',
  publish: cacheTagsChapter({
    docsHref: `${docsRoot}/using-cache-tags`,
    // New copy.
    intro:
      'Every response lists its records in X-Cache-Tags. Store them beside the query id; the webhook calls revalidateTag on the queries that changed.',
    tags: {
      // Next.js accepts 128 tags at most on one fetch: the fetch gets the
      // id of its query as its one tag, and a table keeps the cache tags of
      // each query.
      title: 'The tags come with the response.',
      text: 'One fetch, tagged with the id of its query. The X-Cache-Tags header names the records it used; a small table keeps the two together.',
      code: code.tagsCode,
    },
    webhook: {
      title: 'One webhook, one revalidateTag.',
      text: 'DatoCMS sends the tags that changed. The route finds the queries that used them and revalidates each. Nothing else moves.',
      code: code.webhookCode,
    },
  }),
  // New copy.
  showcase: {
    label: 'Built with Next.js and DatoCMS',
    headline: 'Some sites that run on both.',
    intro: 'Websites of our customers and projects of our partners, built with Next.js on DatoCMS.',
  },
  integrations: ['nextjs'],
  // The features of the README of the starter kit.
  starter: starter({
    repo: starterRepo,
    // New copy.
    subline:
      'Next.js 16 and the App Router in TypeScript, with draft mode, click-to-edit overlays, real-time updates, SEO metadata and cache invalidation on publish. Every file is commented.',
  }),
  // The review of Tore Heimann. The quote shows when the review is gone.
  reviewId: '39832291',
  quote: {
    quote:
      '“We are so happy with DatoCMS. I’m representing Signifly - an agency currently running 20 projects, and will increase with +10 projects per year.”',
    name: 'Tore Heimann',
    role: 'Technical Lead at Signifly',
  },
  docsRoot,
  starterRepo,
};
