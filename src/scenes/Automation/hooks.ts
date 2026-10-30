/*
 * The data of the fragment "Webhooks on any event." of the Automation
 * chapter (Hooks.astro). The entities and the events are the real ones of
 * the webhooks of DatoCMS: `events[].entity_type` and `event_types` of the
 * webhook resource of the CMA, and the table of the triggers in
 * /docs/general-concepts/webhooks. The build triggers are not in the
 * picture: the next fragment, "Deploy when editors publish.", is about
 * them.
 */

export interface HookEntity {
  /** The `entity_type` of the webhook */
  entity: string;
  /** False for an entity that the webhook does not listen to: its row is dim and never fires */
  ticked: boolean;
}

/** The rows of the panel Events, from the top. The longest row with its event sets the width of the panel. */
export const ENTITIES: HookEntity[] = [
  { entity: 'item', ticked: true },
  { entity: 'item_type', ticked: true },
  { entity: 'upload', ticked: true },
  { entity: 'environment', ticked: true },
  { entity: 'maintenance_mode', ticked: true },
  { entity: 'cda_cache_tags', ticked: true },
  { entity: 'sso_user', ticked: false },
];

/**
 * The events of the loop, in this order, again and again: an
 * `entity_type` and one of its `event_type`. Records change most often,
 * thus they come more often. Two events in a row never have the same
 * entity.
 */
export const CYCLE: [entity: string, event: string][] = [
  ['item', 'publish'],
  ['upload', 'create'],
  ['item_type', 'update'],
  ['item', 'update'],
  ['environment', 'promote'],
  ['item', 'unpublish'],
  ['cda_cache_tags', 'invalidate'],
  ['upload', 'update'],
  ['item', 'create'],
  ['maintenance_mode', 'change'],
  ['item_type', 'create'],
  ['item', 'delete'],
];

/** The event of the still (no JS, reduced motion): the first of the cycle */
export const STILL = CYCLE[0]!;

/** The call of DatoCMS: the method and the path of the URL of the webhook */
export const CALL = 'POST /webhooks';

/** The custom header of the webhook, its value hidden. No wider than the pill: it must not go over the tracks. */
export const HEADER = 'X-Secret: ••••';

/** The answer of the URL, after each call */
export const ANSWER = '200 OK';

export const DESCRIPTION =
  'A webhook: the events of records, models, uploads, environments, maintenance mode and cache tags come one after the other, and for each one DatoCMS calls POST /webhooks with a custom header; the URL answers 200 OK. SSO users are not ticked, thus they never call it.';

/**
 * The box of the curves in the markup, in px: about the box of the tracks
 * in a wide fragment (7 rows of 26px). The script draws the curves again
 * in the real px of the box.
 */
export const FAN = { width: 60, height: 182 };

/** The entities with a track: the ones that the webhook listens to */
export const TRACKED = ENTITIES.filter(({ ticked }) => ticked);

/** The distance in px between the ends of two curves at the pill: the ends make a narrow band, not one point */
const SPREAD = 2.5;

/**
 * The curve of row `i` in a box of `width` × `height`: from the left edge
 * at the middle of the row to the right edge, near the middle of the box.
 * Each curve comes to the pill at its own height (SPREAD), in the order of
 * the rows, thus the curves do not cross. The two control points are at
 * the middle of the width, thus the curve leaves the row and comes to the
 * pill horizontally.
 */
export function curve(i: number, width: number, height: number): string {
  const y = ((i + 0.5) / ENTITIES.length) * height;
  const x = width / 2;
  const k = TRACKED.indexOf(ENTITIES[i]!);
  const end = height / 2 + (k - (TRACKED.length - 1) / 2) * SPREAD;
  return `M0 ${y} C${x} ${y} ${x} ${end} ${width} ${end}`;
}
