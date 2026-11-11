import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';

/*
 * The Localization chapter of the Editing pillar
 * (`/editor-experience#localization`).
 *
 * The scenes show one record: the product "Cast-iron skillet, 28 cm" of
 * Lume Kitchen.
 */

// Part 1 of the chapter: the header. New copy.
export const chapter: ChapterHeaderData = {
  label: 'Localization',
  headline: 'Localize each field.',
  muted: 'Or not.',
  intro:
    'You choose what gets translated per field: the title yes, the price no. A locale that isn’t ready falls back to one you set.',
  link: {
    label: 'Read the docs',
    href: '/docs/general-concepts/localization',
    variant: 'soft',
  },
};

// Part 3: two fragments. The locales of a record, which the editor
// publishes one at a time, then the role of a translator. New copy for the
// first.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'Publish when each locale is ready.',
      text: 'Italian is done, German and Arabic are still with the translator. Editors publish Italian now, and the others when they are ready.',
    },
    {
      // One language for each word: Each in German, translator in English, in
      // in Spanish, their in Arabic, language in Italian. (check) the Arabic
      // word with a native speaker.
      title: 'Each translator in their language.',
      text: 'A role edits only the locales you give it, so the German team works on German and leaves the other locales alone.',
    },
  ],
};
