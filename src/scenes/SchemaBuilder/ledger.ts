/*
 * The data of the fragment "Applied, or refused." of the Schema builder
 * chapter (Ledger.astro). The picture is the log of the schema changes of
 * the model Articles of the Northlight journal. Each change comes as an
 * event pill and lands at the top of the log, with its verdict: what
 * DatoCMS changed in the records, or why DatoCMS refused the change.
 *
 * Each verdict is a true behaviour of DatoCMS:
 * - a new model made sortable: DatoCMS calculates the position of each record again;
 * - a new field type: DatoCMS converts the value in each record;
 * - a locale that a record needs: DatoCMS refuses to remove it;
 * - a deleted model: its records go, and the links to them go from the records of other models;
 * - an upload that a record still uses: DatoCMS refuses to delete it;
 * - a new field: DatoCMS adds it to each record.
 * The counts are examples. Keep them plausible for 1,490 articles.
 */

export type Part = string | { strong: string };

export interface LedgerEvent {
  /**
   * What changed: the text of the pill and of the row. A part in
   * backticks is a name: the pill and the row show it in a light pill
   * (`pillHtml` of integrity.ts).
   */
  label: string;
  verdict: Part[];
  /** DatoCMS refused the change: the verdict starts with "Refused:", in red */
  refused?: boolean;
}

/** The events of the loop, in this order. The newest is at the top of the log. */
export const EVENTS: LedgerEvent[] = [
  {
    label: 'Model made sortable: `Articles`',
    verdict: [{ strong: '1,490' }, ' positions assigned'],
  },
  { label: 'Field type changed: `summary`', verdict: [{ strong: '1,490' }, ' records converted'] },
  { label: 'Locale removed: `de`', verdict: ['Winter light would have no locale'], refused: true },
  {
    label: 'Model deleted: `Authors`',
    verdict: ['Links removed from ', { strong: '64' }, ' articles'],
  },
  {
    label: 'Upload deleted: `brass-care.jpg`',
    verdict: ['in use by ', { strong: '3' }, ' records'],
    refused: true,
  },
  { label: 'Field added: `subtitle`', verdict: [{ strong: '1,490' }, ' records updated'] },
];

/** The rows that the log keeps: the others go under the fade at the bottom */
export const KEEP = 6;

/**
 * The still (no JS, reduced motion), and the log at the start of the
 * loop: the last five events, the newest at the top. The pill shows the
 * newest.
 */
export const STILL_ROWS = EVENTS.slice(-5).reverse();
export const STILL = EVENTS.at(-1)!;

export const DESCRIPTION =
  'The log of the schema changes of the articles of the Northlight journal. Each change lands at the top with its verdict. Articles is made sortable: 1,490 positions are assigned. The type of the field summary changes: 1,490 records are converted. Removing the locale de is refused: Winter light would have no locale. The model Authors is deleted: the links to it are removed from 64 articles. Deleting the upload brass-care.jpg is refused: 3 records use it. The field subtitle is added: 1,490 records updated.';
