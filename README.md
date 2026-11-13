<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# DatoCMS Website

This repository contains the source code of [datocms.com](https://www.datocms.com). It's built with Astro, gql.tada and the DatoCMS Astro SDK.

It's a server-only app (every route is dynamic), and it's meant to be the origin for a surrogate-keys-capable CDN like Fastly, which will then apply granular caching rules thanks to [DatoCMS cache tags](https://www.datocms.com/docs/content-delivery-api/cache-tags).

It can also be directly visited by the content editors to see the result of their draft changes in real time.

We have thoroughly discussed this repository on our blog; be sure to explore the complete article series:

https://www.datocms.com/blog/why-we-switched-to-astro

# How to run locally?

1. Clone this repository: `git clone https://github.com/datocms/website`
2. Run `npm run decrypt-env` to decrypt the secrets.
3. Install dependencies with `npm ci`.
4. Run `npm run dev` to start a local development server at [localhost:4321](http://localhost:4321).

# Conventions

The rules for the code, the copy and the design are in these files:

- [`AGENTS.md`](AGENTS.md): the layouts, the components, the styling, the CMS queries, the client scripts, the images, the dev servers, the environment variables, the deployment and the migrations.
- [`src/data/AGENTS.md`](src/data/AGENTS.md): the copy and the pages. [`src/scenes/AGENTS.md`](src/scenes/AGENTS.md): the pictures of the product.
- [`DESIGN.md`](DESIGN.md), [`BRAND.md`](BRAND.md) and [`PRODUCT.md`](PRODUCT.md): the design system, the voice and the positioning.

## Remote markdown content

To render markdown, use `<Markdown of={content} />` or `markdown(content)`, and `inlineMarkdown` for a single paragraph without the wrapping `<p>`. On top of standard GFM, the pipeline supports:

- **Callouts**: GitHub-style blockquotes, `> [!NOTE] Title\n> Body` (also `TIP`, `WARNING`, etc.).
- **Tabs**: `remark-directive` containers, only at the root level. The outer container needs more colons than the inner one. Each tab can contain any markdown.

  ````md
  ::::tabs
  :::tab[Overview]
  A paragraph, then code:

  ```js
  console.log('hi');
  ```

  :::

  :::tab[Details]

  - bullet
  - list
    :::
    ::::
  ````

- **Syntax highlighting**: fenced code blocks render through [Expressive Code](https://expressive-code.com/) (see `ec.config.mjs`).
- **Auto-linked headings**: every heading gets an anchor and a permalink, slugified from its text.

## Structured Text

Render a Structured Text field with the components of `~/components/StructuredText`. Use [`ensureValidStructuredTextProps`](https://github.com/datocms/astro-datocms/blob/main/src/StructuredText/README.md#strict-props-type-checking), so that the type check finds a block or a linked record that has no component.

# Known issues

- **Prettier and white space**: Prettier can put the content of an inline element on its own line, which gives visible white space inside a link ([issue](https://github.com/withastro/prettier-plugin-astro/issues/308)). Add `/* prettier-ignore */` where it occurs.
- **`Astro.slots.has()`** returns true when the slot exists inside a falsy conditional block ([issue](https://github.com/withastro/astro/issues/10024)).

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**

- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/starters) — ready-to-deploy example sites for popular frameworks.

<!--datocms-autoinclude-footer end-->
