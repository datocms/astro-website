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
2. Install dependencies with `npm install`.
3. Run `npm run decrypt-env` to decrypt the secrets.
4. Run `npm run dev` to start a local development server at [localhost:4321](http://localhost:4321).

# Conventions

## SVGs

SVGs are inlined, both in HTML and CSS. For the HTML part, there's a `<Svg />` Astro component:

```jsx
<Svg name="icons/regular/tachometer" />
```

There are two main directories for SVGs: `src/icons/` and `src/svg`. Depending on the directory, `<Svg />` will apply different SVGO settings:

- SVGs in `src/icons/` are 1em in size and have their `fill` color inherited from the parent HTML element's color attribute by forcing the fill of every element to `currentColor`.
- SVGs in `src/svg/` are more flexible: they don’t have a set size, and there’s no automatic fill color.

For the CSS part, we use [`postcss-inline-svg`](https://www.npmjs.com/package/postcss-inline-svg) which let's you inline SVGs like this:

```css
background: svg-load('icons/regular/check.svg');
background: svg-load('img/arrow-down.svg', fill=#000, stroke=#fff);
```

## `<Prose />`

This component is meant to add some nice, consistent formatting on text-heavy content like articles or blog posts.

The `<prose-island>` element is a custom HTML element that you can wrap around
part of HTML inside <Prose /> that you don't want to style with the rules below.
It's basically a reset.

```jsx
<Prose>
  <h1>This will be formatted</h1>

  <prose-island>
    <h1>This will NOT be formatted</h1>

    <Prose>
      <h1>This will be formatted again</h1>
    </Prose>
  </prose-island>
</Prose>
```

## Remote markdown content

To render markdown, you can use:

- `<Markdown of={content} />` or `markdown(content)` (they're basically the same).
- `inlineMarkdown` for small, single-paragraph markdown content that you want to render without the wrapping paragraph.

On top of standard GFM, the markdown pipeline supports a few extras:

- **Callouts** — GitHub-style blockquotes: `> [!NOTE] Title\n> Body` (also `TIP`, `WARNING`, etc.).
- **Tabs** — `remark-directive` container syntax for grouping mixed content into tabs:

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

  Outer container needs more colons than inner (`::::` vs `:::`). Each tab can contain any markdown (paragraphs, code, lists, blockquotes, …). Only recognized at the root level.

- **Syntax highlighting** — fenced code blocks are rendered through [Expressive Code](https://expressive-code.com/) (see `ec.config.mjs`).
- **Auto-linked headings** — every heading gets an anchor and a permalink, slugified from its text.

## Structured Text

Avoid directly using `<StructuredText />`. Prefer `<Text />` or `<InlineText />` which offers a few sane defaults.

Also, make sure to use [`ensureValidStructuredTextProps`](https://github.com/datocms/astro-datocms/blob/main/src/StructuredText/README.md#strict-props-type-checking) to make sure that EVERY kind of available block/linked record is handled correctly!

```jsx
<Text
  {...ensureValidStructuredTextProps({
    data: episode.content,
    blockComponents: {
      InternalVideoRecord: InternalVideo,
      ImageRecord: Image,
      TableRecord: Table,
    },
  })}
/>
```

# Weird issues...

## Astro, Prettier and white-spaces

Prettier sometimes will format the code this way (please notice the {link.text} is on a separate line). This will generate visible white-space inside the link.

```jsx
<div>
  {navLinks.map((link) => (
    <a href={link.href}>{link.text}</a>
  ))}
</div>
```

It's a [known issue](https://github.com/withastro/prettier-plugin-astro/issues/308). Sometimes you can solve adding `/* prettier-ignore */` to avoid auto-formatting...

## Astro.slots.has() returns true when slot exists inside a falsy conditional block

The title says it all. More info in this [Github issue](https://github.com/withastro/astro/issues/10024).

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

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
