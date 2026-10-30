// The fake content of the chapter "Dynamic layouts". The scene, the drag
// fragment and the diagram of the nested blocks show one record: the
// marketing landing page "Plover for agencies" of Plover, a calendar app
// for teams. Do not change a text here without a change to the copy
// (src/data/dynamic-layouts.ts).

export const PROJECT_NAME = 'Plover';

export const USER_NAME = 'Demo User';

export const PAGE_ICON = '📣';

export const SIDEBAR_CAMPAIGN_MODELS = ['📣 Landing pages', '🎁 Offers'] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Pages', 'Blog', 'Changelog', 'Legal'] as const;

export const PAGE_TITLE = 'Plover for agencies';

export const PAGE_SLUG = 'agencies';

export const PAGE_SLUG_PREFIX = 'https://plover.app/for/';

export const RECORD_INFO = {
  id: 'Pv4AgncsLp7tRq2ZkWn9eX',
  status: 'published',
  createdAt: '05/02/2026, 10:05',
  updatedAt: '05/06/2026, 17:22',
  createdBy: 'Ronak Ganatra',
} as const;

export const SECTIONS_LABEL = 'Sections';

export type SectionModel = {
  name: string;
  emoji: string;
};

export const HERO: SectionModel = { name: 'Hero', emoji: '🦸' };
export const FEATURE_GRID: SectionModel = { name: 'Feature grid', emoji: '✨' };
export const LOGO_WALL: SectionModel = { name: 'Logo wall', emoji: '🏷️' };
export const TESTIMONIAL: SectionModel = { name: 'Testimonial', emoji: '💬' };
export const CALL_TO_ACTION: SectionModel = { name: 'Call to action', emoji: '📣' };

/**
 * The block models that the Sections field accepts, in the order of the
 * menu of the cms: by name
 */
export const SECTION_MODELS = [CALL_TO_ACTION, FEATURE_GRID, HERO, LOGO_WALL, TESTIMONIAL] as const;

export const HERO_TITLE = 'Every client, one calendar';

export const FEATURE_GRID_TITLE = 'Built for client work';

/**
 * The description of the Feature grid model, from its settings in the
 * schema. The menu of the open gap shows it in the card of the model, with
 * the preview image (feature-grid.svg, feature-grid-dark.svg).
 */
export const FEATURE_GRID_DESCRIPTION = 'Three features in a row. Put it after the hero.';

/**
 * The blocks in the Feature grid block, for the diagram of the nested
 * blocks (Nest.astro): three Feature blocks, each with its title and a
 * Button block with its label. Feature is a block model of the Feature
 * grid, Button a block model of the Feature.
 */
export const FEATURE_BLOCKS = [
  { title: 'A calendar for each client', button: 'Try it' },
  { title: 'Time off that everyone sees', button: 'Plan leave' },
  { title: 'Hours per client, each week', button: 'Log hours' },
] as const;

export const LOGO_WALL_TITLE = 'Agencies that plan with Plover';

export const TESTIMONIAL_QUOTE = 'We stopped double-booking our designers in the first week.';

export const CALL_TO_ACTION_FIELDS = {
  title: 'Try Plover free for 14 days',
  button: 'Start your trial',
  url: 'https://plover.app/signup?from=agencies',
} as const;

export const CALL_TO_ACTION_TITLE = CALL_TO_ACTION_FIELDS.title;

/**
 * The blocks of the Sections field, in the order of the page. The drag
 * fragment moves the Feature grid below the Logo wall, then the Logo wall
 * back below the Feature grid.
 */
export const SECTIONS = [
  { model: HERO, summary: HERO_TITLE },
  { model: FEATURE_GRID, summary: FEATURE_GRID_TITLE },
  { model: LOGO_WALL, summary: LOGO_WALL_TITLE },
  { model: TESTIMONIAL, summary: TESTIMONIAL_QUOTE },
  { model: CALL_TO_ACTION, summary: CALL_TO_ACTION_TITLE },
] as const;

/**
 * Where the picture of the drag is in the drag fragment, from the top left
 * of the dragged block, in px. The editor took the Feature grid by the top
 * of its handle, and the pointer is now on the top of the Testimonial
 * block, two blocks (98px) lower: the picture covers that block, a bit to
 * the right. The second drag takes the Logo wall from the same place to
 * the same place, thus it uses the same offset.
 */
export const DRAG_OFFSET = { x: 10, y: 98 };
