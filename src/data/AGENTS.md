# AGENTS.md: the copy and the pages

The copy of every page lives here, one typed file for each route. The general conventions are in the root `AGENTS.md`; the pictures are in `src/scenes/AGENTS.md`. All copy follows the Dato voice in `TONE_OF_VOICE.md`: read it before you write or change any text that a visitor sees. The page queue, with the status of each page, is in `INVENTORY.md`.

## Data files

- One file for each route: `/features/visual-editing` → `src/data/visual-editing.ts`. The exported types are named after the future CMS fragments (`HeroData`, `FeaturesData`, `ChapterLayoutData`…). A page file (`src/pages/<route>/index.astro`) only imports the layout, the sections and the data: no copy inline.
- Shared files: `videos.ts` (the pixel videos of PageCloser), `navigation.ts` (header and footer), `search.ts` (the search popup), `features.ts` (the feature list of `/features`), `*-code.ts` (the code of the "Code:" pictures of a pillar).
- A pillar page has one file for the hero, the opinion and the closer, and the chapters in it (`developers-pillar.ts`, `media.ts`, `ai-pillar.ts`) or one file for each chapter (`/editor-experience`: `structured-content.ts`, `visual-editing-chapter.ts`, `dynamic-layouts.ts`, `localization.ts`, `workflows.ts`, `collaboration.ts`, `seo.ts`). The pages built from Figma that a pillar replaced keep their data (`developers.ts`, `ai.ts`, `editor-experience-figma.ts`, `visual-editing.ts`) for the dev pages.
- Before you use a section, read its data type and one page that uses it. Know what each field shows on screen; do not use a field for something else than its purpose.
- Buttons link to a route of the new site, or of the old site. When the target does not exist yet, `/todo`. The navigation links to `#` when the page is not on this site yet.
- Do not invent facts: customer names, numbers, quotes, prices, feature claims, integrations. Take them from the live site, the docs or the feature list, or ask.

## Markers

- `(check)` in a comment: a fact nobody verified yet. The numbers of the old pages (74 edges, 650TB, 6B requests, 99.99%, 40ms, 25K+ teams, 400+ locales, 50% smaller images, "2 hours" for cache tags, "5 minutes" for a plugin) are all unverified: none goes in the copy without a check.
- `[TODO: …]` in the copy: a fact that is missing, visible on the page.
- `// New copy.` on the line before: copy that we rewrote, where it replaces copy from the live site.
- `Placeholder` (`~/components/Placeholder`): a section that does not exist yet, with `name`, `intent` (one sentence: what it must do for the reader), `visual` (the image or animation it needs, described) and `fields` with the real copy. Example: `/enterprise`.
- `Added` (`~/components/Added`): a section that Ronak added to the design, for review. Facts in it carry `(check)`.

## Page classes

Every route of the old site (https://www.datocms.com; the code is in `../public/astro-website/src/pages/` when it is on this machine) is one of:

- **marketing**: needs copy and structure. Ronak's queue in `INVENTORY.md`.
- **templated**: the copy is CMS content (blog, docs, marketplace, academy, glossary, partner pages…). What they need is a template, in the design phase.
- **utility**: legal, thank-you pages, 404. Ported as they are.

Why: copywriting time goes where words are decided by hand; a template is a design task.

## The pillars

Few pillar pages instead of the seventeen flat feature pages of the old site. A pillar tells one story for one audience in five to eight chapters. There is no page per feature: every old feature URL redirects to its chapter anchor (`astro.config.mjs`). Why: seventeen flat pages make seventeen thin arguments; five stories can be told well, and the thin features (the CDN, data integrity) stop pretending to be pages.

| Pillar                | Route                | Label             | Chapters                                                                                                                     |
| --------------------- | -------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Editing               | `/editor-experience` | Editor experience | Structured content, Visual editing, Dynamic layouts, Localization, Workflows, Collaboration and versions, SEO                |
| Modeling and delivery | `/developers`        | For developers    | Schema builder, GraphQL, Real-time, Delivery (cache tags), Environments, Automation (Management API and webhooks), Plugins   |
| Media                 | `/media`             | Media             | Media library, Asset fields, Images, Video, In your frontend                                                                 |
| AI                    | `/ai`                | AI                | Ask your project (MCP, with the docs for machines as a fragment), Build with an agent (skills), Translate, Tags and captions |

- **Media is a pillar**, not a chapter group of Modeling and delivery: three more chapters would take that page past eight, and media has two audiences at once (editors in the library, developers in the APIs). Asset fields and In your frontend are its thin chapters; if one folds, Media runs at four, which we accept rather than inventing a fifth.
- **Trust is not a pillar.** Roles and permissions, SSO, SCIM, audit logs, custom domains, encryption, backups are chapters of `/enterprise` (and `/security`), written once there. Validations are a fragment of Schema builder, environments a chapter of Developers, workflows a chapter of Editing.
- **No marketers pillar.** The claims of the old `/made-for/marketers` are chapters of Editing, Media and Developers.
- `developer-experience` and `worldwide-cdn` folded into the Developers pillar; `data-integrity` split between Schema builder, Environments, Workflows and Trust. The dark mode page is out of scope: an entry in the index.
- **The index** (`/features`) is the list and nothing else: the hero, the category nav with its score, the nine groups, the open slot of the next feature as the last card, the face at the edge with a line at each quarter, the closer. No highlights or pillar teasers (the pillars already pick the highlights; a reel here is a second home page), no banner, no prize at the end (a prize and a superlative are both against the voice). The page is long because the product is, and the visitor is invited into the list rather than rewarded for it. One feature list (`features.ts`) feeds the index and, later, the pricing table.

## The chapter

The unit of a pillar page. Three parts, always the same: a visitor who read one chapter knows how to read the next, and eight chapters still make one page.

| Part             | What it holds                                                                            | Section            |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------ |
| Header           | Label (the name of the feature), two-tone headline, intro, a docs link                   | `ChapterHeader`    |
| The thing itself | The feature at rest, full width                                                          | `SceneFrame`       |
| Sub-features     | None, two or four facets, two per row, each with a small picture, a title and a sentence | `FeatureFragments` |

What a chapter does not have: a text-and-image section, a statement, a how-it-works grid, a quote. Everything it wants to say fits in the intro, the fragment sentences and the pictures, or it goes to the docs. Why: the first exemplar had all of those and read as a page for one feature; with eight of them a pillar would be forty screens.

**Budgets.** A budget leaves no room for the second adjective and the third joke.

| Element           | Budget                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Chapter headline  | 6 words, two-tone allowed                                                                   |
| Chapter intro     | 25 words, one or two sentences: one mechanism and one honest limit                          |
| Fragment title    | 6 words                                                                                     |
| Fragment sentence | 25 words, one idea; it may overlap the intro                                                |
| Fragments         | 0, 2 or 4; each picture adds a nuance or a point of view to the frame, or the fragment goes |
| Opinion           | 3 sentences, one `Statement` per pillar page at most, between two chapters                  |
| Jokes             | 1 per page, and it must be something a customer could have said                             |

**A pillar page**: a `Hero` (label, two-tone headline, intro, two buttons, no picture: the first chapter brings it), the `CategoryNav` of the chapters, five to eight chapters that alternate theme, one opinion, the closer (a `Quote` where a customer said something about it, then `PageCloser` with its pixel video).

## Voice on the page

Each attribute of the voice guide decides a part of the page.

- **Understatement: the headline is a plain truth, not a promise.** Not an imperative. The Boring × Brilliant pairs of the guide are the two-tone headline: the boring part muted, the brilliant part in ink, or the reverse. A limit, when true, is the best muted half ("Structured Text is not a page builder. _That is what Modular Content is for._").
- **Generous: the detail is on the page, not behind a click.** The intro says how it works and where it stops; the docs link carries the rest.
- **Independent: the pillar carries one opinion**, in the voice of someone who has done this before. One per page is a conviction; one per chapter is a sermon.
- **Thoughtful: both sides of the same thing.** The fragments mix the editor's view and the developer's view of the same content, with the same words, as the feature needs. A GraphQL chapter may be all code, an editor chapter all product.
- **Effortless: the product at rest, in daylight.** Boring states, shown with confidence.

What goes: SEO kickers above the headline (the label stays, as the name of the feature), bold inside body text, exclamation marks, the third person, the banned words of the guide, the shared cross-link block of the old pages, the jokes of the 2025 pages beyond one per page.

## Who owns a subject

A subject is explained in one chapter. Another chapter may show it in one picture or one clause, with a link, and does not explain it again.

| Subject               | Owner                      | Who else mentions it, and how far                                                                |
| --------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| Localization          | Editing, Localization      | AI, Translate (the plugin, links back); GraphQL does not repeat the locale query                 |
| Roles and permissions | Trust (`/enterprise`)      | Editing (translators, writers) and Developers (a token's role): one picture each, no explanation |
| Environments          | Developers, Environments   | Schema builder intro, one clause                                                                 |
| Previews              | Editing, Visual editing    | Developers, Real-time: the mechanism, links to Editing                                           |
| Media library         | Media, Media library       | AI, Tags and captions shows the suggested tags only                                              |
| Webhooks              | Developers, Automation     | Developers, Delivery shows only the cache-tags webhook                                           |
| CDN                   | Developers, GraphQL        | Media hero and Images intro: "from the edge", one clause each                                    |
| Plugins               | Developers, Plugins        | AI, Translate says "plugin" in one clause; Media library shows one upload source a plugin adds   |
| CLI                   | Developers, Environments   | AI, Build with an agent, as the thing skills run                                                 |
| Validations           | Developers, Schema builder | Media, Asset fields, for assets only                                                             |
| MCP                   | AI, Ask your project       | Developers, Automation may add "or let an assistant do it", with a link                          |

## Navigation

Six items in the header: Product, Resources, Customers, Partners, Philosophy, Pricing. The Product menu lists the four pillars, each with its chapters as one muted line, the index, Enterprise and the compare pages. Every link goes to a page: no list of case studies, continents or docs sections in a menu, and no page under two names. The footer is five columns of pages. The second level of navigation is the chapter nav on each pillar page. Why: a menu is a map of pages, and a chapter anchor is a place inside a page; the old lists of features existed to link one URL per feature for search engines. "Developers" became "Resources" because the word now belongs to `/developers`. The CMS navigation model will follow this shape: a few groups of plain links, nothing fetched from lists.

## Ronak's pages

Pages that Ronak added on the design, marked with `Added`, for review: `/enterprise` (the trust story: security, governance, support, scale, FAQ; every picture is still a described box). Every addition to a pillar is a chapter (header, frame, fragments, an item in the chapter nav), never loose fragments under someone else's chapter.
