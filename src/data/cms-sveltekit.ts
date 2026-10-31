import { headersCode } from '~/data/developers-code';
import {
  blocksChapter,
  buildTriggersChapter,
  chapterNav,
  draftsChapter,
  fetchChapter,
  heroButtons,
  mediaChapter,
  realTimeChapter,
  starter,
  type FrameworkPage,
} from '~/data/cms';
import * as code from '~/data/cms-sveltekit-code';

/*
 * Route /cms/svelte-cms: DatoCMS with SvelteKit (src/data/cms.ts).
 * SvelteKit 2, Svelte 5 and @datocms/svelte, as
 * datocms/sveltekit-starter-kit.
 */

const docsRoot = '/docs/svelte';
const starterRepo = 'datocms/sveltekit-starter-kit';

export const page: FrameworkPage = {
  slug: 'svelte-cms',
  name: 'SvelteKit',
  seo: {
    title: 'Headless CMS for Svelte and SvelteKit',
    // New copy.
    description:
      'DatoCMS with SvelteKit: GraphQL from server load functions, responsive images and video with @datocms/svelte, draft mode with visual editing, and real-time updates.',
  },
  // New copy.
  hero: {
    label: 'SvelteKit + DatoCMS',
    headline: 'SvelteKit in front, DatoCMS behind.',
    subheadline:
      'A server load function fetches it, @datocms/svelte renders it, a cookie shows the drafts. Nothing to host but your app',
    buttons: heroButtons({ repo: starterRepo, docsRoot }),
  },
  chapterNav: chapterNav({ label: 'Build triggers and cache tags', href: '#build-triggers' }),
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
      'A cookie turns draft mode on, and the load function passes includeDrafts from it. Add contentLink and one <ContentLink />: every text links to its field.',
    draft: code.draftCode,
    contentLink: code.contentLinkCode,
  }),
  realTime: realTimeChapter({
    docsRoot,
    // New copy.
    muted: 'Posts land without a reload.',
    intro:
      'querySubscription from @datocms/svelte keeps the page in sync over Server-Sent Events. For editors in draft mode, or for every visitor of a live page.',
    scene:
      'Events Record created on the left, the component with its querySubscription store under it, the live blog Cup final: live on the right. Each event goes down the stream into the store, and its post comes in at the top of the blog, with no reload.',
  }),
  liveCode: code.liveCode,
  publishKind: 'build-triggers',
  publish: buildTriggersChapter({ headersCode }),
  // New copy.
  showcase: {
    label: 'Built with SvelteKit and DatoCMS',
    headline: 'Some sites that run on both.',
    intro:
      'Websites of our customers and projects of our partners, built with SvelteKit on DatoCMS.',
  },
  integrations: ['svelte'],
  // The features of the README of the starter kit.
  starter: starter({
    repo: starterRepo,
    // New copy.
    subline:
      'SvelteKit 2 and Svelte 5 in TypeScript, with draft mode, click-to-edit overlays, real-time updates and SEO metadata. The Web Previews and SEO plugins come set up. Every file is commented.',
  }),
  // The review of Matteo Manzo. The quote shows when the review is gone.
  reviewId: '39832307',
  quote: {
    quote:
      '“DatoCMS does not force you to speak its language, instead gives you the peace of mind of being able to use the right solution for each project.”',
    name: 'Matteo Manzo',
    role: 'Technical Project Manager at Cantiere Creativo',
  },
  docsRoot,
  starterRepo,
};
