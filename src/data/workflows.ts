import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';

/*
 * The Workflows chapter of the Editing pillar
 * (`/editor-experience#workflows`). Old page: /features/workflow-cms.
 *
 * The scene shows one record: the press release "Kestrel opens its first
 * factory in Portugal", in legal review (src/scenes/Workflows/story.ts). The
 * fragments show the role of its writers and its publication at the
 * embargo.
 */

// Part 1 of the chapter: the header. New copy. The Enterprise limit comes
// from the docs page of the feature.
export const chapter: ChapterHeaderData = {
  label: 'Workflows',
  headline: 'Your review process,',
  muted: 'in the record.',
  intro:
    'You name the stages and choose which roles move a record from one to the next. Workflows are an Enterprise feature.',
  link: {
    label: 'Read The Docs',
    href: '/docs/general-concepts/workflows',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// Part 3: two fragments. The scene already shows the stage of a record.
// The schedule comes from the Collaboration chapter: it is the end of the
// review, when the record goes live.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'Only the right role approves.',
      text: 'A writer sends a draft to review, and only an editor approves it. Nothing goes live by mistake.',
    },
    {
      title: 'Publish on Monday at nine.',
      text: 'Pick a date and a time, and the record publishes or unpublishes itself, with nobody at the keyboard.',
    },
  ],
};
