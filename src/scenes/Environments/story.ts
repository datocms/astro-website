/*
 * The fake data of the frame of the Environments chapter (Graph.astro):
 * the geometry of the graph, the commands on the pill, the names of the
 * environments, and the still picture. The graph is a git graph of the
 * environments of one project: a lane for each environment, a dot for
 * each change, time to the right.
 */

/** The two rows of the graph. The primary goes from one to the other at each promotion. */
export type Row = 0 | 1;

export const STEP = 44;

/** The px from the dot of the newest slot to the right edge of the graph */
export const PAD = 16;

/** The height of the graph, and the y of each row */
export const HEIGHT = 300;
export const ROW_Y: Record<Row, number> = { 0: 110, 1: 240 };

/**
 * The half of the height of the band of the maintenance mode. The band is
 * a strip around the lane of the primary only: the maintenance mode locks
 * the primary, and the sandboxes stay open.
 */
export const BAND = 46;

/** The y of the label of the band, in the strip of `row`, at the side away from the other row: the fork curve is between the rows */
export const bandLabelY = (row: Row) => (row === 0 ? ROW_Y[0] - BAND + 18 : ROW_Y[1] + BAND - 10);

/** The slots of a lane before the first one in view: the lane comes in from the left edge */
export const PAST = 80;

/** The slots after the newest one where a lane that goes on ends: out of view, under the right edge */
export const AHEAD = 3;

export const BAR = 8;

export const DOT = 5;

export const LEGEND = {
  edit: 'Regular content editing',
  migration: 'Schema migrations',
};

export const PROJECT = 'Your project';

export const MAINTENANCE = 'Maintenance';

export const PRIMARY = 'Primary';

export const release = (n: number) => `release-${n}`;

/**
 * The commands of a release, on the pill, in their order (the safe
 * deployment sequence of the CLI docs). `migrations:run` forks the
 * primary into the destination, then runs the migrations in it.
 */
export const COMMANDS = {
  lock: 'maintenance:on',
  migrate: (name: string) => `migrations:run --destination=${name}`,
  promote: (name: string) => `environments:promote ${name}`,
  unlock: 'maintenance:off',
};

/** The CLI before each command on the pill (not on phones: the pill is too wide there) */
export const CLI = 'npx datocms';

/**
 * The still picture (no JS, reduced motion, and the first frame), in
 * slots of time. Editors change content in main (a dot for a change). The
 * maintenance mode locks it (the band around its lane). migrations:run
 * forks main into release-1, after the padlock, and runs the
 * migrations (the bar, that gets longer while they run). The promotion
 * makes release-1 the primary; main stays, dim, as the way back. Editors change content in release-1 again. The
 * loop goes on from here: the next release forks release-1 into the row
 * of main.
 */
export const STILL = {
  head: 16,
  primary: 1 as Row,
  names: { 0: 'main', 1: release(1) } as Record<Row, string>,
  next: 2,
  command: COMMANDS.unlock,
  /** The changes of the editors, at a slot or at a half slot: some slots have none */
  edits: [
    ...[-8, -7.5, -7, -5, -4, -3.5, -3, -1, -0.5, 0, 1.5, 2, 3].map((slot) => ({
      row: 0 as Row,
      slot,
    })),
    { row: 1 as Row, slot: 16 },
  ],
  /** The fork: from main at the slot of migrations:run, after the padlock, to the first slot of release-1 */
  fork: { from: 6, to: 8 },
  /** The bar of the migrations: from the slot where they start to the slot where they end */
  migrations: { from: 8, to: 13 },
  /**
   * The band of the maintenance mode, on the row of main: from half a slot
   * before maintenance:on to some time after the promotion (slot 14):
   * maintenance:off comes 1.5s after the promotion, and the band ends 1s
   * after maintenance:off.
   */
  band: { from: 3.5, to: 15.5 },
};

export const DESCRIPTION =
  'A graph of the environments of a project, as a git graph. Editors change content in main. The maintenance mode locks it, migrations:run forks main into the sandbox release-1 and runs the migrations there (the sandbox is not locked), and the promotion makes release-1 the primary. Main stays as a sandbox to go back to, and editors change content in release-1. Then the next release forks it again.';
