import type { CodeTab } from '~/data/home';

/*
 * The code of the seven "Code: …" pictures of /developers
 * (`src/data/developers-pillar.ts`). The story is Northlight, a maker of
 * lamps (src/scenes/AGENTS.md, "The stories"): the product Arc floor lamp, the
 * landing page Spring light, and the one GraphQL query shared by chapters
 * 2, 3 and 4. Each export is the tabs of one fragment.
 *
 * Checked against the docs on 2026-10-25. What could not be confirmed is
 * marked "(check)" next to the line.
 */

// The id of the record Arc floor lamp, as the API would give it
const ARC_ID = 'Dk2sXz3tR9eQ1mYxPfL0vA';

// The type of the model Products in the GraphQL schema of the API. The
// names are the ones of the fields in the schema builder; `price` is the
// one the other tab types.
// (check) the `!` on name and price: the API gives a non-null type to a
// required field only with strict mode (`X-Exclude-Invalid`, docs:
// "Configuring requests"). The scalar is called FloatType in the API.
// The CLI command of the brief's reference (`schema:generate`) writes types
// for the Content Management API, not this type: gql.tada reads the schema
// of the Content Delivery API by introspection.
export const productType: CodeTab = {
  label: 'schema.graphql',
  lang: 'graphql',
  focus: [4],
  code: `# The model Products, as the API names it
type ProductRecord {
  name: String!
  price: FloatType!
  category: CategoryRecord
  related: [ProductRecord!]!
  heroImage: FileField
}`,
};

// The query of the story in a gql.tada `graphql()` call: the result type
// comes from the schema, so `price` is a number.
export const productQuery: CodeTab = {
  label: 'lamp.ts',
  lang: 'ts',
  focus: [7, 15],
  code: `import { graphql, type ResultOf } from 'gql.tada';

const LAMP_QUERY = graphql(\`
  query Lamp {
    product(filter: { slug: { eq: "arc-floor-lamp" } }) {
      name
      price
      category { name }
      related { name heroImage { url } }
    }
  }
\`);

type Lamp = ResultOf<typeof LAMP_QUERY>;
// Lamp['product']['price']  ->  number`,
};

export const schemaCode: CodeTab[] = [productType, productQuery];

// Four tabs, a query each and no response: what the API computes so the
// frontend does not have to. Each tab has its own site, not the lamps of
// the story: the feature picks the example.

// A magazine cover. With `fit: crop` and a size (`w` + `h`), the API adds
// the focal point that the editor set to the crop (docs: "Images and
// videos", "Focal points"). `auto: format` is the default of the project.
// `blurUpThumb` is the blur-up placeholder: a small blurred copy of the
// image, as a base64 data URI (docs: "Blurhash and Thumbhash"). `colors`
// are the dominant colours.
export const imagesTab: CodeTab = {
  label: 'Images',
  lang: 'graphql',
  focus: [[4, 6]],
  code: `query {
  article(filter: { slug: { eq: "lofoten" } }) {
    cover {
      responsiveImage(
        imgixParams: { fit: crop, w: 1200, h: 675 }
      ) {
        srcSet
        alt
      }
      blurUpThumb
      colors { hex }
    }
  }
}`,
};

// A recipe site: the meta tags of the page, from its SEO field or from
// the fallbacks of the model and of the project, and the favicons of the
// site (docs: "SEO and favicon"). The fields of a tag are the ones the
// helpers of react-datocms read.
export const seoTab: CodeTab = {
  label: 'SEO',
  lang: 'graphql',
  focus: [3, 6],
  code: `query {
  recipe(filter: { slug: { eq: "cacio-e-pepe" } }) {
    _seoMetaTags { tag attributes content }
  }
  _site {
    faviconMetaTags { tag attributes content }
  }
}`,
};

// A newsroom: the last three articles that quote a person, through the
// `author` link of the `quote` blocks of the field `body` (docs: "Inverse
// relationships", the path `docPage_main__chapter_author`).
// (check) `_firstPublishedAt_DESC` on an inverse relationship: the docs
// show `orderBy` there with `title_ASC` only.
export const referencesTab: CodeTab = {
  label: 'References',
  lang: 'graphql',
  focus: [[4, 7]],
  code: `query {
  person(filter: { slug: { eq: "mara-quinn" } }) {
    name
    _allReferencingArticles(
      through: {
        fields: { anyIn: [article_body__quote_author] }
      }
      orderBy: _firstPublishedAt_DESC
      first: 3
    ) {
      title
    }
  }
}`,
};

// A course: the video of a lesson, as Mux serves it. The HLS stream, an
// MP4, a poster and its placeholder from the same field (docs: "Images and
// videos", "Videos").
export const videoTab: CodeTab = {
  label: 'Video',
  lang: 'graphql',
  focus: [[5, 8]],
  code: `query {
  lesson(filter: { slug: { eq: "first-steps" } }) {
    clip {
      video {
        streamingUrl
        mp4Url(res: medium)
        thumbnailUrl(format: jpg)
        thumbhash
        duration
      }
    }
  }
}`,
};

export const apiCode: CodeTab[] = [imagesTab, seoTab, referencesTab, videoTab];

// react-datocms: `useQuerySubscription({ query, token })` returns
// `{ status, error, data }` (docs: "Listening to queries"). The query is
// the one of the live blog of the frame. Five lines at most, 39
// characters at most: the card sits in the diagram. Lines 1 to 4 are the
// hook: the frame marks them when an event comes in.
export const liveBlogCode: CodeTab = {
  label: 'LiveBlog.tsx',
  lang: 'tsx',
  focus: [[1, 4]],
  code: `const { data } = useQuerySubscription({
  query: LIVE_BLOG_QUERY,
  token,
});
return <Blog posts={data?.posts} />;`,
};

// Two tabs, the two arrows of the diagram as bytes. The first: one header
// on the request, and the response lists its tags: space separated,
// opaque, eight of them (the example of the docs, "Cache tags in CDA
// responses"). The line of the response is the one to see.
export const headersTab: CodeTab = {
  label: 'Response',
  lang: 'shell',
  focus: [3, 8],
  code: `$ curl -i https://graphql.datocms.com/ \\
    -H "Authorization: $DATOCMS_TOKEN" \\
    -H "X-Cache-Tags: true" \\
    --data '{ "query": "query Lamp { … }" }'

HTTP/2 200
content-type: application/json
X-Cache-Tags: BQD?* 2.a*q f7e N*r;L 6-KZ@ t#k[uP t#k[ub t#k[uU`,
};

// The second tab: the payload of the webhook "Content Delivery API Cache
// Tags", event "Invalidate" (docs: "The cache tags invalidation webhook").
// The tags are the two of the diagram. The `tags` array is the one to see.
export const webhookTab: CodeTab = {
  label: 'Incoming webhook',
  lang: 'http',
  focus: [[1, 2], 11],
  code: `POST /api/invalidate-cache HTTP/1.1
Content-Type: application/json

{
  "entity_type": "cda_cache_tags",
  "event_type": "invalidate",
  "entity": {
    "id": "cda_cache_tags",
    "type": "cda_cache_tags",
    "attributes": {
      "tags": ["N*r;L", "6-KZ@"]
    }
  },
  "related_entities": []
}`,
};

export const headersCode: CodeTab[] = [headersTab, webhookTab];

// Three tabs, one per CDN: the header the CDN reads (strong, it changes per
// tab), then the purge call of its API for the tags of the webhook. The
// docs (cache-tags-integrations) show the Fastly pair in Hono. `cacheTags`
// is the `x-cache-tags` header of the DatoCMS response.
// Fastly keeps the tags space separated; Cloudflare's Cache-Tag and
// Netlify's Netlify-Cache-Tag want commas (docs of both CDNs).
// (check) the purge call of Cloudflare (`POST /zones/{id}/purge_cache` with
// `{ tags }`, 100 per call) and of Netlify (`purgeCache({ tags })` of
// @netlify/functions) come from the docs of those CDNs, not from DatoCMS.
export const fastlyTab: CodeTab = {
  label: 'Fastly',
  lang: 'ts',
  code: `c.header('Surrogate-Key', cacheTags);
c.header('Surrogate-Control', 'max-age=31536000');

// In the webhook: purge the tags it names
await fetch(\`https://api.fastly.com/service/\${id}/purge\`, {
  method: 'POST',
  headers: {
    'fastly-key': FASTLY_KEY,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ surrogate_keys: tags }),
});`,
};

export const cloudflareTab: CodeTab = {
  label: 'Cloudflare',
  lang: 'ts',
  code: `c.header('Cache-Tag', cacheTags.split(' ').join(','));

// In the webhook: purge by tag, 100 at a time
const API = 'https://api.cloudflare.com/client/v4';
await fetch(\`\${API}/zones/\${zoneId}/purge_cache\`, {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${token}\`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ tags }),
});`,
};

export const netlifyTab: CodeTab = {
  label: 'Netlify',
  lang: 'ts',
  code: `c.header('Netlify-Cache-Tag', cacheTags.split(' ').join(','));

// In the webhook: purge by tag
import { purgeCache } from '@netlify/functions';

await purgeCache({ tags });`,
};

export const cdnCode: CodeTab[] = [fastlyTab, cloudflareTab, netlifyTab];

// `--autogenerate=my-feature:main` finds the changes made to my-feature
// and applies them to main (docs: "Option 2: Autogenerate a migration
// script"). The CLI writes TypeScript when the repo has a tsconfig.json.
// The generated script of the docs does not call `fields.create('article',
// …)`: it logs the step and passes the id of the model. The change is a
// plain field, with no story: the chapter is about the workflow, not
// about a use case.
// (check) the exact head of a generated TypeScript file (the import of
// the Client type); the docs show only the JavaScript one.
// The command, as the comment at the top of the file it writes: the eye
// reads the command, then what it wrote.
export const migrationTab: CodeTab = {
  label: 'migrations/1774002600_addSubtitle.ts',
  lang: 'ts',
  focus: [
    [1, 2],
    [6, 10],
  ],
  code: `// $ npx datocms migrations:new addSubtitle \\
//     --autogenerate=my-feature:main

export default async function (client: Client) {
  console.log('Create Single-line string field "Subtitle" (\`subtitle\`)');
  await client.fields.create('Zr4Xg2kQT1uWp8sNhA0LvQ', {
    label: 'Subtitle',
    field_type: 'string',
    api_key: 'subtitle',
  });
}`,
};

// The release of the frame of the chapter, as the script of a CI job: the
// safe deployment sequence of the CLI docs, the same four commands as the
// pill of the graph. `migrations:run --destination` forks the primary,
// with its content, and runs the migrations that are new in the fork.
export const releaseTab: CodeTab = {
  label: 'scripts/release.sh',
  lang: 'shell',
  focus: [2, 5, 8, 10],
  code: `# No edit lands in the primary during the release
npx datocms maintenance:on

# Fork the primary into release-2, then run the new migrations in it
npx datocms migrations:run --destination=release-2

# release-2 becomes the primary. The old primary stays as a sandbox.
npx datocms environments:promote release-2

npx datocms maintenance:off`,
};
export const releaseCode: CodeTab[] = [releaseTab];

// The plugin Trail tools of the project Alpine Trails
// (src/scenes/Plugins/story.ts). One tab for each part of the plugin in
// the frame of the chapter, in the order of the tags. Each tab has the
// hook that declares the part and the hook that renders it in the `Canvas`
// of datocms-react-ui, thus the part looks native. The names and the
// arguments are the ones of datocms-plugin-sdk 2.4. `render()` is the
// helper of the docs (React into #root); the imports are not shown.

// The field Difficulty: a manual field extension of the type `editor`, on
// an integer field. The value comes from the form, and the editor writes
// it back with `setFieldValue`. `get` is the helper of lodash, as in the
// docs.
export const pluginFieldTab: CodeTab = {
  label: 'Field',
  lang: 'tsx',
  focus: [2, 6],
  code: `connect({
  manualFieldExtensions: () => [
    { id: 'boots', name: 'Boot rating',
      type: 'editor', fieldTypes: ['integer'] },
  ],
  renderFieldExtension: (id, ctx) => render(
    <Canvas ctx={ctx}>
      <BootRating
        value={get(ctx.formValues, ctx.fieldPath)}
        onChange={(v) =>
          ctx.setFieldValue(ctx.fieldPath, v)}
      />
    </Canvas>
  ),
});`,
};

// The panel Trail conditions in the aside of the record: only on the
// model Trails (the hook gets the model). `ctx.item` is the record.
export const pluginPanelTab: CodeTab = {
  label: 'Panel',
  lang: 'tsx',
  focus: [2, 6],
  code: `connect({
  itemFormSidebarPanels: (model) =>
    model.attributes.api_key === 'trail'
      ? [{ id: 'conditions', label: 'Trail conditions' }]
      : [],
  renderItemFormSidebarPanel: (id, ctx) => render(
    <Canvas ctx={ctx}>
      <Conditions trailId={ctx.item?.id} />
    </Canvas>
  ),
});`,
};

// The tab Reports in the navigation bar, after Media, and its page. The
// page calls the Management API with the token of the editor: the plugin
// can do what the editor can, not more (the plugin asks for the
// permission `currentUserAccessToken`).
export const pluginPageTab: CodeTab = {
  label: 'Page',
  lang: 'tsx',
  focus: [2, 8],
  code: `connect({
  mainNavigationTabs: () => [{
    label: 'Reports',
    icon: 'chart-column',
    placement: ['after', 'media'],
    pointsTo: { pageId: 'reports' },
  }],
  renderPage: (pageId, ctx) => render(
    <Canvas ctx={ctx}>
      <Reports token={ctx.currentUserAccessToken} />
    </Canvas>
  ),
});`,
};

// The outlet above the fields: the live page of the trail and its
// numbers, from the slug in the form.
export const pluginOutletTab: CodeTab = {
  label: 'Outlet',
  lang: 'tsx',
  focus: [2, 5],
  code: `connect({
  itemFormOutlets: () => [
    { id: 'live', initialHeight: 48 },
  ],
  renderItemFormOutlet: (id, ctx) => render(
    <Canvas ctx={ctx}>
      <LiveStats slug={ctx.formValues.slug} />
    </Canvas>
  ),
});`,
};

// The check before a publish: the hook gets the records and the ctx, and
// gives false to stop the publish. `ctx.alert` is in the ctx of every
// hook. `gpx_track` is the API key of a field of the model Trails. It
// renders nothing: the button Publish of the frame does not change.
export const pluginPublishTab: CodeTab = {
  label: 'Publish',
  lang: 'tsx',
  focus: [2],
  code: `connect({
  async onBeforeItemsPublish(items, ctx) {
    const ok = items.every((i) => i.attributes.gpx_track);
    if (ok) return true;
    await ctx.alert('Add the GPX track first.');
    return false;
  },
});`,
};

export const pluginCode: CodeTab[] = [
  pluginFieldTab,
  pluginPanelTab,
  pluginPageTab,
  pluginOutletTab,
  pluginPublishTab,
];

// The GraphQL frame: the Lamp query of the story and its response, side by
// side (CodeSnippetPreview `columns`). The same names in both, nothing more
// in the response than the query asked. A Multiple links field takes no
// pagination argument: the three related lamps are all the links.
export const lampQuery: CodeTab = {
  label: 'Query',
  lang: 'graphql',
  code: `query Lamp {
  product(filter: { slug: { eq: "arc-floor-lamp" } }) {
    name
    price
    category { name }
    related {
      name
      heroImage { url }
    }
  }
}`,
};

export const lampResponse: CodeTab = {
  label: 'Response',
  lang: 'json',
  code: `{
  "product": {
    "name": "Arc floor lamp",
    "price": 249,
    "category": { "name": "Floor lamps" },
    "related": [
      { "name": "Halo pendant",
        "heroImage": { "url": "…/halo-pendant.jpg" } },
      { "name": "Dune table lamp",
        "heroImage": { "url": "…/dune-table-lamp.jpg" } },
      { "name": "Tide wall light",
        "heroImage": { "url": "…/tide-wall-light.jpg" } }
    ]
  }
}`,
};

// The id of the model Products, as the API would give it
const PRODUCT_MODEL_ID = 'Pq7mN2xVSaK4tY9wLcR3eB';

// A script that syncs the catalogue of the shop: it lists the products by
// SKU, updates the price of a product that exists, creates the ones that
// do not, and publishes each. The generic <Product> types the filter and
// the payloads by the fields of the model (docs: "items.instances", the
// generated types of `schema:generate`).
// (check) the model Products has a field `sku`: the other chapters do not
// show it.
export const syncScript: CodeTab = {
  label: 'sync-catalogue.ts',
  lang: 'ts',
  code: `import { buildClient } from '@datocms/cma-client-node';
import type { Product } from './cma-types';
import catalogue from './catalogue.json';

// One line to connect, from any script, function or CI job
const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN! });

for (const row of catalogue) {
  // Filter on any field, as in the GraphQL API
  const [lamp] = await client.items.list<Product>({
    filter: { type: 'product', fields: { sku: { eq: row.sku } } },
  });

  // Typed by your schema: a price as a string does not compile
  const record = lamp
    ? await client.items.update<Product>(lamp.id, { price: row.price })
    : await client.items.create<Product>({
        item_type: { type: 'item_type', id: '${PRODUCT_MODEL_ID}' },
        name: row.name,
        sku: row.sku,
        price: row.price,
      });

  // The same validations as in the editor, then live
  await client.items.publish(record.id);
}`,
  notes: [
    { comment: 5, point: 'buildClient' },
    { comment: 9, point: 'filter' },
    { comment: 14, point: 'price' },
    { comment: 24, point: 'publish' },
  ],
};

// The types that `npx datocms schema:generate` writes from the schema of
// the project: one ItemTypeDefinition for each model, with its id and the
// type of each field.
export const cmaTypes: CodeTab = {
  label: 'cma-types.ts',
  lang: 'ts',
  code: `// Written by: npx datocms schema:generate cma-types.ts
import type { ItemTypeDefinition } from '@datocms/cma-client-node';

type EnvironmentSettings = { locales: 'en' | 'it' };

// Each model is a type, with its ID and its fields
export type Product = ItemTypeDefinition<
  EnvironmentSettings,
  '${PRODUCT_MODEL_ID}',
  {
    name: { type: 'string' };
    sku: { type: 'string' };
    // A float in the schema, a number in your code
    price: { type: 'float' };
    category: { type: 'link' };
    related: { type: 'links' };
    hero_image: { type: 'file' };
  }
>;`,
  notes: [
    { comment: 6, point: 'Product' },
    { comment: 13, point: 'price' },
  ],
};

export const automationCode: CodeTab[] = [syncScript, cmaTypes];
