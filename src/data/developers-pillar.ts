import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { StatementData } from '~/components/Statement';
import type { CtaBannerData, HeroData } from '~/data/home';
import {
  apiCode,
  cdnCode,
  headersCode,
  lampQuery,
  lampResponse,
  automationCode,
  migrationTab,
  releaseCode,
  pluginCode,
} from '~/data/developers-code';
import type { CategoryNavData } from '~/components/CategoryNav';

/*
 * Route /developers: the Modeling and delivery pillar (src/data/AGENTS.md).
 * Seven chapters: Schema builder, GraphQL, Real-time, Delivery,
 * Environments, Automation, Plugins. The opinion sits between Environments
 * and Automation.
 *
 * Every chapter is a ChapterLayout: its real copy, and a box with
 * the description of each picture that has no scene. A "(check)" comment
 * marks a fact to verify.
 *
 * The pictures of the page tell one story: Northlight, a maker of lamps
 * with a shop and a journal. Its product "Arc floor lamp" runs through the
 * chapters: modelled, queried, cached, forked, scripted. The Plugins
 * chapter has its own story: Alpine Trails, a site of hikes, and its
 * private plugin Trail tools. The `scene` and
 * `picture` strings describe each picture in one line.
 */

const docs = (href: string): ChapterHeaderData['link'] => ({
  label: 'Read The Docs',
  href,
  appearance: 'deep-on-white',
  variant: 'soft',
});

// New copy. The line of the voice guide.
export const hero: HeroData = {
  label: 'For developers',
  headline: 'Modular how you like it.',
  subheadline: 'And steady how you need it, from the schema to the CDN, with nothing to host',
  face: 'aha',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    { label: 'Read The Docs', href: '/docs', appearance: 'deep-on-white', variant: 'soft' },
  ],
};

// The chapter nav under the hero: one item for each chapter, in page order.
// The href is the id of the chapter.
export const chapterNav: CategoryNavData = {
  items: [
    { label: 'Schema builder', href: '#schema' },
    { label: 'GraphQL Content Delivery API', href: '#graphql' },
    { label: 'Real-time Updates API', href: '#real-time' },
    { label: 'Cache tags', href: '#delivery' },
    { label: 'Environments', href: '#environments' },
    { label: 'Management API and webhooks', href: '#automation' },
    { label: 'Plugins', href: '#plugins' },
  ],
};

// Chapter 1: the schema builder, the modeling and the validations.
export const schema: ChapterLayoutData = {
  id: 'schema',
  theme: 'orange',
  chapter: {
    label: 'Schema builder',
    headline: 'Model it.',
    muted: 'Query it a second later.',
    // (check) The intro does not claim "no codegen step": types are
    // generated optionally.
    intro:
      'Models, blocks, and fields with their validations, built in the UI or the CLI. Change something, and it’s live in the API. No redeploy.',
    link: docs('/docs/content-modelling'),
  },
  // The frame plays a sequence: the field list, a click on the text field
  // Care instructions opens its settings on the tab Settings, a click on
  // the tab Presentation (the help text, and the Markdown editor with its
  // toolbar buttons), then a click on Change opens the menu of the editors. The still is that menu.
  // What a schema change does to the records (a new field, a deleted
  // record, a new validation) is in the fragment "Every record follows the
  // schema."; the changes that DatoCMS refuses are in "Applied, or
  // refused.".
  fragments: [
    {
      // Data integrity: a schema change reaches every existing record at
      // once, and we do the work. A new slug field gets a slug for each
      // record, made from its name; a deleted record takes its links with
      // it (each links field can choose another behaviour); a new
      // validation checks each record again and marks the ones that break
      // it as invalid. No migration script, no dangling link.
      title: 'Every record follows the schema. No exceptions.',
      text: 'Added a field, deleted a record, made a validation stricter? We update every record, and flag the ones that no longer meet your rules.',
      // Another point of view on the frame: not the field, but the records under it.
    },
    {
      // The other side of data integrity: a change that would leave a
      // record broken does not happen. DatoCMS refuses to delete a block
      // that a field still allows, an upload that a record still uses, a
      // locale that a record still needs, and says which.
      title: 'Applied, or refused.',
      text: 'Would a change break a record? We refuse it, and tell you which records get in the way.',
    },
  ],
};

// Chapter 2: the GraphQL API, and the map of our edge
// (our edge, not the CDN of the customer's site:
// that one is chapter 4).
export const graphql: ChapterLayoutData = {
  id: 'graphql',
  theme: 'green',
  chapter: {
    label: 'GraphQL Content Delivery API',
    headline: 'Ask for a title.',
    muted: 'Get a title.',
    intro:
      'One endpoint for all your content, typed from your schema. Filters, pagination, locales, drafts, SEO, linked records? Same request.',
    link: docs('/docs/content-delivery-api'),
  },
  sceneCode: [lampQuery, lampResponse],
  fragments: [
    {
      // What the API computes, a tab for each: the image, the SEO tags,
      // the inverse relationships, the video. Each tab has its own site.
      title: 'Answers, not just raw data.',
      text: 'Images cropped at the selected focal point, SEO tags of a page, linked records, stream-ready video. You ask, we compute.',
      code: apiCode,
    },
    {
      // Not a map: the number that
      // counts is the time, thus the picture measures it, live, in the
      // browser of the visitor (the TTFB at the nearest edge, the median
      // of five requests; the round trip when the browser does not give
      // the TTFB). It shows no number that it did not measure. The old
      // page counted 74 edges: no count is drawn.
      title: 'From whichever edge is closest.',
      text: 'Every query, image, and video is served from the edge node nearest to the visitor.',
    },
  ],
};

// Chapter 3: the real-time API.
export const realTime: ChapterLayoutData = {
  id: 'real-time',
  theme: 'purple',
  chapter: {
    label: 'Real-time Updates API',
    headline: 'The same query,',
    muted: 'as a stream.',
    intro:
      'Any query can be a subscription over Server-Sent Events. One hook in React, Vue, or Svelte, and content updates go live. Your components don’t change.',
    link: docs('/docs/real-time-updates-api'),
  },
  // In the grammar of the diagrams
  // (src/scenes/diagram/). A loop of events, no caption, no screen of the
  // cms: the stream stays open, each new record goes down it, through the
  // hook in the component, and comes in at the top of the live blog of a
  // cup final. The frame says the chapter, thus no fragments follow.
  // (check) the names of the hooks of vue-datocms and @datocms/svelte.
  fragments: [],
};

// Chapter 4: the cache tags. The chapter is about the CDN
// of the customer's site, the one the tags purge; our own edge is the map
// of chapter 2.
export const delivery: ChapterLayoutData = {
  id: 'delivery',
  theme: 'blue',
  chapter: {
    label: 'Cache tags',
    headline: 'Purge what changed.',
    muted: 'The rest stays cached.',
    intro:
      'Every response lists the records it used as cache tags. When content changes, a webhook names the tags to purge.',
    link: docs('/docs/content-delivery-api/cache-tags'),
  },
  // In the grammar of the diagrams
  // (src/scenes/diagram/). The wall is a loop of events, no caption.
  // It shows the claim, not the mechanism: the fragments have the header,
  // the webhook and the CDN side.
  // The frame is a diagram: the first fragment is its two arrows as bytes,
  // the header in one tab and the webhook payload in the other.
  fragments: [
    {
      title: '`X-Cache-Tags` out, back by webhooks.',
      text: 'Ask with one header, and the response lists the records, models, and assets it used. When one changes, a webhook names the tags to purge.',
      code: headersCode,
    },
    {
      // Netlify in place of Next.js: Next.js caps a fetch at 128 tags and
      // needs a mapping layer (docs), which one tab cannot tell honestly.
      title: 'Using Fastly, Cloudflare, or Netlify?',
      text: 'Surrogate keys or cache-tag headers? The tags map onto whatever your CDN already honors. (There are guides for Astro and Next.js too.)',
      code: cdnCode,
    },
  ],
};

// New copy. The one opinion of the page, between chapter 5 and chapter 6.
export const opinion: StatementData = {
  label: 'The boring stuff matters.',
  // *already* is in italics (src/components/InlineText).
  text: 'A CMS should fit the way you *already* ship, not reinvent it. So a sandbox behaves like a branch, a migration is a script in your repo, and a promotion is a deploy.',
};

// Chapter 5: the sandbox environments and the staging workflow.
export const environments: ChapterLayoutData = {
  id: 'environments',
  theme: 'pink',
  chapter: {
    label: 'Environments',
    headline: 'A sandbox is a branch.',
    muted: 'Promotion is the merge.',
    intro:
      'Fork the primary environment with its content. Break the schema all you want, write the migration, and promote it. Editors keep working the whole time.',
    link: docs('/docs/general-concepts/primary-and-sandbox-environments'),
  },
  // In the grammar of the diagrams
  // (src/scenes/diagram/). A git graph of the environments, a loop of
  // releases, no caption and no use case: the frame tells the workflow,
  // not a change of a schema. The dialogs of the fork and of the
  // promotion and the maintenance banner went: the graph shows each of
  // those steps.
  // (check) The muted line and the intro do not match the graph: a
  // promotion moves the ref of the primary, it does not merge (an edit in
  // main after the fork is not in the sandbox; the maintenance mode is
  // there for that), and editors keep working while you build, but not
  // during a release.
  fragments: [
    {
      title: 'The CLI generates migration scripts.',
      text: 'Compare two environments, and the CLI writes the migration script for you to go into your repo, along with the code that uses it.',
      code: [migrationTab],
    },
    {
      // The safe deployment sequence of the CLI docs, the commands of the pill of the graph
      title: 'A new release is four steps.',
      text: 'Lock the primary, fork it, run the migrations, promote the fork. Changed your mind? The old primary is still there to roll back to.',
      code: releaseCode,
    },
  ],
};

// Chapter 6: automation.
export const automation: ChapterLayoutData = {
  id: 'automation',
  theme: 'orange',
  chapter: {
    label: 'Management API and webhooks',
    headline: 'Everything the UI does,',
    muted: 'the API does too.',
    intro:
      'The Content Management API, with a typed client and a CLI, writes anything an editor can. Webhooks and build triggers tell your systems what changed.',
    link: docs('/docs/content-management-api'),
  },
  // The frame is code, no UI: a script that syncs the catalogue (it lists,
  // updates, creates and publishes products), typed by the generated
  // ItemTypeDefinition of the model Products, in the second tab. The notes
  // tell what each call gives.
  sceneCode: automationCode,
  fragments: [
    {
      title: 'Webhooks on any event.',
      text: 'Records, models, uploads, environments, publishing: pick the events and the models, add your headers, and we call your URL. Didn’t work? We auto-retry too.',
      // The entities and the events are the real ones of the webhooks
      // (src/scenes/Automation/hooks.ts). No build triggers: the next
      // fragment is about them.
    },
    {
      // In the grammar of the diagrams. The docs: the button "Publish changes" and the status of
      // the build are in the top navigation bar; a scheduled publication
      // can start a build by itself (autotrigger_on_scheduled_publications).
      title: 'Deploy when editors publish.',
      text: 'Connect Vercel, Netlify, or your own pipeline. A build starts when an editor publishes or a scheduled post goes live, and editors see the build status.',
    },
  ],
};

// Chapter 7: the plugins. The
// story is the project Alpine Trails (a site of hikes) and its private
// plugin Trail tools.
export const plugins: ChapterLayoutData = {
  id: 'plugins',
  theme: 'green',
  chapter: {
    label: 'Plugins',
    headline: 'Extend.',
    muted: 'Don’t bloat.',
    // The docs say "100+ open-source plugins". (check) the number the day
    // the page ships.
    intro:
      'A plugin is a small React app in a frame inside the CMS. Build your own, or install one of 100+ from the plugin directory.',
    link: docs('/docs/plugin-sdk'),
  },
  // Each part of the plugin Trail tools is drawn in the record editor, with
  // the name of its hook on a tag. The hooks are the real ones of
  // datocms-plugin-sdk. The frame plays a sequence: the spotlight goes from
  // part to part, in the order of this text. At load no tag shows.
  fragments: [
    {
      title: 'Hooks for every nook and cranny.',
      text: 'Field editors, sidebar panels, pages, record actions, checks before publish. Declare the hook, render it with our React UI kit, and run it from localhost.',
      code: pluginCode,
    },
    {
      // The list of the Plugins screen in the settings of the project, as
      // the cms sorts it: by name.
      title: 'Private, or for the community.',
      // "most of the 100+ are open source": the docs say "100+ open-source
      // plugins". (check) with the plugins page the day the page ships.
      text: 'A private plugin stays in your projects. A published one goes on npm and into the plugin directory. Want a head start? Fork one.',
    },
  ],
};

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'For developers',
  description:
    'Model it in the schema builder, query it with GraphQL, stream it in real time, purge it with cache tags, fork it with environments, script it with the API and extend it with plugins.',
};

export const ctaBuild: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  headline: 'The best way to get to know DatoCMS',
  muted: 'is to build something with it.',
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

// After the GraphQL Content Delivery API: the numbers of the API, from the
// live site.
export const numbers: StatementsSectionData = {
  headline: 'For those who read the status page.',
  items: [
    { title: '40 ms', text: 'Average API response' },
    { title: '99.99%', text: 'Uptime' },
    { title: '6B', text: 'Requests a month' },
    { title: '74', text: 'Edge locations' },
  ],
};
