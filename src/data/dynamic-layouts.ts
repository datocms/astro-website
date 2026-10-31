import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';

/*
 * The Dynamic layouts chapter of the Editing pillar
 * (`/editor-experience#dynamic-layouts`).
 *
 * All the pictures show one record: the marketing landing page "Plover for
 * agencies" of Plover, a calendar app for teams. The diagram of the nested
 * blocks shows the blocks in its Feature grid block.
 */

// Part 1 of the chapter: the header. New copy.
export const chapter: ChapterHeaderData = {
  label: 'Dynamic layouts',
  headline: 'A page builder,',
  muted: 'with a schema.',
  intro:
    'You define the blocks a field accepts. Marketers stack and reorder them into landing pages, and your code gets an ordered list of typed blocks.',
  link: {
    label: 'Read The Docs',
    href: '/docs/content-modelling/modular-content',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// Part 3: one fragment for each picture, in the order of the pictures. Two
// fragments: the order of the blocks, then their depth. The intro already
// says that you define the blocks, and the reuse of a block is content
// modelling, not the editor.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'Drag a section into place.',
      text: 'Editors drag blocks up and down the page. A new campaign page is a new record, not a ticket for the developers.',
    },
    // New copy. Blocks in blocks: the picture is a diagram, the Feature grid
    // block with three Feature blocks, each with a Button block
    // (src/scenes/DynamicLayouts/Nest.astro). The depth has a limit (the
    // blocks_depth of the project), which the copy does not give.
    {
      title: 'Blocks inside blocks.',
      text: 'A Feature grid holds Feature blocks, and each Feature holds a Button block. Editors nest them in one form; the API returns the same tree.',
    },
  ],
};
