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
import * as code from '~/data/cms-astro-code';

/*
 * Route /cms/astro-cms: DatoCMS with Astro (src/data/cms.ts). The page
 * has no landing page record in the CMS. The cache tags chapter follows
 * the docs page "Using cache tags" (Astro 7 or later, with
 * output: 'server'). datocms/astro-starter-kit has no cache tags: the
 * starter banner does not name them.
 */

const docsRoot = '/docs/astro';
const starterRepo = 'datocms/astro-starter-kit';

export const page: FrameworkPage = {
  slug: 'astro-cms',
  name: 'Astro',
  seo: {
    // New copy.
    title: 'Headless CMS for Astro',
    // New copy.
    description:
      'DatoCMS with Astro: GraphQL from the frontmatter, responsive images with @datocms/astro, draft mode with visual editing, real-time updates and cache tags.',
  },
  // New copy.
  hero: {
    label: 'Astro + DatoCMS',
    headline: 'Astro in front, content backed by DatoCMS.',
    subheadline: 'The frontmatter fetches it, @datocms/astro renders it, tags refresh it',
    face: 'cool',
    intro: 'Nothing to host but your app.',
    buttons: heroButtons({ repo: starterRepo, docsRoot }),
  },
  chapterNav: chapterNav({ label: 'Cache tags', href: '#cache-tags' }),
  fetch: fetchChapter({ docsRoot, code: code.fetchCode, client: code.clientCode }),
  media: mediaChapter({
    docsRoot,
    imageTag: '<Image>',
    image: code.imageCode,
    video: code.videoCode,
  }),
  blocks: blocksChapter({
    docsHref: `${docsRoot}/structured-text-fields`,
    sections: code.sectionsCode,
    body: code.bodyCode,
  }),
  drafts: draftsChapter({
    docsRoot,
    // New copy.
    intro:
      'A cookie turns draft mode on, and the page passes `includeDrafts` when it’s set. Add `contentLink` and a single `<ContentLink />` component, and every text links to its field.',
    draft: code.draftCode,
    contentLink: code.contentLinkCode,
  }),
  realTime: realTimeChapter({
    docsRoot,
    // New copy.
    muted: 'The page reloads itself.',
    intro:
      '`<QueryListener />` from `@datocms/astro` listens to the query over Server-Sent Events and reloads the page when the result changes. It’s most useful for editors in draft mode.',
  }),
  liveCode: code.liveCode,
  liveDescription:
    'Events Record created on the left, the page with its QueryListener component under it, the live blog Cup final: live on the right. Each event goes down the stream into the listener, the page reloads, and the post comes in at the top of the blog.',
  publishKind: 'cache-tags',
  publish: cacheTagsChapter({
    docsHref: `${docsRoot}/using-cache-tags`,
    // New copy.
    intro:
      'Every response lists its records in `X-Cache-Tags`. Astro’s cache API tags the page with them, and a webhook purges them on Cloudflare, Netlify or Vercel.',
    tags: {
      title: 'The tags go on the page.',
      text: 'Add one option to the request, and the response names the records it used. Astro’s cache API tags the page with them for a year.',
      code: code.tagsCode,
    },
    webhook: {
      title: 'One webhook, one invalidation.',
      text: 'DatoCMS sends the tags that changed, and the route passes them to the Cloudflare, Netlify or Vercel cache. Nothing else is purged.',
      code: code.webhookCode,
    },
  }),
  // New copy.
  showcase: {
    label: 'Built with Astro and DatoCMS',
    headline: 'Sites built on both.',
    intro: 'Customer websites and partner projects built with Astro and DatoCMS.',
  },
  integrations: ['astro'],
  // The features of the README of the starter kit. No cache tags.
  starter: starter({
    repo: starterRepo,
    // New copy.
    subline:
      'Astro in TypeScript, with draft mode, click-to-edit overlays, real-time updates and SEO metadata. The Web Previews and SEO plugins come set up. All with helpful comments to get you going.',
  }),
  // The review of Caleb Wise (Elliott Systems).
  reviewId: 'fT4Qn9KQSJCnKqPvVcYoIw',
  docsRoot,
  starterRepo,
};
