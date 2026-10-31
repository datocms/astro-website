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
import * as code from '~/data/cms-nuxt-code';

/*
 * Route /cms/nuxtjs-cms: DatoCMS with Nuxt (src/data/cms.ts). Nuxt 4 and
 * vue-datocms, as datocms/nuxt-starter-kit. The carousel also shows the
 * sites of the Vue integration.
 */

const docsRoot = '/docs/nuxt';
const starterRepo = 'datocms/nuxt-starter-kit';

export const page: FrameworkPage = {
  slug: 'nuxtjs-cms',
  name: 'Nuxt',
  seo: {
    title: 'Nuxt.js CMS - The easiest way to manage content with Nuxt.js',
    // New copy.
    description:
      'DatoCMS with Nuxt: GraphQL from one composable, responsive images and video with vue-datocms, draft mode with visual editing, and real-time updates.',
  },
  // New copy.
  hero: {
    label: 'Nuxt + DatoCMS',
    headline: 'Nuxt in front, DatoCMS behind.',
    subheadline:
      'One composable fetches it, one subscribes to it, the components of vue-datocms render it. Nothing to host but your app',
    buttons: heroButtons({ repo: starterRepo, docsRoot }),
  },
  chapterNav: chapterNav({ label: 'Build triggers and cache tags', href: '#build-triggers' }),
  fetch: fetchChapter({ docsRoot, code: code.fetchCode, client: code.clientCode }),
  media: mediaChapter({
    docsRoot,
    imageTag: '<DatocmsImage>',
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
      'A cookie turns draft mode on, and the page passes includeDrafts from it. Add contentLink and one <ContentLink />: every text links to its field.',
    draft: code.draftCode,
    contentLink: code.contentLinkCode,
  }),
  realTime: realTimeChapter({
    docsRoot,
    // New copy.
    muted: 'Posts land without a reload.',
    intro:
      'useQuerySubscription from vue-datocms keeps the page in sync over Server-Sent Events. For editors in draft mode, or for every visitor of a live page.',
    scene:
      'Events Record created on the left, the component with its useQuerySubscription composable under it, the live blog Cup final: live on the right. Each event goes down the stream into the composable, and its post comes in at the top of the blog, with no reload.',
  }),
  liveCode: code.liveCode,
  publishKind: 'build-triggers',
  publish: buildTriggersChapter({ headersCode }),
  // New copy.
  showcase: {
    label: 'Built with Nuxt and DatoCMS',
    headline: 'Some sites that run on both.',
    intro: 'Websites of our customers and projects of our partners, built with Nuxt on DatoCMS.',
  },
  integrations: ['nuxt-js', 'vue'],
  // The features of the README of the starter kit.
  starter: starter({
    repo: starterRepo,
    // New copy.
    subline:
      'Nuxt 4 in TypeScript, with draft mode, click-to-edit overlays, real-time updates and SEO metadata. The Web Previews and SEO plugins come set up. Every file is commented.',
  }),
  // The review of Emil Olsson. The quote shows when the review is gone.
  reviewId: '39832294',
  quote: {
    quote:
      '“Thanks for a brilliant product, I have tried the competition and in my opinion DatoCMS is waaaaaay ahead.”',
    name: 'Emil Olsson',
    role: 'Freelance Creative',
  },
  docsRoot,
  starterRepo,
};
