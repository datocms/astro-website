# The site: rules for the code

Two more files hold rules for their directory:

- `src/data/AGENTS.md`: the copy, the pages, the pillars and the chapters.
- `src/scenes/AGENTS.md`: the pictures of the product (scenes, frames, fragments, diagrams, photos).

Read `TONE_OF_VOICE.md` (repository root) before you write or change any text that a visitor sees.

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
  dev/                      the tools of the developers, only in `astro dev` (see "Pixel videos")
vendor/                     the tarball of the scene kit (@datocms/product-scenes)
public/videos/              the .pxv files
scripts/pixel-videos/       the source videos of the .pxv files, drawn in code
css-scope.mjs               which CSS gets a cascade layer, and which CSS lint:css reads
```

## The layout

`src/layouts/Layout.astro` is on top of `BaseLayout` (the head of the site: SEO, favicon, canonical URL, RSS links, cookie consent, analytics, draft-mode content link).

- The prop `seo` is required. Use the `seo` / `_seoMetaTags` of the CMS record of the page when it exists. Else build the tags: `overrideSeo([], seoTitle(title), seoDescription(text))` from `~/lib/datocms/seo`.
- The other props: `theme`, `headerVariant`, `headerCta`, `footer`.
- `theme` is the theme of the page: the hue of its area (a reference page) or of its first chapter (a marketing page). The table of all the pages is in DESIGN.md, "Page themes". On a marketing page, read the theme from the data of the first chapter (`theme={dev.schema.theme}`), not from a literal. The header, the `PageCloser` and the footer have no theme prop: they take the theme of the page.
- `headerVariant` is the ground of the hero, and the `variant` of the `Hero` is the same value: `page` on a marketing page, `accent` on a reference page.
- A page does a full load: no `ClientRouter`, no progress bar. Only the docs layout turns the router on.
- The optional prop `seoAnalysis` takes the `yoastAnalysis` field (the SEO/Readability plugin) of the CMS record. In draft mode, the layout then shows `SeoAnalysisPanel` at the bottom right: the keywords of the record, and where the page uses them (title, meta description, h1, h2, first paragraph).
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
- Sections (a Hero, a Faq, a PageCloser…) get their static copy as a typed object from `src/data/`, and their CMS data from a fragment (see "CMS"). Building blocks (Button, Headline, Section, Typewriter, PixelVideo…) are used inside sections. Chrome (SiteHeader, FooterLinks, SiteSearch, PageNav) is in the layout.
- `Prose` styles long-form text: its CSS targets the elements of the HTML, inside `@scope (.prose) to (prose-island > *)`. A block with its own design wraps its markup in `<prose-island>`, and Prose does not style it.
- A section sets `data-theme="default|orange|green|purple|blue|pink"`; children inherit. Theme comes from the section, never from the component. Breakpoints are media queries, never props. State (hover, active, focus) is CSS/JS, never a prop.
- React only for the product scenes, rendered on the server (no `client:` directive).

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
- **Two schemes, light and dark.** `data-scheme` on `<html>` gives the scheme: the inline script in the head of the layout sets it before the first paint, and `src/lib/colorScheme.ts` changes it. In the dark scheme only the page flips: the inverse surface and the bright accent do not change. Use a token for its role, not for the colour it has in light. Only when no token fits, a component sets a rule under `:global(:root[data-scheme='dark'])`, with a comment that says why. Check each change in both schemes.
- **Grounds and text roles** (the rules are in the header of `src/styles/tokens.css` and in `DESIGN.md`, "Colour: grounds and text roles"). Three grounds: page, accent, inverse. The element that paints a ground gets its global class, `surfacePage`, `surfaceAccent` or `surfaceInverse` (Section does it from its `background` prop), and sets `color` to a canonical role of the ground in the same rule as the background: `--text-on-page*`, `--text-on-accent*`, `--text-on-inverse*`. Inside, a component uses the contextual roles `--text-primary`, `--text-soft`, `--text-muted`, `--text-headline-muted`, `--border-default`, `--border-strong`, `--text-accent`, `--text-positive`, `--text-negative`: they follow the ground, also across a `data-theme` switch. A small shape that paints the accent or the inverse (a button, a pill, a hovered row) sets `color` to a canonical role in the same rule. No `opacity`, `color-mix()` or local `--text-*` property on text: the quiet text is `--text-muted`, the quiet run of a two-tone headline or display lockup is `--text-headline-muted` (3:1, large text only; `HEADLINE_MUTED_FILES` in `src/lib/tokens/contract.ts` lists the files that may use it). `npm run lint:css` enforces this (`scripts/stylelint/text-roles.mjs`), `npm test` computes every pairing (`src/styles/tokens.test.ts`).
- Content column max `--content-max` (1160px), side padding `--section-padding-x`, headline column `--section-padding-x-headlines`, vertical padding `--section-padding-y`. Centred statements cap at `--headline-max` (900px).
- Tokens for roles, all in `src/styles/tokens.css`:
  - `--text-accent`, `--text-positive`, `--text-negative`: accent-hued, confirmation and error text. They follow the ground: the ink on the accent, pale signals on the inverse.
  - `--surface-status-info|positive|warning` with `--text-status-*`: callouts, pills and warnings.
  - `--surface-nav-active`, `--text-nav-active`: the entry of the page you read in a sidebar or a table of contents.
  - `--surface-field`, `--border-field`: a form field.
  - `--shadow-popover`, `--shadow-card`, `--scrim`, `--scrim-modal`: elevation, the backdrop of a drawer, and the backdrop of a modal.
  - `--type-docs-body`, `--type-docs-small`, `--type-docs-label`, `--type-docs-h2`, `--type-docs-h3`: the type of dense reference content. Only the docs use them. The marketing pages use `--type-body` and the typography classes.
- Spacing: only `--space-*` tokens. Type: only `--type-*` sizes, through the typography classes (`.display`, `.h1`, `.h2`, `.body`, `.bodyMedium`, `.bodyLong`, `.subtitle`, `.subtitleMedium`, `.caption`, `.code`, `.codeSmall`).
- Breakpoints (min-width): 768, 1152, 1320. The layout of the docs (`src/layouts/docs/BaseLayout`) has two more, 1500 and 1600: above 1500 the content is 1110px wide and the sidebar 300px, above 1600 the content is 1210px wide (`stylelint.config.mjs` allows them for that file only). One more exception: `SceneFrame` and `SceneFragment` switch from the phone drawing to the desktop drawing at 650. Hover only inside `@media (hover: hover)`.

### Design source

Figma file `WnWBSVVcroe5s4tXQGnhSA` (overnice's original), page **Components** (`455:11066`). For the Figma MCP, use overnice's shared copy `2nEQ2LGxRaWjxWzjuVoXBV` (same node IDs). The pages at every breakpoint are on **Designed Pages Responsive** (`699:21450`).

### Fonts

- `--font-sans`: ABC Oracle, variable. CSS 400 = Regular, 500 = Medium; use only these two.
- `--font-mono`: Geist Mono 500, for code. The product scenes use it.
- The files come from this site: `/fonts/<file>` (`src/pages/fonts/[file].ts`), a proxy to `UI_FONTS_BASE_URL`. The layout preloads ABC Oracle. In local dev, set `UI_FONTS_BASE_URL` (see `cubo.json5`), else the fonts give 404.
- Never put a copy of a font file in this repository: the licence does not allow it.

### Motion

- Use the shared helpers in `src/lib/motion/`. CSS before JS.
- `prefers-reduced-motion` shows the final state; animations play in view only and pause off-screen; no layout shift; the final state is in the DOM without JS.
- No Lottie; no video for anything that CSS can do. The pixel videos are `.pxv` files played by `src/lib/pixel-video/` (see "Pixel videos").

## Text faces

- **`src/lib/motion/faces.ts` has every face, with its animation.** The copy in `src/data/` gives the name of a face (`face: 'happy'`), never its glyphs: the name gives the final glyphs (`faces.happy.face`) and the typewriter step (`faceStep('happy')`). Each animation has the rhythm of the home hero: the face comes in one sign at a time with its eyes closed, opens its eyes and rests, does one thing (a wink, a laugh, a yawn), then settles on its final face. The last frame is the final face: the typewriter then shows the glyphs of the copy.
- **`/dev/face-gallery` plays every face in a loop**, with its frames and times, and marks the glyphs that ABC Oracle does not have (`ᴗ`, `◡`, `﹏`, `✓`, `ᴥ`): the browser takes them from a system font, and they look different on each system. The glyphs of the font that make a face are at the end of the gallery. The gallery is only in `astro dev`, as the pxv gallery.
- **A new face goes in `faces.ts`, not in a component.** Then look at it in the gallery before you give it to a page.

## Pixel videos

- **The scripts of `scripts/pixel-videos/` make a `.pxv` file**: `key.py` (green screen footage) or `lottie.py` (a Lottie animation) make a transparent video, and `encode.ts` makes the file with `format.ts`, the same module as the player. Save the file in `public/videos/`. `/dev/pxv-gallery` shows all the files.
- **The gallery is only in `astro dev`.** The page is not in `src/pages/`: the integration `dev-tools` in `astro.config.ts` adds its route when the command is `dev`. Thus the build does not have it, and the production site does not show it. Put a new tool for the developers in `src/dev/`, and add its route in `dev-tools`. Why: the tools use the layout, the tokens and the player of the site, thus the preview is the same as the page, and there is one copy of `format.ts` for the encoder and the player.
- **The pages in `src/dev/` are not pages of the site.** They can have a plain client script (not a `WebComponent`), and they can use the dev dependencies.
- **The `.pxv` file is the only copy.** No recipe makes it again: the footage and the keyed videos stay in `tmp/` (Git ignores it), and the file records the URL of its footage (`source`). Read `src/lib/pixel-video/AGENTS.md` and `scripts/pixel-videos/README.md` before you add one.

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

- `astro build` and `astro check` while `astro dev` runs break the dependency cache of the dev server: stop `astro dev` first.
- After a new tarball of the scene kit in `vendor/`, run `npm install` and restart `astro dev`.
- Write every code comment in Simplified Technical English (short sentences, one idea each, the imperative for instructions).
