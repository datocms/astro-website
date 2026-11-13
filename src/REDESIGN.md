# The site: rules for the code

Two more files hold rules for their directory:

- `src/data/AGENTS.md`: the copy, the pages, the pillars and the chapters.
- `src/scenes/AGENTS.md`: the pictures of the product (scenes, frames, fragments, diagrams, photos).

Read the voice in `BRAND.md` (repository root, sections 2, 4, 5 and 7) before you write or change any text that a visitor sees.

## Directories

```
src/
  components/<Name>/        Component.astro, style.module.css, index.ts (and types.ts when the props are shared)
  data/                     the copy of every page, one typed file for each route (src/data/AGENTS.md)
  scenes/                   the pictures of the product (src/scenes/AGENTS.md)
  layouts/Layout.astro      the layout of the pages; imports src/styles/global.css once
  lib/motion/               typewriter, inView, inViewVideo, sceneSequence, diagramLoop
  lib/pixel-video/          the player of the .pxv files, and format.ts (the file format, for the player and the scripts)
  lib/code/, lib/format/, lib/theme.ts, lib/colorScheme.ts
  styles/                   tokens.css (all tokens), typography.css (type classes), global.css (reset + element defaults)
  assets/blog-covers/       the blog covers, one pixel for each cell ("Blog covers")
  dev/                      the tools of the developers, at /dev/* (see "Dev tools")
vendor/                     the tarball of the scene kit (@datocms/product-scenes)
public/videos/              the .pxv files
scripts/pixel-videos/       the source videos of the .pxv files, drawn in code
scripts/blog-covers/        gen.ts: makes and checks the blog covers
css-scope.mjs               which CSS gets a cascade layer, and which CSS lint:css reads
```

## The layout

`src/layouts/Layout.astro` is on top of `BaseLayout` (the head of the site: SEO, favicon, canonical URL, RSS links, cookie consent, analytics, draft-mode content link).

- The prop `seo` is required. Use the `seo` / `_seoMetaTags` of the CMS record of the page when it exists. Else build the tags: `overrideSeo([], seoTitle(title), seoDescription(text))` from `~/lib/datocms/seo`.
- The other props: `theme`, `headerVariant`, `headerCta`, `footer`.
- `theme` is the theme of the page: the hue of its area (a reference page) or of its first chapter (a marketing page). The table of all the pages is in DESIGN.md, "Page themes". On a marketing page, read the theme from the data of the first chapter (`theme={dev.schema.theme}`), not from a literal. The header, the `PageCloser` and the footer have no theme prop: they take the theme of the page.
- `headerVariant` is the ground of the hero, and the `variant` of the `Hero` is the same value: `page` on a marketing page, `accent` on a reference page.
- The optional prop `seoAnalysis` takes the `yoastAnalysis` field (the SEO/Readability plugin) of the CMS record. In draft mode, the layout then shows `SeoAnalysisPanel` at the bottom right: the keywords of the record, and where the page uses them (title, meta description, h1, h2, first paragraph).
- `<main>` has `id="layout-content"`: the endpoint `/api/seo-analysis` reads the content of the page from this element. Do not remove it.
- `PageNav` (the menu at the bottom left) shows on every page, also in production. It is for reviewers, not part of the design.

## Components

```
src/components/MyComponent/
  Component.astro    # the Astro component
  style.module.css   # its CSS module
  index.ts           # barrel: exports the component (and its types, and its fragment)
```

- All imports use the barrel path: `import { MyComponent } from '~/components/MyComponent'`. Inside the directory, relative imports.
- Sections (a Hero, a Faq, a PageCloser…) get their static copy as a typed object from `src/data/`, and their CMS data from a fragment (see "CMS"). Building blocks (Button, Headline, Section, Typewriter, PixelVideo…) are used inside sections. Chrome (SiteHeader, FooterLinks, SiteSearch, PageNav) is in the layout.
- `Prose` styles long-form text: its CSS targets the elements of the HTML, inside `@scope (.prose) to (prose-island > *)`. A block with its own design wraps its markup in `<prose-island>`, and Prose does not style it.
- A section sets `data-theme="yellow|orange|green|purple|blue|pink"` (the docs layout sets `docs`); children inherit. Theme comes from the section, never from the component. Breakpoints are media queries, never props. State (hover, active, focus) is CSS/JS, never a prop.
- React only for the product scenes, rendered on the server (no `client:` directive).
- SVGs are inlined. Import the markup with the `?raw` suffix (`import key from '~/svg/illustrations/key.svg?raw'`). The docs have `Svg` (`src/components/docs/Svg`), which reads a file of `src/` by name and optimizes it with SVGO (`<Svg name="svg/logos/next-squared" />`).

## Styling

- Styles live in `.module.css` files next to their component (`style.module.css`) or page (`_style.module.css`). Class names are camelCase. `:global()` only to reach a child the component does not render.
- **Cascade layers**, lowest first: `reset, tokens, base, vendor, blocks, sections, pages`. `BaseLayout` puts this list as a statement in the first child of `<head>`. A rule in a higher layer wins over a lower layer, whatever the specificity and the order of the CSS. The Vite plugin `cssLayers` in `astro.config.ts` puts each CSS module of `src/` in its layer: a module under `src/pages/` is `pages`, every other module is `sections`, unless line 1 of the file is a marker such as `/* @layer blocks */`. The stylesheet of the scene kit is `vendor`.
- **The scope of the plugin** is in `css-scope.mjs`: all CSS of `src/`. A new component or page needs no change.
- **Rules of the cascade.**
  - Never repeat a class to win (`.content.content`). Never add an element or an ancestor to a selector to win. Never use `!important` outside `global.css`. If a rule does not win, the file is in the wrong layer, or the block needs an API.
  - A section or a page does not override a longhand of a block. It uses the API of the block: its props and its custom properties, such as `--section-padding-top` and `--section-content-max`.
  - `contentClass` of Section is for the layout of the content box. It never sets `max-width` or `margin-inline`. Use `width="headline"` or `width="reading"`.
  - Two rules in the same layer on the same element and property: give one of them more specificity on purpose, or put the base rule in `:where()`. Say why in a comment.
  - Run `npm run lint:css` (stylelint, on all CSS of `src/`). A disable comment needs a reason (`/* stylelint-disable-next-line rule -- reason */`).
- **Never hard-code a hex in a component.** Use the semantic theme tokens `--surface-*`, `--text-*`, `--border-*`. Primitives (`--color-*`) are only for `tokens.css`.
- **Two schemes, light and dark.** `data-color-scheme` on `<html>` gives the scheme: the inline script in the head of the layout sets it before the first paint, and `src/lib/colorScheme.ts` changes it. Use a token for its role, not for the colour it has in light (`DESIGN.md`, "Dark scheme"). Only when no token fits, a component sets a rule under `:global(:root[data-color-scheme='dark'])`, with a comment that says why. Check each change in both schemes.
- **Grounds and text roles.** `DESIGN.md`, "Colour: grounds and text roles", has the system. In a component:
  - The element that paints a ground (page, accent, inverse) gets the global class `surfacePage`, `surfaceAccent` or `surfaceInverse` (Section does it from its `background` prop), and sets `color` to a canonical role of that ground (`--text-on-page*`, `--text-on-accent*`, `--text-on-inverse*`) in the same rule as the background. A small shape that paints the accent or the inverse (a pill, a hovered row) does the same.
  - Inside a ground, use the contextual roles: `--text-primary`, `--text-soft`, `--text-muted`, `--text-headline-muted`, `--border-default`, `--border-strong`, `--text-accent`, `--text-positive`, `--text-negative`. They follow the ground, also across a `data-theme` switch.
  - No `opacity`, `color-mix()` or local `--text-*` property on text. The quiet text is `--text-muted`. The quiet run of a two-tone headline is `--text-headline-muted` (large text only; `HEADLINE_MUTED_FILES` in `src/lib/tokens/contract.ts` lists the files that may use it).
  - A button has no colour prop: `Button` takes only a `variant` (`solid`, `soft`, `accent`), and the ground fills the button roles.
  - `npm run lint:css` enforces this (`scripts/stylelint/text-roles.mjs`), and `npm test` computes every pairing (`src/styles/tokens.test.ts`).
- Content column max `--content-max` (1160px), side padding `--section-padding-x`, headline column `--section-padding-x-headlines`, vertical padding `--section-padding-y`. Centred statements cap at `--headline-max` (900px).
- Tokens for roles, all in `src/styles/tokens.css`:
  - `--text-accent`, `--text-positive`, `--text-negative`: accent-hued, confirmation and error text. They follow the ground: the ink on the bright accent, light tones on the deep accent band, pale signals on the inverse.
  - `--surface-status-info|positive|warning` with `--text-status-*`: callouts, pills and warnings.
  - `--surface-nav-active`, `--text-nav-active`: the entry of the page you read in a sidebar or a table of contents.
  - `--scrim`, `--scrim-modal`: the backdrop of a drawer and the backdrop of a modal. There are no shadow tokens: see the Flat rule in `DESIGN.md`.
  - `--type-2xs` to `--type-4xl`: the size ladder (`DESIGN.md`, Typography). The docs set `data-density="dense"` on `<body>`; `Facts` and the showcase aside set it on their own element. `--type-inline-code` is the size of inline code.
- Spacing: only `--space-*` tokens. Type: only `--type-*` sizes, through the typography classes (`.display`, `.headline`, `.title`, `.section`, `.body`, `.bodyMedium`, `.bodyLong`, `.label`, `.labelMedium`, `.caption`, `.code`, `.codeSmall`, `.codeInline`, `.monoCaps`, `.pictureLabel`, `.tabular`).
- Breakpoints (min-width): 768, 1152, 1320. The layout of the docs (`src/layouts/docs/BaseLayout`) has no more breakpoints: the sidebar (280px) is at the left edge from 1152, and the article (650px) and its table of contents (250px, from 1320) are in the centre of the main area. Two more exceptions: `SceneFrame` and `SceneFragment` switch from the phone drawing to the desktop drawing at 650, and `SiteHeader` shows the symbol instead of the wordmark below 360. Hover only inside `@media (hover: hover)`.

### Design source

Figma file `WnWBSVVcroe5s4tXQGnhSA` (overnice's original), page **Components** (`455:11066`). For the Figma MCP, use overnice's shared copy `2nEQ2LGxRaWjxWzjuVoXBV` (same node IDs). The pages at every breakpoint are on **Designed Pages Responsive** (`699:21450`).

### Fonts

- `--font-sans` is ABC Oracle (400 and 500 only), `--font-mono` is Geist Mono. The weights and the roles are in `DESIGN.md`, Typography.
- The files come from this site: `/fonts/<file>` (`src/pages/fonts/[file].ts`), a proxy to `UI_FONTS_BASE_URL`. The layout preloads ABC Oracle. In local dev, set `UI_FONTS_BASE_URL` (see `cubo.json5`), else the fonts give 404.
- Never put a copy of a font file in this repository: the licence does not allow it.

### Motion

- Use the shared helpers in `src/lib/motion/`. CSS before JS.
- `prefers-reduced-motion` shows the final state; animations play in view only and pause off-screen; no layout shift; the final state is in the DOM without JS.
- No Lottie; no video for anything that CSS can do. The pixel videos are `.pxv` files played by `src/lib/pixel-video/` (see "Pixel videos").

## Text faces

The rules of a face on a page are in `DESIGN.md`, "The Text Face Rule".

- `src/lib/motion/faces.ts` has every face, with its animation. The copy in `src/data/` gives the name of a face (`face: 'happy'`), never its glyphs. No component writes the glyphs: a typewriter script plays `faceStep('happy')`, and the `Face` component plays a face everywhere else.
- Each animation has the rhythm of the home hero: the face comes in one sign at a time with its eyes closed, opens its eyes and rests, does one thing (a wink, a laugh, a yawn), then settles on its final face.
- A new face goes in `faces.ts`, not in a component. Look at it in `/dev/face-gallery` before you give it to a page. The gallery marks the glyphs that ABC Oracle does not have (`ᴗ`, `◡`, `﹏`, `✓`, `ᴥ`): the browser takes them from a system font, and they look different on each system.

## Pixel videos

Read `src/lib/pixel-video/AGENTS.md` (the process and the rules) and `scripts/pixel-videos/README.md` (the commands) before you add or change a `.pxv` file. The files are in `public/videos/`, and `/dev/pxv-gallery` shows them all.

## Blog covers

Read `src/components/PixelCover/AGENTS.md` (the rules and the process) and `scripts/blog-covers/README.md` (the commands) before you add or change a blog cover. The files are in `src/assets/blog-covers/`, the theme of each post is in `src/data/blogCoverThemes.ts`, and `/dev/cover-gallery` shows them all.

## Chat covers

A casual chat has no file for its cover. `ChatCover` (`src/components/ChatCover/`) draws it from the guests of the chat: the split of the theme, and for each guest a flat speech bubble in the paper of the theme, with the portrait of the CMS in it. The portrait is a continuous photograph in black and white: never cells, never a stencil. The shapes are in `layout.ts`, in cells of the grid of the blog covers (100 × 58). One guest has one bubble on the seam, two guests have one bubble on each half, three guests have three small bubbles.

- The featured card of a chat shows the cover as a still. The header of the page of a chat sets `animated`: the bubble arrives in steps from the point of its tail, and a small reply bubble with three dots shows for a moment, and again when the pointer is on the cover. The motion is CSS only, and reduced motion shows the still.
- The theme of each chat is in `src/data/chatCoverThemes.ts`: add the slug of a new chat at the top of the list.

## Dev tools

- The galleries (`/dev/face-gallery`, `/dev/pxv-gallery`, `/dev/cover-gallery`, `/dev/button-gallery`) are in `src/dev/`, not in `src/pages/`: the integration `dev-tools` in `astro.config.ts` adds their routes, in `astro dev` and in the build. Thus the production site shows them, but the sitemap and `PageNav` do not list them.
- Put a new tool for the developers in `src/dev/`, and add its route in `dev-tools`. The tools use the layout, the tokens and the player of the site, thus the preview is the same as the page.
- A page of `src/dev/` can have a plain client script (not a `WebComponent`). It must not import a dev dependency: the build has the routes, and the runtime image installs no dev dependencies.

## CMS

- The queries use the query runner of this site: `executeQuery(Astro, query, options?)` from `~/lib/datocms/executeQuery` (draft mode, surrogate keys, content link).
- A component that shows CMS data gets its data from a fragment. It declares the fragment in `graphql.ts` (`MyComponentFragment`, fields only), and the barrel exports both. Its props are the fragment types (`FragmentOf<typeof MyComponentFragment>`), and it reads them with `readFragment` (both from `~/lib/datocms/graphql`). The page query spreads the fragment, and the page passes the result to the component directly. Do not convert a CMS result into the types of `src/data/` in the page.
- A prop that takes records of two types: the query selects `__typename` next to the fragment of each type, and the component reads the fragment of that type (see `Testimonials`). Do not use a fragment on `RecordInterface` with `... on XRecord`: the CDA refuses it when no other field of the query returns `XRecord`.
- A Structured Text field renders with `~/components/StructuredText`: `StructuredText` (the full rendering), `InlineParagraphs` (in a `<p>` or a `<span>`: no `<p>`, two line breaks between the paragraphs) or `PlainText` (only the text, for a quote or a title). In draft mode these keep the stega of Content Link, thus Content Link works. Make a string from a field only when the target needs a string (JSON-LD, a search attribute), and write the reason in a comment. Remove the stega with `stripStega` when the string is not visible text. When you trim visible text, keep the stega at the end.
- Queries go in `_graphql.ts` files at the page level. A route with parameters must have one (the `routes` integration in `astro.config.ts` expects it).
- A CMS logo (a black SVG) goes in a `LogoItem` with `mask` (the URL) instead of `src`: `Logo` shows it as a CSS mask in the colour of the text, thus it is correct on each theme.
- Fragments on `ResponsiveImage` do not specify `imgixParams`: callers pass them at query time. Omit `auto: format` (the default of the project).
- The types of the data files (`HeroData`, `FeaturesData`…) are the first draft of the future modular-content models. Structured content (navigation, changelog, case studies, reviews, customers, partners) comes from the existing models of the project.

## Gotchas

- After a new tarball of the scene kit in `vendor/`, run `npm install` and restart `astro dev`.
- Write every code comment in Simplified Technical English (short sentences, one idea each, the imperative for instructions).
