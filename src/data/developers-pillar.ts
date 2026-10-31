import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { QuoteData, StatementData } from '~/data/case-studies';
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
import type { CategoryNavData } from '~/data/features';

/*
 * Route /developers: the Modeling and delivery pillar (src/data/AGENTS.md).
 * Seven chapters: Schema builder, GraphQL, Real-time, Delivery,
 * Environments, Automation, Plugins. The opinion sits between Environments
 * and Automation.
 *
 * Every chapter is a ChapterLayout: its real copy, and a box with
 * the description of each picture until its scene exists. The copy is a
 * draft, for Ronak's pass. A "(check)" comment marks a
 * fact to verify before the copy is final.
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

// New copy. The line of the voice guide; the hero of the design ("From developers
// who've seen enough.") is the alternative.
export const hero: HeroData = {
  label: 'For developers',
  headline: 'Modular how you like it.',
  subheadline: 'And steady how you need it, from the schema to the CDN. Nothing to host',
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

// Chapter 1. Old pages: /features/schema-builder, the modeling part of
// /features/developer-experience. Validations come here from
// /features/data-integrity.
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
      'Models, blocks, and fields with their validations, built quickly in the UI (or quickly-er via the CLI). Every change is live in the API instantly: no config files to sync, no redeploy, no drama.',
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
  scene:
    'Northlight’s Schema tab: the models at left, the fields of Products at right, the text field Care instructions open on Presentation: the Markdown editor with its toolbar buttons, and the menu of its editors open: Markdown, HTML or a simple textarea.',
  fragments: [
    {
      // Data integrity: a schema change reaches every existing record at
      // once, and we do the work. A new slug field gets a slug for each
      // record, made from its name; a deleted record takes its links with
      // it (each links field can choose another behaviour); a new
      // validation checks each record again and marks the ones that break
      // it as invalid. No migration script, no dangling link.
      title: 'Every record follows the schema.',
      text: 'Added a field, deleted a record, or made a rule stricter? We update all records affected, and flag the ones that no longer pass validations without you having to write any script.',
      // Another point of view on the frame: not the field, but the records under it.
      picture:
        'The articles of Northlight’s journal as a table, the records as rows and the fields as columns: each schema change rings one header and changes every cell under it (a new slug field opens a column, with a slug made from the name of each article; the deleted tag News leaves every article; a new validation marks the article left with no tag invalid).',
    },
    {
      // The other side of data integrity: a change that would leave a
      // record broken does not happen. DatoCMS refuses to delete a block
      // that a field still allows, an upload that a record still uses, a
      // locale that a record still needs, and says which.
      title: 'Applied, or refused.',
      text: 'Any change that would leave records broken gets refused and flagged for review. No more broken links, outdated translations, or lost assets because one thing changed.',
      picture:
        'The log of the schema changes of Northlight’s articles: each change comes as a pill and lands at the top with its verdict, how many records it changed, or why we refused it (a block that a field still allows, a locale that an article still needs, an upload that three records still use).',
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
      'One endpoint serves all your content, strongly typed from your schema. Filters, pagination, metadata, SEO, locales, drafts, linked records… all come in one request exactly how you ask for them.',
    link: docs('/docs/content-delivery-api'),
  },
  scene:
    'Code, no UI: the query of Arc floor lamp (name, price, category, three related lamps with their hero image) and its response, side by side.',
  sceneCode: [lampQuery, lampResponse],
  fragments: [
    {
      // What the API computes, a tab for each: the image, the SEO tags,
      // the inverse relationships, the video. Each tab has its own site.
      title: 'Answers, not just raw data.',
      text: 'Images cropped at the focal point, SEO tags of a page, links, stream-ready videos, all of it. You ask, we compute.',
      picture:
        'Code, four tabs: a magazine cover cropped on its focal point, with its blurred copy in base64 and its colours; the meta tags of a recipe and the favicons of the site; the last three articles that quote a person; the video of a lesson, with its stream, an MP4 and a poster.',
      code: apiCode,
    },
    {
      // Built: src/scenes/Graphql/Ping.astro. Not a map: the number that
      // counts is the time, thus the picture measures it, live, in the
      // browser of the visitor (the TTFB at the nearest edge, the median
      // of five requests; the round trip when the browser does not give
      // the TTFB). It shows no number that it did not measure. The old
      // page counted 74 edges: no count is drawn.
      title: 'From the edge. Every time. Obviously ☝️',
      text: 'Every query, file, image, and video is answered or served from the nearest edge node to the visitor.',
      picture:
        'Your browser and the nearest edge of the Content Delivery API, with the time between them in ms, measured live.',
    },
  ],
};

// Chapter 3: the real-time API.
export const realTime: ChapterLayoutData = {
  id: 'real-time',
  theme: 'purple',
  chapter: {
    label: 'Real-time Updates API',
    headline: 'The same query.',
    muted: 'But make it a stream.',
    intro:
      'Any query can be a subscription over Server-Sent Events. One hook in React, Vue, or Svelte lets you serve content updates instantly without delays or rebuilds.',
    link: docs('/docs/real-time-updates-api'),
  },
  // Built: src/scenes/RealTime/, in the grammar of the diagrams
  // (src/scenes/diagram/). A loop of events, no caption, no screen of the
  // cms: the stream stays open, each new record goes down it, through the
  // hook in the component, and comes in at the top of the live blog of a
  // cup final. The frame says the chapter, thus no fragments follow.
  // (check) the names of the hooks of vue-datocms and @datocms/svelte.
  scene:
    'Events Record created on the left, the component with its useQuerySubscription hook under it, the live blog Cup final: live on the right. Each event goes down the stream into the hook, and its post comes in at the top of the blog, with no refresh.',
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
      'Get fine-grained cache invalidation with every response listing the records it used as cache tags. No more stale content. No more full rebuilds.',
    link: docs('/docs/content-delivery-api/cache-tags'),
  },
  // Built: src/scenes/Delivery/, in the grammar of the diagrams
  // (src/scenes/diagram/). The wall is a loop of events, no caption.
  // It shows the claim, not the mechanism: the fragments have the header,
  // the webhook and the CDN side.
  scene:
    'A wall of cached pages. Events arrive one after the other: each purges the few pages that used it, the other pages close the gap, and new pages join the wall at the end.',
  // The frame is a diagram: the first fragment is its two arrows as bytes,
  // the header in one tab and the webhook payload in the other.
  fragments: [
    {
      title: '`X-Cache-Tags` out, `X-Cache-Tags` back.',
      text: 'Ask with one header, and the response names the records, models and assets it used. When one changes, a webhook identifies the tags to purge.',
      picture:
        'Code, two tabs: the response headers of the Arc floor lamp query with the X-Cache-Tags header marked, and the payload of the invalidation webhook with the two tags of the diagram.',
      code: headersCode,
    },
    {
      // Netlify in place of Next.js: Next.js caps a fetch at 128 tags and
      // needs a mapping layer (docs), which one tab cannot tell honestly.
      title: 'Using Fastly, Cloudflare, or Netlify?',
      text: 'Surrogate keys or cache-tag headers: the tags map onto what your CDN already honours. Oh, and there’s guides for Astro and Next.js too.',
      picture:
        'Code: three tabs, Fastly, Cloudflare, Netlify, each with the header its CDN reads for the same tags: Surrogate-Key, Cache-Tag, Netlify-Cache-Tag.',
      code: cdnCode,
    },
  ],
};

// New copy. The one opinion of the page, between chapter 5 and chapter 6.
export const opinion: StatementData = {
  label: 'The “boring” stuff matters.',
  // *already* is in italics (src/components/InlineText).
  text: 'So a sandbox behaves like a branch, a migration is a script in your repo, and a promotion is a deploy. A CMS should fit the way you *already* ship, not recreate it. We’re just a piece of your peace of mind.',
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
      'Fork the primary environment with its content. Guiltlessly make breaking changes to the schema in the copy, write the migration, promote it, done. Editors keep working in the primary while you get your own environment to play with.',
    link: docs('/docs/general-concepts/primary-and-sandbox-environments'),
  },
  // Built: src/scenes/Environments/, in the grammar of the diagrams
  // (src/scenes/diagram/). A git graph of the environments, a loop of
  // releases, no caption and no use case: the frame tells the workflow,
  // not a change of a schema. The dialogs of the fork and of the
  // promotion and the maintenance banner went: the graph shows each of
  // those steps.
  // (check) The muted line and the intro do not match the graph: a
  // promotion moves the ref of the primary, it does not merge (an edit in
  // main after the fork is not in the sandbox; the maintenance mode is
  // there for that), and editors keep working while you build, but not
  // during a release. For Ronak's pass.
  scene:
    'A git graph of the environments. Editors change content in main; maintenance:on locks it; migrations:run forks it into release-1 and runs the migrations there; environments:promote moves the ref Primary to release-1, and main stays, dim, as the way back; maintenance:off. Then the next release.',
  fragments: [
    {
      title: 'The CLI generates migration scripts.',
      text: 'Compare two environments, and the CLI writes the migration script for it to ensure you can commit and promote without any unresolved issues.',
      picture:
        'Code: a terminal: migrations:new with --autogenerate=my-feature:main, then the script it wrote, a field created.',
      code: [migrationTab],
    },
    {
      // The safe deployment sequence of the CLI docs, the commands of the pill of the graph
      title: 'A new release is four steps.',
      text: 'Lock the primary environment, fork it with its content, run the migrations, promote to main. The old primary stays as a sandbox should you ever need to roll back.',
      picture:
        'Code: the release script of a CI job: maintenance:on, migrations:run, environments:promote, maintenance:off.',
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
      'The Content Management API, with a typed client and a CLI, writes anything an editor can. Webhooks and build triggers tell your connected systems what changed.',
    link: docs('/docs/content-management-api'),
  },
  // The frame is code, no UI: a script that syncs the catalogue (it lists,
  // updates, creates and publishes products), typed by the generated
  // ItemTypeDefinition of the model Products, in the second tab. The notes
  // tell what each call gives.
  scene:
    'Code, no UI: a typed script syncs the catalogue of the shop: it finds each product by SKU, updates its price or creates it, and publishes it. The second tab is the generated type of Products.',
  sceneCode: automationCode,
  fragments: [
    {
      title: 'Webhooks on any event.',
      text: 'Records, models, uploads, environments, publishing… Pick the events and the models, add your headers, and we call your URL. Didn’t work? We retry too.',
      // The entities and the events are the real ones of the webhooks
      // (src/scenes/Automation/hooks.ts). No build triggers: the next
      // fragment is about them.
      picture:
        'A diagram: the panel Events lists the entities of a webhook (item, item_type, upload, environment, maintenance_mode, cda_cache_tags; sso_user dim, not ticked). One event at a time (item publish, upload create, environment promote…) sends a pulse to POST /webhooks, with its custom header, and the URL answers 200 OK.',
    },
    {
      // Built: src/scenes/Automation/Deploys.astro, in the grammar of the
      // diagrams. The docs: the button "Publish changes" and the status of
      // the build are in the top navigation bar; a scheduled publication
      // can start a build by itself (autotrigger_on_scheduled_publications).
      title: 'Deploy when editors publish.',
      text: 'Connect Vercel, Netlify, or your own pipeline. A new build starts when an editor publishes, or when a scheduled post goes live, and editors can see its status.',
      picture:
        'A round trip down and up: the bar of DatoCMS with the trigger (Publish changes, or a scheduled post) and the status; the build goes down to Vercel, Netlify, GitLab or your own CI, the lines of its log come in, and the status comes back up: Deploying, then Deployed.',
    },
  ],
};

// Chapter 7: the plugins. Built: src/scenes/Plugins/. The
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
      'Need to give your projects some added capabilities? There’s a plugin for that. A plugin is a tiiiiiny React app. In your project. In a frame. In the CMS. Build one for yourself, or install one of 100+ from our plugin catalog.',
    link: docs('/docs/plugin-sdk'),
  },
  // Each part of the plugin Trail tools is drawn in the record editor, with
  // the name of its hook on a tag. The hooks are the real ones of
  // datocms-plugin-sdk. The frame plays a sequence: the spotlight goes from
  // part to part, in the order of this text. At load no tag shows.
  scene:
    'The record editor of Alpine Trails on the trail Lac Blanc loop, with the parts of the plugin Trail tools, each with the name of its hook: the tab Reports in the navigation bar (mainNavigationTabs), the button Publish (onBeforeItemsPublish), a strip above the fields with the live page and two stats (renderItemFormOutlet), the field Difficulty with five boot marks (renderFieldExtension) and the panel Trail conditions in the aside (renderItemFormSidebarPanel).',
  fragments: [
    {
      title: 'Hooks for every nook and cranny.',
      text: 'Field editors, sidebar panels, pages, record actions, sub-menus, checks before publish, they can all be plugin-ized. Declare the hook, render it, and run it.',
      picture:
        'Code in five tabs, one for each part of Trail tools in the frame (Field, Panel, Page, Outlet, Publish): the hook that declares the part and the hook that renders it in the Canvas of the React UI kit; Publish stops the publish of a trail without its GPX track.',
      code: pluginCode,
    },
    {
      // The list of the Plugins screen in the settings of the project, as
      // the cms sorts it: by name.
      title: 'Private, or for the community.',
      // "most of the 100+ are open source": the docs say "100+ open-source
      // plugins". (check) with the marketplace the day the page ships.
      text: 'A private one stays in your projects. A public one is an npm package others can install, and most of the 100+ are open source, so you can fork one to start.',
      picture:
        'The Plugins screen of the project settings: AI Translations, SEO/Readability Analysis, Trail tools with the pill Private, and Web Previews.',
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

// The closer: one quote from wall-of-love.ts. November Five built Le Pain
// Quotidien.
// The page shows the quote of the CMS review of Stijn Symons. This quote is
// the fallback, for when the review is gone.
export const closing: QuoteData = {
  quote: '“It’s faster than anything we’ve used.”',
  name: 'Stijn Symons',
  role: 'Director of Architecture, November Five',
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
  headline: 'For fellow nerds who read the status page.',
  items: [
    { title: '40 ms', text: 'Average API response' },
    { title: '99.99%', text: 'Uptime' },
    { title: '6B', text: 'Requests a month' },
    { title: '74', text: 'Edge locations' },
  ],
};
