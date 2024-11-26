<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms-assets.com/205/1728919607-color_full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# DatoCMS Website

This repository contains the source code of [datocms.com](https://www.datocms.com). It's built with Astro, gql.tada and the DatoCMS Astro SDK.

It's a server-only app (every route is dynamic), and it's meant to be the origin for a surrogate-keys-capable CDN like Fastly, which will then apply granular caching rules thanks to [DatoCMS cache tags](https://www.datocms.com/docs/content-delivery-api/cache-tags).

It can also be directly visited by the content editors to see the result of their draft changes in real time.

# How to run locally?

1. Clone this repository: `git clone https://github.com/datocms/website`
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in the missing values.
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

## Structured Text

Avoid directly using `<StructuredText />`. Prefer `<Text />` or `<InlineText />` which offers a few sane defaults.

Also, make sure to use `withAllComponents`, inside `blockComponents`, `linkToRecordComponents` and `inlineRecordComponents` to type-check that EVERY kind of available block is handled correctly!

```jsx
<Text
  data={episode.content}
  blockComponents={withAllComponents(episode.content.blocks, {
    InternalVideoRecord: InternalVideo,
    ImageRecord: Image,
    TableRecord: Table,
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

<a href="https://www.datocms.com/"><img src="https://www.datocms-assets.com/205/1728919607-color_full_logo.svg" height="60"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agency partners, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Quick links:**

- ⚡️ Get started with a [free DatoCMS account](https://dashboard.datocms.com/signup)
- 🔖 Go through the [docs](https://www.datocms.com/docs)
- ⚙️ Get [support from us and the community](https://community.datocms.com/)
- 🆕 Stay up to date on new features and fixes on the [changelog](https://www.datocms.com/product-updates)

**Our featured repos:**

- [datocms/react-datocms](https://github.com/datocms/react-datocms): React helper components for images, Structured Text rendering, and more
- [datocms/js-rest-api-clients](https://github.com/datocms/js-rest-api-clients): Node and browser JavaScript clients for updating and administering your content. For frontend fetches, we recommend using our [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) instead.
- [datocms/cli](https://github.com/datocms/cli): Command-line interface that includes our [Contentful importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [Wordpress importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress)
- [datocms/plugins](https://github.com/datocms/plugins): Example plugins we've made that extend the editor/admin dashboard
- [DatoCMS Starters](https://www.datocms.com/marketplace/starters) has examples for various Javascript frontend frameworks

Or see [all our public repos](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)

<!--datocms-autoinclude-footer end-->
