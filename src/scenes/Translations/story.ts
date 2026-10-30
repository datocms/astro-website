import type { InfoAsideAiTranslationsJob } from '@datocms/product-scenes';

// The fake content of the frame of the chapter "AI translations" of /ai:
// the product "Rolltop pannier 20 L" of Marram, written in English. The
// panel AI Translations of the plugin translates the whole record to the
// three other locales in one run. The story of the page is
// Marram (src/scenes/AGENTS.md, "The stories").
//
// The labels and the flow are the ones of the sidebar panel of the plugin
// (datocms/plugins, ai-translations/src/entrypoints/Sidebar/), drawn with the
// standard components of the cms (InfoAside.AiTranslations of the kit): the panel
// "AI Translations" after the record info, open; From, the source locale;
// To, all the other locales; the button "Translate all fields". The run
// makes one job for each field and each target locale, a few at a time,
// and shows a progress bar and one line with the job in progress. A job
// writes its value into the form when it ends. The line at the end asks to
// review and save.

export const PROJECT_NAME = 'Marram';

export const USER_NAME = 'Demo User';

export const PRODUCT_ICON = '🎒';

export const SIDEBAR_MODELS = ['🎒 Products', '📄 Pages', '📝 Guides', '🎬 Videos'] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Settings'] as const;

/** The locales of the project, in its order. The first is the source. */
export const LOCALES = [
  { locale: 'en', label: 'English' },
  { locale: 'it', label: 'Italian' },
  { locale: 'de', label: 'German' },
  { locale: 'fr', label: 'French' },
] as const;

/**
 * The locale that the form shows: Italian, a target. Its fields are empty
 * until the jobs of Italian end.
 */
export const ACTIVE_LOCALE = 'it';

export const TARGET_LOCALES = LOCALES.slice(1);

export const SLUG_PREFIX = 'https://marram.cc/products/';

export const PRODUCT_TITLE = 'Rolltop pannier 20 L';

export const PRODUCT_IT = {
  name: 'Borsa rolltop 20 L',
  slug: 'borsa-rolltop-20-l',
  intro: 'Venti litri, una sola chiusura a rotolo, nessuna zip che possa cedere.',
  body: 'Il guscio è in tessuto impermeabile saldato, e i ganci si montano su portapacchi da 8 a 16 mm senza attrezzi. Arrotola la parte alta tre volte, chiudi la clip, e la pioggia resta fuori.',
} as const;

/**
 * The block of the field Body, open, with its fields in Italian. The job
 * of Body keeps it where it is, between the two paragraphs, and also
 * translates its fields.
 */
export const SIZING_CHART = {
  name: 'Sizing chart',
  icon: '📏',
  dimensions: '33 × 17 × 48 cm, 1,1 kg',
  care: 'Lava a mano con acqua tiepida e lascia asciugare aperta.',
} as const;

/**
 * The localized fields of the model, in the order of the form: the plugin
 * makes the jobs in this order, each field for each target locale.
 */
export const FIELDS = ['Name', 'Slug', 'Body'] as const;

/**
 * The run follows AI_TRANSLATIONS_SEQUENCE of the kit: rest, click, four
 * batches, done. The panel runs a few jobs at a time, thus each batch
 * starts new jobs and ends the jobs before them:
 * - batch 1: the jobs of Name (three locales) and of Slug to Italian start.
 * - batch 2: the jobs of Name end, and Name shows in Italian; the jobs of
 *   Slug to German and French, and of Body to Italian, start.
 * - batch 3: the jobs of Slug end, and Slug shows in Italian; the jobs of
 *   Body to German and French start.
 * - batch 4: the job of Body to Italian ends, and Body shows in Italian,
 *   with the block where it was.
 * - done (5): the last jobs end, the bar is full, and the message of the
 *   plugin shows. It is the still.
 */
const BATCHES: Record<string, [1 | 2 | 3 | 4, 2 | 3 | 4 | 5]> = {
  'Name.it': [1, 2],
  'Name.de': [1, 2],
  'Name.fr': [1, 2],
  'Slug.it': [1, 3],
  'Slug.de': [2, 3],
  'Slug.fr': [2, 3],
  'Body.it': [2, 4],
  'Body.de': [3, 5],
  'Body.fr': [3, 5],
};

/** The step where each Italian field fills: the end of its Italian job */
export const FILLS_AT = { name: 'batch-2', slug: 'batch-3', body: 'batch-4' } as const;

export const JOBS: InfoAsideAiTranslationsJob[] = FIELDS.flatMap((field) =>
  TARGET_LOCALES.map(({ locale, label }) => {
    const [start, end] = BATCHES[`${field}.${locale}`]!;
    return { field, locale: label, start, end };
  }),
);

export const DONE_MESSAGE = 'Translations were applied to the form. Review them and click Save.';

export const RECORD_INFO = {
  id: 'Mr20RtPnK4vQe8LxWa3sTb',
  status: 'published',
  createdAt: '03/02/2026, 10:12',
  updatedAt: '03/09/2026, 16:48',
  createdBy: 'Demo User',
} as const;

export const DESCRIPTION = `The record editor of DatoCMS with the product “${PRODUCT_TITLE}”, on the Italian tab. In the aside, the panel AI Translations: from English to Italian, German and French, and the button Translate all fields. After the click, a progress bar and one line with the job in progress: Name, Slug and Body, each to Italian, German and French. The Italian fields fill one by one: “${PRODUCT_IT.name}”, the slug “${PRODUCT_IT.slug}”, and the body in Italian, with the block Sizing chart where it was, its fields also in Italian. At the end the panel says: ${DONE_MESSAGE}`;
