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
    'You choose per field what gets translated: the title yes, the price no. Editors switch tabs and publish each locale when it is ready.',
  link: {
    label: 'Read The Docs',
    href: '/docs/general-concepts/localization',
    appearance: 'deep-on-white',
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
      text: 'Italian is done, German is still with the translator. Editors publish Italian now, and German when it is ready.',
    },
    {
      title: 'Each translator in their language.',
      text: 'A role edits only the locales you give it, so the German team works on German and leaves the other locales alone.',
    },
  ],
};
