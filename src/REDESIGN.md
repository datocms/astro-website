# The redesign: rules for the new code

The new datocms.com comes from the prototype (repository `datocms/website-prototype`, `../../prototype` next to this repository). The port follows `PLAN.md`. This file holds the rules of the prototype `AGENTS.md` that apply to the new code here, adapted to this stack. Two more files hold rules for their directory, copied from the prototype:

- `src/data/AGENTS.md`: the copy, the pages, the pillars and the chapters.
- `src/scenes/AGENTS.md`: the pictures of the product (scenes, frames, fragments, diagrams, photos).

Read `TONE_OF_VOICE.md` (repository root) before you write or change any text that a visitor sees.

The old site and its rules (the root `AGENTS.md`) stay valid for the old pages. See "Two layout families" there.

## Code from the prototype

The port from the prototype stopped at a commit of the prototype (`PLAN.md`, principle 1). The paths of the prototype do not need to stay the same: move, rename or change a component when it helps. To port a later change of the prototype, diff from that commit and adapt the change to the code here.

When you copy code from the prototype, clean its comments. Remove the comments that reference Figma (frame names, node IDs, variant names). Remove the comments that say only what the code says. Keep the comments that explain something that the code does not make clear: a reason, a constraint, a workaround, or a link to another file.

## Directories

```
src/
  components/<Name>/        Component.astro, style.module.css, index.ts (and types.ts when the props are shared)
                            The old components are in components/legacy/<Name>/ (never use them on a new page).
  data/                     the copy of every page, one typed file for each route (src/data/AGENTS.md)
  scenes/                   the pictures of the product (src/scenes/AGENTS.md)
  layouts/Layout.astro      the layout of the new pages; imports src/styles/global.css once
  lib/motion/               typewriter, inView, inViewVideo, sceneSequence, diagramLoop
  lib/pixel-video/          the player of the .pxv files
  lib/code/, lib/format/, lib/theme.ts, lib/colorScheme.ts
  styles/                   tokens.css (all tokens), typography.css (type classes), global.css (reset + element defaults)
vendor/                     the tarball of the scene kit (@datocms/product-scenes)
public/videos/              the .pxv files
redesign-css-scope.mjs      which CSS is the redesign (cascade layers and lint:css)
```

Not ported: the Cloudflare adapter, `src/pages/dev/` (the dev pages, with the pixel encoder), the scripts of the prototype (`scripts/`: pixel videos, scene shots, Unsplash photos, vendor-scenes) and `public/images/`. A page port copies the static images that it needs. When the CMS already has the data (team, case studies, reviews, logos), the page reads the CMS and does not copy the images.

## The layout

`src/layouts/Layout.astro` is the prototype layout on top of `BaseLayout` (the head of the site: SEO, favicon, canonical URL, RSS links, cookie consent, analytics, draft-mode content link).

- The prop `seo` is required. Use the `seo` / `_seoMetaTags` of the CMS record of the page when it exists. Else build the tags: `overrideSeo([], seoTitle(title), seoDescription(text))` from `~/lib/datocms/seo`. The prototype prop `title` does not exist here.
- The other props are the prototype ones: `theme`, `headerVariant`, `headerTheme`, `headerCta`, `footer`, `footerTheme`.
- A new page does a full load: no `ClientRouter`, no progress bar.
- The optional prop `seoAnalysis` takes the `yoastAnalysis` field (the SEO/Readability plugin) of the CMS record. In draft mode, the layout then shows `SeoAnalysisPanel` at the bottom right: the keywords of the record, and where the page uses them (title, meta description, h1, h2, first paragraph). Not in the prototype.
- `<main>` has `id="layout-content"`: the endpoint `/api/seo-analysis` reads the content of the page from this element. Do not remove it.
- `PageNav` (the menu at the bottom left) shows only when `DEPLOYMENT_DESTINATION` is not `production`. It is for reviewers, not part of the design.

## Components

```
src/components/MyComponent/
  Component.astro    # the Astro component
  style.module.css   # its CSS module
  index.ts           # barrel: exports the component (and its types, and its fragment)
```

- All imports use the barrel path: `import { MyComponent } from '~/components/MyComponent'`. Inside the directory, relative imports.
- Sections (a Hero, a Faq, a PageCloser…) get their static copy as a typed object from `src/data/`, and their CMS data from a fragment (see "CMS"). Building blocks (Button, Headline, Section, Typewriter, PixelVideo…) are used inside sections. Chrome (SiteHeader, FooterLinks, SearchPopup, PageNav) is in the layout.
- `Prose` styles long-form text: its CSS targets the elements of the HTML, inside `@scope (.prose) to (prose-island > *)`. A block with its own design wraps its markup in `<prose-island>`, and Prose does not style it.
- A section sets `data-theme="default|orange|green|purple|blue|pink"`; children inherit. Theme comes from the section, never from the component. Breakpoints are media queries, never props. State (hover, active, focus) is CSS/JS, never a prop.
- React only for the product scenes, rendered on the server (no `client:` directive).

## Styling

- Styles live in `.module.css` files next to their component (`style.module.css`) or page (`_style.module.css`). Class names are camelCase. `:global()` only to reach a child the component does not render.
- **Cascade layers**, lowest first: `reset, tokens, base, vendor, blocks, sections, pages`. `Layout.astro` gives this list to `BaseLayout`, which puts the statement as the first child of `<head>`. A rule in a higher layer wins over a lower layer, whatever the specificity and the order of the CSS. The Vite plugin `cssLayers` in `astro.config.ts` puts each CSS module of the redesign in its layer: a ported page under `src/pages/` is `pages`, every other module is `sections`, unless line 1 of the file is a marker such as `/* @layer blocks */`. The stylesheet of the scene kit is `vendor`.
- **The scope of the plugin** is in `redesign-css-scope.mjs`. The old CSS modules get no layer (they must not change). Thus:
  - a new component directory needs no change (every directory of `src/components/` except `src/components/legacy/` is the redesign);
  - **when you port a page, add its directory (or file) under `src/pages/` to `REDESIGN_PAGE_DIRS`**, else its `_style.module.css` gets no layer and loses to every section;
  - when you delete an old component directory (in `src/components/legacy/`), just delete it. Never add a directory in `src/components/legacy/`, and never import a component from it on a new page.
- **Rules of the cascade.**
  - Never repeat a class to win (`.content.content`). Never add an element or an ancestor to a selector to win. Never use `!important` outside `global.css`. If a rule does not win, the file is in the wrong layer, or the block needs an API.
  - A section or a page does not override a longhand of a block. It uses the API of the block: its props and its custom properties, such as `--section-padding-top` and `--section-content-max`.
  - `contentClass` of Section is for the layout of the content box. It never sets `max-width` or `margin-inline`. Use `width="headline"` or `width="reading"`.
  - Two rules in the same layer on the same element and property: give one of them more specificity on purpose, or put the base rule in `:where()`. Say why in a comment.
  - Run `npm run lint:css` (stylelint, only on the CSS of the redesign). A disable comment needs a reason (`/* stylelint-disable-next-line rule -- reason */`).
- **Never hard-code a hex in a component.** Use the semantic theme tokens `--surface-*`, `--text-*`, `--border-*`. Primitives (`--color-*`) are only for `tokens.css`.
- **Two schemes, light and dark.** `data-scheme` on `<html>` gives the scheme: the inline script in the head of the layout sets it before the first paint, and `src/lib/colorScheme.ts` changes it. Use a token for its role, not for the colour it has in light. Only when no token fits, a component sets a rule under `:global(:root[data-scheme='dark'])`, with a comment that says why. Check each change in both schemes.
- Content column max `--content-max` (1160px), side padding `--section-padding-x`, headline column `--section-padding-x-headlines`, vertical padding `--section-padding-y`. Centred statements cap at `--headline-max` (900px).
- Tokens for roles, all in `src/styles/tokens.css`:
  - `--text-accent`, `--text-positive`, `--text-negative`: accent-hued, confirmation and error text on the page surface.
  - `--surface-status-info|positive|warning` with `--text-status-*`: callouts, pills and warnings.
  - `--surface-nav-active`, `--text-nav-active`: the entry of the page you read in a sidebar or a table of contents.
  - `--surface-field`, `--border-field`: a form field.
  - `--surface-method-get|post|put|delete`: the pill of an HTTP method.
  - `--shadow-popover`, `--shadow-card`, `--scrim`: elevation and the backdrop of a drawer.
  - `--type-docs-body`, `--type-docs-small`, `--type-docs-label`, `--type-docs-h2`, `--type-docs-h3`: the type of dense reference content. Only the docs use them. The marketing pages use `--type-body` and the typography classes.
- Spacing: only `--space-*` tokens. Type: only `--type-*` sizes, through the typography classes (`.display`, `.h1`, `.h2`, `.body`, `.bodyMedium`, `.bodyLong`, `.subtitle`, `.subtitleMedium`, `.caption`, `.code`, `.codeSmall`).
- Breakpoints (min-width): 768, 1152, 1320. One exception: `SceneFrame` and `SceneFragment` switch from the phone drawing to the desktop drawing at 650. Hover only inside `@media (hover: hover)`.

### Design source

Figma file `WnWBSVVcroe5s4tXQGnhSA` (overnice's original), page **Components** (`455:11066`). For the Figma MCP, use overnice's shared copy `2nEQ2LGxRaWjxWzjuVoXBV` (same node IDs). The pages at every breakpoint are on **Designed Pages Responsive** (`699:21450`). The prototype is the reference for a port: compare the new page with the prototype page at 1320 px and 393 px, in light and dark.

### Fonts

- `--font-sans`: ABC Oracle, variable. CSS 400 = Regular, 500 = Medium; use only these two.
- `--font-mono`: Geist Mono 500, for code. The product scenes use it.
- The files come from this site: `/fonts/<file>` (`src/pages/fonts/[file].ts`), a proxy to `UI_FONTS_BASE_URL`. The layout preloads ABC Oracle. In local dev, set `UI_FONTS_BASE_URL` (see `cubo.json5`), else the fonts give 404.
- Never put a copy of a font file in this repository: the licence does not allow it.

### Motion

- Use the shared helpers in `src/lib/motion/`. CSS before JS.
- `prefers-reduced-motion` shows the final state; animations play in view only and pause off-screen; no layout shift; the final state is in the DOM without JS.
- No Lottie; no video for anything that CSS can do. The pixel videos are `.pxv` files played by `src/lib/pixel-video/`. The encoder (`/dev/pixel-encoder`) stays in the prototype: make a new `.pxv` there and copy it to `public/videos/`.

## CMS

- The queries use the query runner of this site: `executeQuery(Astro, query, options?)` from `~/lib/datocms/executeQuery` (draft mode, surrogate keys, content link). A prototype page calls `executeQuery(query)`: add `Astro`.
- A component that shows CMS data gets its data from a fragment. It declares the fragment in `graphql.ts` (`MyComponentFragment`, fields only), and the barrel exports both. Its props are the fragment types (`FragmentOf<typeof MyComponentFragment>`), and it reads them with `readFragment` (both from `~/lib/datocms/graphql`). The page query spreads the fragment, and the page passes the result to the component directly. Do not convert a CMS result into the types of `src/data/` in the page.
- A prop that takes records of two types: the query selects `__typename` next to the fragment of each type, and the component reads the fragment of that type (see `Testimonials`). Do not use a fragment on `RecordInterface` with `... on XRecord`: the CDA refuses it when no other field of the query returns `XRecord`.
- A Structured Text field renders with `~/components/StructuredText`: `StructuredText` (the full rendering), `InlineParagraphs` (in a `<p>` or a `<span>`: no `<p>`, two line breaks between the paragraphs) or `PlainText` (only the text, for a quote or a title). In draft mode these keep the stega of Content Link, thus Content Link works. Make a string from a field only when the target needs a string (JSON-LD, a search attribute), and write the reason in a comment. Remove the stega with `stripStega` when the string is not visible text. When you trim visible text, keep the stega at the end.
- Queries go in `_graphql.ts` files at the page level. A route with parameters must have one (the `routes` integration in `astro.config.ts` expects it).
- A CMS logo (a black SVG) goes in a `LogoItem` with `mask` (the URL) instead of `src`: `Logo` shows it as a CSS mask in the colour of the text, thus it is correct on each theme. Not in the prototype.
- Fragments on `ResponsiveImage` do not specify `imgixParams`: callers pass them at query time. Omit `auto: format` (the default of the project).
- The types of the data files (`HeroData`, `FeaturesData`…) are the first draft of the future modular-content models. Structured content (navigation, changelog, case studies, reviews, customers, partners) comes from the existing models of the project.

## Gotchas

- `astro build` and `astro check` while `astro dev` runs break the dependency cache of the dev server: stop `astro dev` first.
- After a new tarball of the scene kit in `vendor/`, run `npm install` and restart `astro dev`.
- Write every code comment in Simplified Technical English (short sentences, one idea each, the imperative for instructions).
