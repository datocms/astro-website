# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Developers come first.** They usually choose the CMS. They are evaluating a headless CMS for a new project or a migration, and they want to know about the schema builder, GraphQL, real-time, cache tags, environments, the Management API, plugins and the framework integrations (Astro, Next.js, Nuxt, SvelteKit).
- **Editors are a close second.** They can judge DatoCMS without writing code, because the schema is built in the UI, not in code. They care about structured content, visual editing, dynamic layouts, localization, workflows, collaboration and SEO.
- **Buyers** (agency leads, CTOs, enterprise procurement) come third. Trust, security, pricing and support pages serve them (`/enterprise`, `/security`, `/pricing`, `/compare`), not the main story.
- **Existing customers** read the docs, the changelog (`/product-updates`), the blog, the plugins, the starters, the academy and the user guides.

When two audiences pull in different directions, the developer wins, unless the editor's view is what makes DatoCMS different (see Positioning). The brand and the main story speak to developers. Editors and business or product people also get their own pages (the Editing pillar today).

How visitors arrive: an agency recommends two or three CMSs to a client, and the client researches them. The website is where the decision is made. Visitors have two or three competitor sites open at the same time, so the difference must be clear in the first scroll. The pages visited most, after pricing, are the docs, developer experience and the product pages.

What the site must improve: more sign-ups, better self-qualification for developers, and clearer paths to partners and to sales.

## Product Purpose

datocms.com is the public site of DatoCMS, a headless CMS. It explains the product, helps visitors decide, and gets them started. It also holds the docs and the other reference material that customers use every day. Success means a developer or an editor understands what DatoCMS does and where it stops, and then signs up, contacts sales, or finds the answer they came for.

## Positioning

**Independence is the thread.** DatoCMS is bootstrapped and profitable, and answers only to its clients. "We work for you, the client, and no one else." The four claims below are expressions of that one fact:

- **Long-term, for over ten years.** A small, independent team that has run the product for more than a decade. The stable choice for clients who do not want to change CMS every other year. "Hello and welcome to your last CMS migration."
- **Client loyalty and fair pricing.** No investors to serve, so no price hikes, feature limits or lock-in to reach a 10x. Public, predictable plans that let customers plan for years. "Pricing as it should be."
- **Human support.** The people who build the product answer support.
- **AI-agnostic (BYOAI).** Bring your own AI: clients use the models they already have, through MCP, agent skills and docs for machines (`llms.txt`). Quality and independence stay high, and the subscription stays low. The site broadcasts this as a philosophy: it is one of the clearest expressions of the company.

**Category: content infrastructure.** DatoCMS calls itself content infrastructure: the robust base layer that evolves, and outlives the things built on it. "Headless CMS" stays as a description, including in the home hero, for search and clarity, but it is not the value proposition.

**Discipline as posture.** "We're not bleeding edge, we're disciplined." DatoCMS does not chase hype cycles or ship half-baked features. It innovates where it matters (Structured Text, cache-tag invalidation). Confident about the tech, the product and the independence, and its own harshest critic: the product still has a long way to go, and the site can say where it is not best in class.

**Small and bootstrapped: proud, not the headline.** Say independent, profitable and loyal only to clients, as the reason to trust the pricing and the long term. Answer the "is a small vendor safe?" worry on the trust pages (security, continuity). Do not lead a hero with the team size.

**Competitors are colleagues.** The site may name competitors only to help a visitor find the best fit: the `/compare` pages, and honest "X is a better fit when…" lines. Sending a visitor to a competitor when that is the better choice is the most confident move. Digs, even tasteful ones, stay in the blog.

**European, quietly.** Do not say "Italian company". The European angle that matters to enterprise is in trust signals: GDPR, the DPA, ISO 27001, where the data is hosted. Italian heritage is only a touch of charm, for example in the demo content of the product scenes (fashion, cars, food).

Against the neighbours: Sanity puts developers first (the schema and the Studio are code) and now aims its pitch at enterprise buyers. In DatoCMS the schema is built in the UI, so editors take part in the evaluation. Lead with developers, but never in a way that makes the editor's side look like an afterthought.

Home page line, today: "Thoughtfully built and ambitiously used. The AI-agnostic Headless CMS that's human on support and transparent in pricing."

## Operating Context

- The site has two kinds of surface. **Marketing**: home, four pillar pages (`/editor-experience`, `/developers`, `/media`, `/ai`), the feature index (`/features`), the framework pages (`/cms/*`), enterprise, pricing, compare, philosophy, the wall of love, case studies, contact. **Reference**: docs, blog, academy, glossary, user guides, product updates, plugins, starters, partners and tech partners.
- The content comes from DatoCMS itself, read through the Content Delivery API. Editors preview drafts on the site. The site is the origin behind a CDN that uses cache tags.
- Pillar pages tell one story each, in five to eight chapters. The rules for chapters, budgets and subject ownership are in `src/data/AGENTS.md`.
- Pictures of the product are drawn as code-rendered scenes (`@datocms/product-scenes`, `src/scenes/`), not screenshots. Show the product early: real UI defuses doubts about how viable and powerful DatoCMS is. The product UI is behind where the brand is going, so the scenes may lead the product a little, but never misrepresent what it does.
- The brand shows up mainly on the website and in the product. Also in dev newsletters, LinkedIn ads, partner channels, case studies and YouTube. A professional brand needs the same voice everywhere, down to invoices and support emails.

## Capabilities and Constraints

- Astro server app, deployed with `cubo` to Kubernetes (production, staging1, staging2). The code rules are in `AGENTS.md`.
- The fonts (ABC Oracle, Geist Mono) are licensed. Serve them through the `/fonts` proxy. Never commit a font file.
- Two colour schemes, light and dark, both supported.
- The original design comes from the agency overnice (Figma file `WnWBSVVcroe5s4tXQGnhSA`).
- Old feature URLs redirect to their chapter anchors. There is no page for each feature.
- **No marketplace.** `/plugins` and `/starters` are two separate pages, with no umbrella and no shared name. Never call either one a "marketplace".
  - `/starters`: only the starters we make and suggest. Never community submissions.
  - `/plugins`: collects the plugins that we and the community publish openly. They are free and shared, not sold. The place is the **plugin directory**, on the site and in the cms. The state of a plugin is **published** (an npm package in the directory, which receives updates) or **private** (a custom URL that you built, with no updates). Do not say "public plugin" or "community plugins": many of the plugins are ours.
  - Recipes (ready-made models and blocks that you import into a project) go in the docs. They are not a third catalogue page.

## Brand Commitments

- Name: DatoCMS. In copy, "we", never "DatoCMS provides…".
- Voice: `BRAND.md` (sections 2, 4, 5 and 7) is binding. Effortless, independent, generous, thoughtful. "Boring × Brilliant": solid infrastructure with a point of view. Understatement over superlatives. The words we avoid are in section 7 of that file.
- The text faces (`[••]`, `[•ᴥ•]`, `[•*•]`) are part of the current headlines.
- Litmus test: good copy feels like advice from someone who has done this before.
- From the rebrand workshop with overnice, kept on purpose: the opinionated, casual, anti-corporate tone; the vertical flow of content; the highlight style of headlines and quotes.
- Anti-patterns from the workshop: a fluffy home page that is not about the product; a personality that is too loud; minimalism without substance; a site that tries to do too much; trendy boilerplate that looks like every other site; information overload and micro-menus; stock or AI-generated imagery; enterprise buzzwords ("supercharge", "game changer", "synergy"); a home page that tires a returning visitor.

## Evidence on Hand

- Case studies, customer logos, testimonials and the wall of love come from the CMS (`/case-studies`, `/wall`). Use only those.
- The feature list is in `src/data/features.ts`. The code samples are in `src/data/*-code.ts`.
- **Numbers**: a number that the live site shows is verified. A new number does not go in the copy without a check (`src/data/AGENTS.md`, "Markers").
- Trust facts the site already states: ISO 27001 certification, a GDPR DPA (`src/data/enterprise.ts`, `/legal/gdpr`).
- Site analytics from the workshop (internal, not for the copy): 15,000–16,000 visitors a month, about half new; 2–2.5% sign-up conversion (4–5% for new visitors); 0.4% to paid self-service; 40–45 sales or partner requests a month.
- Do not invent customers, quotes, numbers, prices, integrations or feature claims.

## Product Principles

1. **We work for the client, and no one else.** Independence explains the pricing, the AI stance and the long term. Every argument can trace back to it.
2. **Developers decide, editors are not an afterthought.** Show the editor's view and the developer's view of the same thing, with the same words.
3. **Show the product, say where it stops.** Real UI early, the detail on the page, and an honest limit as part of the pitch.
4. **Disciplined, not bleeding edge.** Plain truth over promise, infrastructure over hype. The site should feel like it will run for another decade.
5. **Every claim is real.** Unverified facts stay out of the copy.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor on every page, in both colour schemes. `prefers-reduced-motion` shows the final state of each animation, and the final state is in the DOM without JS.
