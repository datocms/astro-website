# ronak-launch.md

> **A plan. Nothing in it is built yet.** This is what the `redesign` branch needs before it replaces datocms.com: SEO, AEO, agents, redirects, links, share images, picture fallbacks, security and the tests that keep all of it true. `AGENTS.md`, `src/REDESIGN.md` and `DESIGN.md` decide the structure, the design and the process. Where this file and those disagree, Stefano's call wins and I raise it with him. Agents follow this file only when I name it in a session.

Last updated 2026-11-04. The state below comes from the live sitemap and a crawl of the redesign branch on that date.

## How I work

- I work on `redesign` with Stefano. Commits follow the repo's style: a plain sentence, often `Area: what changed`. No `feat:` prefixes, no AI co-author or session trailers.
- Any deviation from Figma or from Stefano's plan gets checked with me first.
- When I ask for creative input, I want options with a recommendation, not a finished decision.
- The code I add has no comments. Stefano's comments stay. Name things well instead.
- Each item below becomes its own commit with its test in the same commit. A rule without a test is a wish.

## Launch status (2026-11-04)

Already in place on `redesign`:

- [x] `<html lang="en">` and a canonical tag on every page.
- [x] `llms.txt`, `llms-full.txt`, `llms-extras-full.txt`.
- [x] Markdown twins (`/pricing.md`), `Accept: text/markdown` negotiation, `Vary: Accept` on HTML.
- [x] `Link` header with `rel="sitemap"` and `rel="api-catalog"`.
- [x] `.well-known`: `api-catalog` (RFC 9727 profile and `Link` on the response), `mcp.json`, `agent-skills/index.json`, `auth.md`, `security.txt`, `DatoCMS_security_pub.asc`.
- [x] `robots.txt` with `Content-Signal: search=yes, ai-input=yes, ai-train=yes`; `Disallow: /` outside production and in draft mode.
- [x] `sitemap.xml` built from the page files and the `_graphql.ts` of each route, so a new page is listed and a redirected one is not.
- [x] A generated share card (`/og-card/index.png`, satori), used by the blog, partners, tech partners and the docs.
- [x] The Hero Length Rule and the face rules, tested (`src/lib/hero.test.ts`).

Open, found on 2026-11-04 (52 pages crawled):

- [ ] The scene kit draws its toolbar titles as `<h1 class="Toolbar__title">`. `/editor-experience` has 14 h1s, `/media` 9, `/` 7, `/developers` and every `/cms/*` page 4, `/ai` 3. Fix it in the vendor tarball (`@datocms/product-scenes`): the mock toolbars become `div` or `p`.
- [ ] 14 pages have no meta description: all of `/legal/*`, `/security`, `/support`, `/slack`, `/starters`, `/partner-program`, `/company/profit-sharing` and the thanks pages.
- [ ] 15 descriptions are outside 70 to 160 characters. Too long: `/ai` 192, `/developers` 182, `/blog` 176, `/editor-experience` 164, `/cms/svelte-cms` 164. Too short: `/pricing` 56, `/product-updates` 59, `/compare/datocms-vs-storyblok` 51, the three academy courses 60, and more.
- [ ] `/plugins` and `/plugins/browse` share a title and a description. Two more descriptions repeat across pages.
- [ ] 26 pages have no `og:image` and no `twitter:card`, among them every pillar page and every `/cms/*` page.
- [ ] 37 pages have no JSON-LD, among them every pillar page, `/blog`, `/partners`, `/docs` and `/cms/*`. The academy courses have two scripts each.
- [ ] Every title ends in ` — DatoCMS` (`pageTitleSuffix` in `src/lib/datocms/seo.ts`). The academy and the casual chats end in `— DatoCMS Academy` and `— DatoCMS Blog`. See Writing: decide the separator with Stefano.
- [ ] The 404 has no `noindex`. Staging has no `X-Robots-Tag` (robots.txt alone).
- [ ] `site` is not set in `astro.config.ts`. Canonicals come from `baseUrl(request)`.
- [ ] 35 images on `/partners/showcase` and 4 on `/starters` have no `alt`.
- [ ] Links to `dashboard.datocms.com`, `community.datocms.com`, `status.datocms.com` and GitHub open in the same tab and have no `noopener`, on every page.
- [ ] The `Link` header has no `rel="describedby"` to `llms.txt` and no `rel="alternate"; type="text/markdown"` to the twin.
- [ ] `security.txt` has no `Expires` (RFC 9116 requires it).
- [ ] The redirects in the next section.

## Redirects to handle

Every URL that datocms.com serves today, from the live sitemap and from the routes of `main`, either loads on `redesign`, or redirects in one hop to a page that loads and says the same thing. A redirect to the home page is a soft 404 to Google: use it only when nothing closer exists, and say why next to it.

### Missing: these give a 404 today

| Live URL                                      | Proposed target                         | Why                                                                                                                                                                 |
| --------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/company/brand-assets`                       | a brand assets page, or `/philosophy`   | The page file is gone. Press and partners link to it. Rebuild it or point at the nearest page. Decide with Stefano.                                                 |
| `/marketplace/recipes`                        | `/starters`                             | The recipes section is gone.                                                                                                                                        |
| `/marketplace/recipes/blog-post`              | `/starters`, or the matching docs page  | One rule per recipe, so each lands on the nearest content.                                                                                                          |
| `/marketplace/recipes/case-study`             | same                                    |                                                                                                                                                                     |
| `/marketplace/recipes/global-settings`        | same                                    |                                                                                                                                                                     |
| `/marketplace/recipes/marketing-exit-intent`  | same                                    |                                                                                                                                                                     |
| `/marketplace/recipes/marketing-landing-page` | same                                    |                                                                                                                                                                     |
| `/marketplace/recipes/newsletter-signup`      | same                                    |                                                                                                                                                                     |
| `/casual-chats/p/2`                           | `/blog/casual-chats/p/2` (fix the page) | The redirect exists, but redesign has no page 2: its pagination has fewer pages than the live one. Every live page number must exist, or redirect to the last page. |

### Redirects to the home page: find a closer target

| Live URL                                                                           | Today | Proposed                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/use-cases` and its 5 pages                                                       | `/`   | The pillar or case study closest to each: knowledge management and digital publishing to `/editor-experience`, ecommerce and modern websites to `/case-studies` or a filtered view, travel to its case study. |
| `/use-cases/headless-cms-*` (5 older aliases)                                      | `/`   | The same targets as the page they alias.                                                                                                                                                                      |
| `/cms/gatsby-cms`, `/cms/gatsbyjs*`, `/cms/hugo*`, `/cms/jekyll`, `/cms/middleman` | `/`   | `/docs` or the framework section of `/developers`.                                                                                                                                                            |
| `/lp/migcs`                                                                        | `/`   | The migration page or `/docs/import-and-export`.                                                                                                                                                              |
| `/marketplace/plugins/i/datocms-plugin-gatsby-cloud`                               | `/`   | `/plugins`.                                                                                                                                                                                                   |

### Redirects that land on an anchor

The feature pages, `/cda-explorer` and `/features/dark-mode` land on anchors such as `/developers#graphql` and `/features#editor-experience`. Each anchor must exist on its page. A test checks it (see Tests).

### Changes since `main`

- 29 targets changed. They follow the new routes (`/marketplace/*` to `/plugins` and `/starters`, `/casual-chats` to `/blog/casual-chats`, the feature pages to the pillars).
- `/plugins/i/*` is now the real route, so its three old alias redirects are gone.
- `/made-for/*`, `/team/*` and `/how-to-datocms` redirect to the pillar pages and `/academy`.
- `/product` and `/customers` redirect to `/features` and `/case-studies`.

### Rules for every redirect

- One hop. A target is never the source of another redirect.
- 301, with the query string kept.
- The target gives 200, also in production data.
- A redirect never points at a URL that `robots.txt` blocks.
- Every URL of the live sitemap of launch day is in a frozen list in the repo (`tests/fixtures/live-urls.txt`). The test runs over all of it, so no old URL is lost by accident after launch.

## Spacing, layout and motion

`src/REDESIGN.md` and `DESIGN.md` hold these rules. My additions:

- Every section works at 390, 768, 1152, 1320 and 1920: no sideways scroll, no clipped text, tap targets that fit a thumb.
- Heroes get more air than a regular section: above the headline, and between the headline, the intro and the buttons.
- The homepage hero fits above the fold on a 13 to 15 inch laptop (1280 to 1512 wide, 720 to 860 tall) and ends on the logo reel.
- A layout keeps its shape while it loads: images have their size, fonts don't push text, nothing moves because something else changed size.
- Animations use transform and opacity only, 300 to 600 ms with an ease-out, no bounce. Endless loops are one CSS keyframe on a duplicated track and pause off-screen and on hover or focus.

## Writing

- The voice is `TONE_OF_VOICE.md`. My rules on top:
  - No em dashes in copy. The title separator is a decision for Stefano: today every title ends in ` — DatoCMS`, and I want `Name | DatoCMS`.
  - No "not X, but Y", no framing sentences, no filler intensifiers, no rising triads, no summing-up closers.
  - One short paired line ("Publish once. Every channel.") per page at most, and only when it says something concrete.
- No number nobody checked. An unverified number is `[TODO: verify]`, and a test fails on it in production.
- Copy is a draft until I confirm it.

## SEO

Every page that ships:

- A unique title, page words first and brand last.
- A unique meta description of 70 to 160 characters. `seoDescription` truncates at 200 today: it truncates at 160.
- A canonical URL built from `site` (`https://www.datocms.com`), not from the request. Set `site` in `astro.config.ts`.
- `og:*` and `twitter:*` tags (`summary_large_image`) with a sized share image (see Share images).
- `<html lang="en">`, one `h1`, headings in order with no skipped levels, `alt` on every image.
- The 404 and every `notFoundResponse()` carry `noindex`.
- Staging stays `noindex, nofollow`, in `robots.txt` and in an `X-Robots-Tag` header. The SEO layer is complete on staging anyway, because it ships to production.
- `sitemap.xml` lists every crawlable page and nothing that `robots.txt` blocks.
- `<lastmod>` only where something keeps the date: a post, a product update, a case study, the changelog index. A page that changes on every deploy gets no date. A date nobody keeps teaches Google to ignore the file.

## JSON-LD

- One `<script type="application/ld+json">` per page, with one `@graph`. Never several scripts. The `JsonLd` component and `src/lib/jsonLd.ts` grow into this: the layout owns the script, and a page adds nodes to it.
- Typed builders (`schema-dts`), not hand-written objects in pages.
- Stable `@id`s: `/#organization`, `/#website`, `<url>#webpage`, `<url>#article`. Nodes reference each other by `@id`.
- On every page: `Organization` (logo, `sameAs`, a support `contactPoint`), `WebSite`, `WebPage`.
- `BreadcrumbList` on every page but home. The Breadcrumb band already builds one: the pages without the band get theirs from the path.
- `FAQPage` only where the questions are on the page, word for word.
- `SoftwareApplication` with true offers on pricing and the pillars, `ItemList` for indexes, `BlogPosting` for posts, `Article` for case studies, `TechArticle` for docs, `Course` for the academy, `VideoObject` for the user guides.
- Every picture with a PNG fallback (see Picture fallbacks) is an `ImageObject` on its page, with its caption.

## Share images

The repo already has a share card: `/og-card/index.png` (satori and sharp, `src/pages/og-card/`), with the theme of the page, the kicker, the title, an excerpt, the pills and a pixel picture. Only the blog, partners, tech partners and the docs use it.

- Every page gets a card. The layout calls `seoGeneratedCard` when the CMS record has no share image, with the title, the theme and the kicker of the page. Marketing pages read them from `src/data/`.
- One sitewide default card for anything without data: the home hero, rendered once.
- Size: the card is 1200 by 700 today. The platforms crop to 1.91:1, so 1200 by 630 is safer. Decide with Stefano, then test the size.
- A pillar page can show its scene in the card: the PNG fallback of its first scene (next section), in place of the pixel picture.
- Cards are cached on the CDN by their data (`Surrogate-Control`), so a change of title gives a new card.
- A test asks for the card of every page of the sitemap: it gives 200, `image/png`, the right size, and the title on the card is the title of the page.

## Picture fallbacks

The product pictures are code: the scenes, frames and fragments in `src/scenes/`, the diagrams, the pixel videos. That is right for people. A crawler, an image search and a link preview see nothing. Each picture gets a real image.

- A registry, `src/data/pictures.ts`: one entry per picture, with an id, the component, the pages that use it, the alt text, a caption, and a `depicts` line that says which part of the product it shows.
- A script, `npm run pictures`, starts its own dev server (with `--ignore-lock` and its own port, per `AGENTS.md`) and screenshots each picture on a bare route, `/dev/picture/<id>`, in light and dark, at 2x. The PNGs go in `public/pictures/<id>.png` and `<id>-dark.png`, and are committed. The build has no browser, so the script does not run in the build.
- The dark PNG has the alt text and caption of the light one, plus "(dark mode)".
- Each picture adds the PNG to its page without loading it for people: a `<noscript>` image, or an `ImageObject` in the JSON-LD, and `og:image` for the first picture of a pillar page.
- When the product changes what it looks like, read the `depicts` lines, update the scenes that match, and run `npm run pictures` again. The tests below catch a picture that has no PNG; only a person can catch a picture that looks wrong.

## AEO, GEO and agents

The site answers an agent as well as it answers a person.

- **`llms.txt`**: the site name, a one-line summary, then the pages grouped by section (Product, Features, Solutions, Pricing, Customers, Company, Blog), each linking to its markdown twin with its description. Then the docs' own `llms.txt` and `llms-full.txt`, the "For agents" section, and `llms-full.txt` under Optional. No page that `robots.txt` blocks. The blockquote in `src/pages/llms.txt.ts` has an em dash today.
- **`llms-full.txt`**: every page of the sitemap, one markdown section each.
- **Markdown twins**: every page has a `.md` version, converted from the rendered HTML with tables kept. The twin has no text from the scenes: a mock product UI that reads as real copy misleads an agent. The scene markup is removed before the conversion.
- **Content negotiation**: `Accept: text/markdown` gets the markdown, every HTML response carries `Vary: Accept`.
- **`Link` headers** on every page: `rel="sitemap"`, `rel="api-catalog"`, `rel="describedby"` to `llms.txt`, `rel="alternate"; type="text/markdown"` to the twin.
- **`robots.txt`**: `Content-Signal`, the disallowed paths, and the `Sitemap` line.
- Aim for a full score on isitagentready.com wherever a check applies to us.
- Pages answer questions directly: the answer in the first sentence of a section, specific numbers, real names.

## Linking

- External links open in a new tab with `rel="noopener"`, whatever the CMS sends. A middleware rewrites every `<a>` of the HTML, so no component has to remember. Only `datocms.com` and `www.datocms.com` are ours: the dashboard, status, the community and every other subdomain open in a new tab too. The `newTab` option of `ButtonData` then goes.
- Every page links to 3 to 5 internal pages that make sense, and at least two pages link to it.
- Internal links go to the final URL, never to a redirect.
- Descriptive link text. No "click here", "here", "read more" or "learn more" alone. No link without an accessible name.
- No link to a page that does not exist, and no link to an anchor that is not on the target page.

## Security

- `/.well-known/security.txt`: contact, the PGP key, preferred language, canonical, policy (`/security`) and an `Expires` date. Renew it before it lapses. A test fails 30 days before.
- Headers on every response: `strict-transport-security` and `frame-ancestors` exist today. Add `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin` and a `permissions-policy` that turns off what the site does not use.
- Every `target="_blank"` carries `noopener`.
- No secret, token or key in the repository or in client code. A test scans the client bundles of the build for the names of the server-only env vars of `astro.config.ts`.
- The security page has the short version on top (ISO 27001, EU hosting, encryption, SSO and 2FA, network, reliability, people, payments) and the whole policy under it. It claims only what is true and checked.
- No third-party script without a reason I agree with.

## Tests

Tests that grow with the repo. Every page passes its checks before it is committed.

### How I write them

- A test guards a promise the site makes: a rule from this file, a page that must exist, a header an agent relies on. If I can't say which promise a test guards, it doesn't get written.
- Test what a visitor or a crawler gets: the HTML, the headers, the markdown. Not how a component builds them.
- One idea per test, named as a plain sentence of what must be true ("every page of the live sitemap loads or redirects in one hop").
- Pure helpers get unit tests with small, real inputs. No mocks where a real value works.
- Site-wide rules run over every page of the sitemap, so a new page is covered the moment it exists. No test lists pages by hand, except the frozen list of live URLs.
- A guard that parses something first checks that it found anything at all. A loop over zero pages passes and proves nothing.
- A bug gets a test that fails before the fix and passes after it, in the same commit. The comment above it says what shipped and when.
- A failure names the page and what is wrong (`/pricing: description is 56 characters`), so it can be fixed without reading the test.
- Fast and quiet: unit tests in seconds, browser checks on demand. No flaky waits, no snapshots of whole pages.
- When a rule changes here, its test changes in the same commit. When a rule goes, its test goes.

### Unit (Vitest, `npm test`)

- **SEO helpers**: the title pattern, description truncation at 160, canonical from `site`, `seoGeneratedCard` tags.
- **JSON-LD builders**: one graph, stable `@id`s, references resolve inside the graph, no node without `@type`.
- **Redirects**: from the config alone.
  - Every source is unique, and no source equals its target.
  - No chains: no target is the source of another redirect.
  - No target is a URL that `robots.txt` blocks.
  - Every target maps to a page file or a dynamic route of `src/pages/`.
  - Every `[...rest]` source has a `[...rest]` target.
  - A redirect to `/` has a reason in a list next to the config, so a new one is a decision.
- **Internal links, from the source**: every `href` in `src/data/`, `src/pages/` and `src/components/` that starts with `/` matches a route or a redirect source. A link to a redirect source fails with the final URL in the message.
- **Sitemap**: `<lastmod>` only on the routes that keep a date, in `YYYY-MM-DD`, never before the publication date; the sitemap and the JSON-LD of a post give the same date.
- **`llms.txt`**: every link resolves to a route, none is blocked by `robots.txt`, and it is an index, never the full text.
- **Markdown twins**: the conversion keeps tables, keeps a space for `<br>`, keeps link targets, and drops `aria-hidden` markup and the scenes however deep they nest. Each case is a regression that happened once.
- **Site facts**: one file, `src/data/facts.ts`, holds the numbers the site says (partners, countries, uptime, edge locations, plugins, plans). A scan of `src/data/` and `src/pages/` fails on a literal that disagrees with it, in figures or in words ("250+ partners", "fifty countries"), with the file and the line.
- **Feature coverage**: every feature of `src/data/features.ts` appears on a pillar page or has a note that says where it lives. A new feature without a decision fails.
- **Picture registry**: a picture used on a page but not in the registry fails; a registry entry with no component fails; an entry with no PNG, light or dark, fails (run `npm run pictures`).
- **Copy**: no em dash in the copy of `src/data/`, no `[TODO: verify]` in a production build, no face glyph outside `faces.ts` (exists in `hero.test.ts`).
- **Legal pages**: each fact a review finds wrong in the legal pages gets an assertion, with the date and the source.
- **security.txt**: all the fields, and `Expires` more than 30 days ahead.

### Site-wide (`npm run qa`, over a running server, every page of the sitemap)

- **Status**: 200, and the frozen list of live URLs loads or redirects in one hop to a 200.
- **Head**: a title in the pattern, unique; a description of 70 to 160 characters, unique; `lang`; canonical equal to the URL on `site`; OG and Twitter tags; the share image gives a PNG of the right size.
- **Structure**: one `h1`, headings in order, `alt` on every image, no empty link.
- **JSON-LD**: one script that parses, with the types the page needs, `BreadcrumbList` on every page but home, FAQ questions on the page word for word.
- **Internal links, rendered**:
  - Every link and every anchor resolves on the rendered page, also the links from the CMS.
  - No internal link points at a redirect.
  - Every indexable page has at least 2 inlinks from other pages, the header and the footer not counted. An orphan fails with its URL.
  - Every page has 3 to 5 contextual outlinks.
  - The anchor text is descriptive: no "here", "read more", "click here", "learn more" alone.
  - The report lists the pages with the fewest inlinks, so the weak spots show.
- **External links**: `target="_blank"` and `rel` with `noopener`, every subdomain included.
- **Agents**: the twin of every page, negotiation, `Vary`, the four `Link` relations, `llms-full.txt` against the sitemap, `robots.txt` against the sitemap.
- **Headers**: the security headers on every response; `X-Robots-Tag` on staging; `noindex` on the 404.
- **Share cards**: every page's card loads, with its title.

### Browser (`npm run qa:browser`, Playwright and axe)

- WCAG 2.2 AA and best practice at 390 and 1440, light and dark, after the entry animations end, so contrast is measured on the final colours.
- No page scrolls sideways at 390, also with the longest CMS strings.
- No layout shift on load (CLS under 0.05).
- Reduced motion shows the final state, and the page without JS shows the final state.
- The homepage hero ends above the fold at 1280 by 720 and 1512 by 860.
- Every button with a contact card shows its card on focus.

## Open with Stefano

- `/made-for/*`: the prototype brought the persona pages back; `redesign` redirects them to the pillars.
- `/enterprise`: the prototype made it the page; `redesign` redirects it to `/enterprise-headless-cms`.
- The title separator: ` — DatoCMS` today, `| DatoCMS` here.
- The share card height: 700 today, 630 here.
- `/company/brand-assets`: rebuild or redirect.

## Order of work

1. The redirects and their unit tests, the frozen list of live URLs.
2. The h1s in the scene kit.
3. `site`, the 404 `noindex`, `X-Robots-Tag`, the security headers, `security.txt` `Expires`.
4. Descriptions and titles for the pages above, and the `qa` script.
5. The external links middleware, the `Link` relations, the internal links tests.
6. JSON-LD as one graph on every page.
7. Share cards on every page.
8. The picture registry, `npm run pictures`, and their tests.
9. `qa:browser`.
