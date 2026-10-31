import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';

/*
 * The Collaboration and versions chapter of the Editing pillar
 * (`/editor-experience#collaboration`). It covers real time collaboration,
 * versions, history and schedules.
 *
 * The frame shows the recipe "Lemon risotto with peas" of Simmer on two
 * screens (src/scenes/Collaboration/Pair.astro): Inès Moreau edits it, and
 * Tom Okafor looks at it. Her avatar comes to Tom; she types; his form
 * locks and his click on the title does nothing; she saves, and her
 * sentence comes to him. The fragments show what the frame does not: two
 * versions of the recipe compared, and the role of the cooks.
 */

// Part 1 of the chapter: the header. The versions have their own docs page:
// /docs/general-concepts/versioning.
export const chapter: ChapterHeaderData = {
  label: 'Collaboration and versions',
  headline: 'Work together,',
  muted: 'not over each other.',
  intro:
    'We show who has a record open and lock it while someone edits. Every save is a version you can compare and restore.',
  link: {
    label: 'Read The Docs',
    href: '/docs/general-concepts/collaboration-features',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// Part 2: two fragments. The intro and the scene already show the second
// editor and the lock: the versions and the roles are what they do not
// show. The schedule moved to the Workflows chapter.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'Every version, side by side.',
      // The retention per plan comes from the docs page on versioning.
      text: 'Open an earlier version, compare it with the current one, and restore it. How far back you go depends on your plan.',
    },
    // New copy. Roles and permissions belong to /enterprise
    // (src/data/AGENTS.md, "Who owns a subject"): one picture here, no
    // explanation.
    {
      title: 'A role for each job.',
      text: 'Cooks write and edit recipes but can’t delete them. You make the roles and set each rule, model by model and action by action.',
    },
  ],
};
