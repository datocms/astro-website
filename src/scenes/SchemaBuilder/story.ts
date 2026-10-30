import type { ModelPageField } from '@datocms/product-scenes';

// The fake content of the chapter "Schema builder" of /developers: the
// project Northlight, a maker of lamps that sells them online (see "The
// stories" in src/scenes/AGENTS.md). Do not change a text here without
// a change to the copy (src/data/developers-pillar.ts).

export const PROJECT_NAME = 'Northlight';

export const USER_NAME = 'Demo User';

export const PRODUCTS_MODEL = { name: 'Products', emoji: '💡' } as const;

/**
 * The models of the schema, in the sidebar of the tab Schema: Products is
 * open, Pages is in the folder Shop. The emoji at the start of a name is
 * the icon of the model.
 */
export const SCHEMA_MODELS = [
  { name: `${PRODUCTS_MODEL.emoji} ${PRODUCTS_MODEL.name}`, apiKey: 'product' },
  { name: '🗂️ Categories', apiKey: 'category' },
  { name: '📰 Journal', apiKey: 'article' },
  { name: '✍️ Authors', apiKey: 'author' },
  // No emoji: the emoji of a model takes the place of the marker of a
  // single-instance model, in the cms too
  { name: 'Homepage', apiKey: 'homepage' },
] as const;

export const SCHEMA_FOLDER = {
  name: 'Shop',
  models: [{ name: '📄 Pages', apiKey: 'page' }],
} as const;

/**
 * The fields of Products, in their order. Category and Related link to the
 * models with these names.
 */
export const PRODUCT_FIELDS: ModelPageField[] = [
  { type: 'string', label: 'Name', apiKey: 'name', required: true },
  { type: 'slug', label: 'Slug', apiKey: 'slug' },
  { type: 'float', label: 'Price', apiKey: 'price', required: true },
  { type: 'file', label: 'Hero image', apiKey: 'hero_image', required: true },
  { type: 'structured_text', label: 'Description', apiKey: 'description' },
  { type: 'text', label: 'Care instructions', apiKey: 'care_instructions' },
  { type: 'link', label: 'Category', apiKey: 'category', links: ['🗂️ Categories'] },
  {
    type: 'links',
    label: 'Related',
    apiKey: 'related',
    links: [`${PRODUCTS_MODEL.emoji} ${PRODUCTS_MODEL.name}`],
  },
];

/**
 * The field that the frame opens: a text field. Its tab Presentation has
 * the help text and the field editor: the Markdown editor with its toolbar
 * buttons, and the three editors of a text field: Markdown editor, HTML
 * editor and Simple textarea.
 */
export const CARE_INSTRUCTIONS_FIELD = {
  label: 'Care instructions',
  apiKey: 'care_instructions',
  id: 'Hx7tLq2NcV9rBe4mWzPa1s',
} as const;

/**
 * The help text of Care instructions, on the tab Presentation of the
 * field. The record editor shows it under the field.
 */
export const CARE_INSTRUCTIONS_HINT = 'How to clean the shade and change the bulb.';
