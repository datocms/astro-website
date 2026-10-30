// The fake content of the chapter "Localization". The scenes show one
// record: the product "Cast-iron skillet, 28 cm" of Lume Kitchen, a shop of
// kitchenware, in its Italian locale. Do not change a text here without a
// change to the copy (src/data/localization.ts).

export const PROJECT_NAME = 'Lume Kitchen';

export const USER_NAME = 'Demo User';

export const PRODUCT_ICON = '🍳';

export const SIDEBAR_SHOP_MODELS = ['🍳 Products', '🗂️ Categories', '🏷️ Offers'] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Pages', 'Recipes', 'Legal'] as const;

/**
 * The locales of the product, in the order of the project. The scene shows
 * Italian. Arabic is written from right to left.
 */
export const LOCALES = [
  { locale: 'en', label: 'English' },
  { locale: 'it', label: 'Italian' },
  { locale: 'de', label: 'German' },
  { locale: 'fr', label: 'French' },
  { locale: 'pt', label: 'Portuguese' },
  { locale: 'ar', label: 'Arabic' },
] as const;

/**
 * The locale of the project that the product does not have yet: the menu
 * of the locales offers to add it
 */
export const MISSING_LOCALES = [{ locale: 'es', label: 'Spanish' }] as const;

/**
 * The locales in the dialog that publishes some of them: Italian, French and
 * Greek are ready and selected, German waits for the translator. The dialog has
 * 17 locales, more than LOCALES. The list stops at Czech.
 */
export const PUBLISH_OPTIONS = [
  { label: 'English' },
  { label: 'Italian', selected: true },
  { label: 'German' },
  { label: 'French', selected: true },
  { label: 'Portuguese' },
  { label: 'Arabic' },
  { label: 'Dutch' },
  { label: 'Japanese' },
  { label: 'Korean' },
  { label: 'Catalan' },
  { label: 'Polish' },
  { label: 'Swedish' },
  { label: 'Danish' },
  { label: 'Chinese' },
  { label: 'Turkish' },
  { label: 'Greek', selected: true },
  { label: 'Czech' },
] as const;

/** The record has changes in its fields that are not localized: the editor publishes them with Italian, French and Greek */
export const PUBLISH_NON_LOCALIZED = { selected: true } as const;

export const ACTIVE_LOCALE = 'it';

export const PRODUCT_IT = {
  name: 'Padella in ghisa, 28 cm',
  slug: 'padella-in-ghisa-28-cm',
  slugPrefix: 'https://lumekitchen.com/it/prodotti/',
  description:
    'Ghisa pre-stagionata, dal fornello al forno. Si scalda piano e tiene il calore a lungo.',
  /** Empty in Italian */
  care: '',
} as const;

export const PRODUCT_SHARED = {
  price: '49.00',
  sku: 'LK-SK28',
  photoCaption: 'No metadata set',
} as const;

export const RECORD_INFO = {
  id: 'Lk28SkLtCa7tRq2ZkWn9eQ',
  status: 'published',
  createdAt: '02/11/2026, 09:40',
  updatedAt: '02/12/2026, 11:05',
  createdBy: 'Ronak Ganatra',
} as const;

/**
 * The rules of the role of the German translators, on the models of the
 * shop: they view the records and edit only the content in German
 */
export const TRANSLATOR_RULESETS = [
  { emoji: '🍳', title: 'Products', apiKey: 'product' },
  { emoji: '🗂️', title: 'Categories', apiKey: 'category' },
] as const;

export const TRANSLATOR_LOCALE = 'German';
