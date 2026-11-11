import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';

/*
 * The Workflows chapter of the Editing pillar
 * (`/editor-experience#workflows`).
 *
 * The scene shows one record: the press release "Kestrel opens its first
 * factory in Portugal", in legal review (src/scenes/Workflows/story.ts). The
 * fragments show the role of its writers and its publication at the
 * embargo.
 */

// Part 1 of the chapter: the header. New copy. Workflows are an Enterprise
// feature (the docs page of the feature): the intro does not say it.
export const chapter: ChapterHeaderData = {
  label: 'Workflows',
  headline: 'Your review process,',
  muted: 'built into the record.',
  intro: 'Name the stages, pick which roles can move a record along, and that’s your workflow.',
  link: {
    label: 'Read the docs',
    href: '/docs/general-concepts/workflows',
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
      title: 'Publish de-AT on Monday at 10:15.',
      text: 'Pick a date and a time, per locale or for all of them, and the record publishes or unpublishes itself, with nobody at the keyboard.',
    },
  ],
};
