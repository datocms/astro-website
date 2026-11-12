import { headersCode } from '~/data/developers-code';
import {
  blocksChapter,
  buildTriggersChapter,
  chapterNav,
  closer,
  draftsChapter,
  fetchChapter,
  heroButtons,
  mediaChapter,
  realTimeChapter,
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
    description:
      'DatoCMS with SvelteKit: GraphQL from server load functions, responsive images and video with @datocms/svelte, draft mode with visual editing, and real-time updates.',
  },
  hero: {
    label: 'SvelteKit + DatoCMS',
    headline: 'SvelteKit in front, content backed by DatoCMS.',
    subheadline: 'Load functions fetch it, @datocms/svelte renders and previews it',
    face: 'cool',
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
    intro:
      'A cookie turns draft mode on, and the load function passes `includeDrafts` when it’s set. Add `contentLink` and a single `<ContentLink />` component, and every text links to its field.',
    draft: code.draftCode,
    contentLink: code.contentLinkCode,
  }),
  realTime: realTimeChapter({
    docsRoot,
    muted: 'New posts appear without a reload.',
    intro:
      '`querySubscription` from `@datocms/svelte` keeps the page in sync over Server-Sent Events, for editors in draft mode or for every visitor of a live page.',
  }),
  liveCode: code.liveCode,
  liveDescription:
    'Events Record created on the left, the component with its querySubscription store under it, the live blog Cup final: live on the right. Each event goes down the stream into the store, and its post comes in at the top of the blog, with no reload.',
  publishKind: 'build-triggers',
  publish: buildTriggersChapter({ headersCode }),
  showcase: {
    label: 'Built with SvelteKit and DatoCMS',
    headline: 'Sites built on both.',
    intro: 'Projects that our partners built with SvelteKit and DatoCMS.',
  },
  integrations: ['svelte'],
  // The features of the README of the starter kit.
  closer: closer({
    docsRoot,
    repo: starterRepo,
    subline:
      'SvelteKit 2 and Svelte 5 in TypeScript, with draft mode, click-to-edit overlays, real-time updates and SEO metadata. The Web Previews and SEO plugins come set up. All with helpful comments to get you going.',
  }),
  // The review of Matteo Manzo (Cantiere Creativo).
  reviewId: '39832307',
  docsRoot,
  starterRepo,
};
