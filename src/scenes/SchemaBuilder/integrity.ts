/*
 * The data of the fragment "Every record follows the schema." of the
 * Schema builder chapter (Integrity.astro). The model Articles of the
 * Northlight journal is a small table: the records are the rows, the fields are
 * the columns, and the header is the schema. A schema change is a change
 * to one header, and DatoCMS changes every cell under it.
 *
 * The loop has three events, in this order. Each event changes one column:
 * 1. a slug field added: its column opens, and DatoCMS makes the slug of
 *    each record from its name;
 * 2. a tag deleted: each link to it goes from the Tags fields, and one
 *    article is left with no tag;
 * 3. a new validation: DatoCMS validates each record again, and puts the
 *    triangle of an invalid record next to the name of that article.
 * The loop starts from stage 0, with no slug column. The still is stage 1,
 * with the pill of the first event: the slugs are there.
 */

export type Column = 'name' | 'slug' | 'tags';

export const COLUMNS: { id: Column; label: string }[] = [
  { id: 'name', label: 'name' },
  { id: 'slug', label: 'slug' },
  { id: 'tags', label: 'tags' },
];

/**
 * The stage of the table: the number of events that are done (0 to 3).
 * An item with `from` shows from that stage; an item with `until` shows
 * before that stage. Thus event `n` (from 1) adds the items with
 * `from: n` and removes the items with `until: n`.
 */
export interface Lifetime {
  from?: number;
  until?: number;
}

export interface Chip extends Lifetime {
  text: string;
}

export interface Row extends Lifetime {
  id: string;
  name: string;
  slug: Chip[];
  tags: Chip[];
  invalid?: Lifetime;
}

/** The stage of the still (no JS, reduced motion): after the first event, thus the slug column shows */
export const STILL_STAGE = 1;

export const START_STAGE = 0;

export const shows = ({ from = 0, until = Infinity }: Lifetime, stage: number) =>
  from <= stage && stage < until;

/** The slug of a record: DatoCMS makes it from the name when the field comes (event 1) */
const slug = (name: string): Chip[] => [
  {
    text: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    from: 1,
  },
];

/** A link to the tag News: it goes with event 2. It is the last chip of its cell, thus no chip moves when it goes. */
const news: Chip = { text: 'News', until: 2 };

const row = (id: string, name: string, tags: Chip[], invalid?: Lifetime): Row => ({
  id,
  name,
  slug: slug(name),
  tags,
  invalid,
});

/** The articles, from the top. The box shows the first five or six; the others are under the fade. */
export const ROWS: Row[] = [
  row('nooks', 'Reading nooks', [{ text: 'Home' }, news]),
  row('bulbs', 'Bulbs, explained', [{ text: 'Tips' }]),
  // News is its only tag: after event 2 it has no tag, and the new validation of event 3 makes it invalid
  row('brass', 'Caring for brass', [news], { from: 3 }),
  row('winter', 'Winter light', [{ text: 'Home' }, news]),
  row('desks', 'Desk setups', [{ text: 'Tips' }, news]),
  row('rooms', 'Small rooms', [{ text: 'Home' }]),
  row('glass', 'Our new glass', [{ text: 'Care' }]),
  row('shop', 'A shop visit', [{ text: 'Tips' }]),
];

export const MODEL = 'Articles';
export const RECORDS = '1,490';

export interface IntegrityEvent {
  /** The text of the event pill. A part in backticks is a name, in a light pill (`pillHtml`). */
  label: string;
  column: Column;
  /** A new field: its column opens when the pulse arrives at the place of the column */
  opens?: boolean;
  /** A validation: each cell of the column is checked, also when nothing changes */
  validate?: boolean;
}

/** The events of the loop, in this order. Event `i` takes the table from stage `i` to stage `i + 1`. */
export const EVENTS: IntegrityEvent[] = [
  { label: 'New field added: `slug`', column: 'slug', opens: true },
  { label: 'Record deleted: `News`', column: 'tags' },
  { label: 'Field becomes required: `tags`', column: 'tags', validate: true },
];

export const pillHtml = (label: string) =>
  label
    .split('`')
    .map((part, i) => (i % 2 ? `<code>${part}</code>` : part))
    .join('');

export const STILL = EVENTS[STILL_STAGE - 1]!;

/**
 * The widths of the columns, in parts of 100 of the width of the table
 * (the cells have no gap between them, thus the middle of a column is
 * known). From 460px, and to 459px. Before event 1 the slug column has
 * no width (Integrity.astro).
 */
export const WIDTHS = {
  wide: { name: 36, slug: 34, tags: 30 },
  narrow: { name: 36, slug: 32, tags: 32 },
} satisfies Record<string, Record<Column, number>>;

export function middle(widths: Record<Column, number>, column: Column): number {
  let x = 0;
  for (const { id } of COLUMNS) {
    if (id === column) return x + widths[id] / 2;
    x += widths[id];
  }
  return 50;
}

export const DESCRIPTION =
  'The model Articles of the Northlight journal as a table: the records are rows, the fields are columns, the header is the schema. Each schema change reaches every record at once. A slug field is added, and every article gets a slug made from its name. The tag News is deleted, and every link to it goes too: one article is left with no tag. A new validation makes tags required, and that article is marked invalid.';
