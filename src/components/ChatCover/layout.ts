/*
 * The shape of a chat cover. The cover is a grid of 100 x 58 cells, like the
 * covers of the blog posts. The seam of the two grounds is at column 50.
 * Each guest has one speech bubble. A bubble is a flat box with stepped
 * corners and a stepped tail. The portrait of the guest is in the box, with a
 * frame of 2 cells around it. The tail has no photo.
 *
 * This module computes the shapes in cells. It imports no Vite feature.
 */

export const COLUMNS = 100;
export const ROWS = 58;

export type Bubble = {
  /** The left column of the box. */
  x: number;
  /** The top row of the box. */
  y: number;
  /** The width and the height of the box, in cells. */
  size: number;
  /** The side of the tail. The tail points down and to this side. */
  tail: 'left' | 'right';
};

/** The inset of each row of a corner, from the outer row inward. Steps of 2 cells. */
const CORNER_LARGE = [5, 5, 3, 3, 1, 1];
const CORNER_SMALL = [4, 4, 2, 2];

/** The width of the first row of the tail. Each row below is 2 cells shorter. */
const TAIL_FIRST_WIDTH_LARGE = 12;
const TAIL_FIRST_WIDTH_SMALL = 10;

function corner(bubble: Bubble) {
  return bubble.size > 30 ? CORNER_LARGE : CORNER_SMALL;
}

function tailFirstWidth(bubble: Bubble) {
  return bubble.size > 30 ? TAIL_FIRST_WIDTH_LARGE : TAIL_FIRST_WIDTH_SMALL;
}

/** The number of rows of the tail. */
export function tailRows(bubble: Bubble) {
  return tailFirstWidth(bubble) / 2;
}

/** The height of the box and the tail together. */
export function bubbleHeight(bubble: Bubble) {
  return bubble.size + tailRows(bubble);
}

/**
 * The bubbles for a number of guests. One guest is centred on the seam. Two
 * guests have one bubble on each half, the left one higher, with the tails
 * pointing outward. Three guests have three smaller bubbles in a row, the one
 * in the middle lower.
 */
export function bubbleLayout(count: number): Bubble[] {
  if (count <= 1) return [{ x: 27, y: 3, size: 46, tail: 'left' }];
  if (count === 2) {
    return [
      { x: 8, y: 3, size: 38, tail: 'left' },
      { x: 54, y: 7, size: 38, tail: 'right' },
    ];
  }
  return [
    { x: 6, y: 6, size: 26, tail: 'left' },
    { x: 37, y: 18, size: 26, tail: 'left' },
    { x: 68, y: 6, size: 26, tail: 'right' },
  ].slice(0, count) as Bubble[];
}

/** One row of cells: from column `from` (included) to column `to` (excluded). */
type Run = { y: number; from: number; to: number };

/** The rows of the shape of a bubble, as runs of whole cells. */
export function bubbleRuns(bubble: Bubble): Run[] {
  const { x, y, size } = bubble;
  const steps = corner(bubble);
  const runs: Run[] = [];

  for (let row = 0; row < size; row++) {
    const fromTop = steps[row] ?? 0;
    const fromBottom = steps[size - 1 - row] ?? 0;
    const inset = Math.max(fromTop, fromBottom);
    runs.push({ y: y + row, from: x + inset, to: x + size - inset });
  }

  const first = tailFirstWidth(bubble);
  const offset = steps[0]! + 2;
  for (let row = 0; row < tailRows(bubble); row++) {
    const width = first - row * 2;
    const from = bubble.tail === 'left' ? x + offset : x + size - offset - width;
    runs.push({ y: y + size + row, from, to: from + width });
  }
  return runs;
}

function runsPath(runs: Run[]) {
  return runs
    .map((run) => `M${run.from} ${run.y}h${run.to - run.from}v1h${run.from - run.to}z`)
    .join('');
}

/** The path of a bubble: one rectangle for each row, so all the edges are on cell lines. */
export function bubblePath(bubble: Bubble) {
  return runsPath(bubbleRuns(bubble));
}

/** The width of the frame around the portrait, in cells. */
const FRAME = 2;

/** The square of the portrait in a bubble. */
export function photoBox(bubble: Bubble) {
  return { x: bubble.x + FRAME, y: bubble.y + FRAME, size: bubble.size - FRAME * 2 };
}

/** The path of the portrait: the box without the frame, with corners that follow the bubble. */
export function photoPath(bubble: Bubble) {
  const { x, y, size } = photoBox(bubble);
  // The corner of the portrait is the corner of the bubble, 2 cells smaller.
  const steps = corner(bubble).map((inset) => Math.max(inset - FRAME, 0));
  const runs: Run[] = [];
  for (let row = 0; row < size; row++) {
    const inset = Math.max(steps[row] ?? 0, steps[size - 1 - row] ?? 0);
    runs.push({ y: y + row, from: x + inset, to: x + size - inset });
  }
  return runsPath(runs);
}

/** The point of the tail of a bubble, in cells. The bubble grows from this point when it arrives. */
export function tailTip(bubble: Bubble) {
  const offset = corner(bubble)[0]! + 2;
  return {
    x: bubble.tail === 'left' ? bubble.x + offset : bubble.x + bubble.size - offset,
    y: bubble.y + bubbleHeight(bubble),
  };
}

/*
 * The reply: a small flat bubble on the ink half, with three dots. It is the
 * sign that the other person of the chat writes an answer. Only a cover with
 * one guest has room for it.
 */
const REPLY = { x: 77, y: 32, width: 16, height: 10 };
const REPLY_CORNER = [2, 1];
const REPLY_TAIL_WIDTHS = [6, 4, 2];

/** The path of the reply bubble. Its tail points down and to the right. */
export function replyPath() {
  const { x, y, width, height } = REPLY;
  const runs: Run[] = [];
  for (let row = 0; row < height; row++) {
    const inset = Math.max(REPLY_CORNER[row] ?? 0, REPLY_CORNER[height - 1 - row] ?? 0);
    runs.push({ y: y + row, from: x + inset, to: x + width - inset });
  }
  const right = x + width - 3;
  REPLY_TAIL_WIDTHS.forEach((tailWidth, row) => {
    runs.push({ y: y + height + row, from: right - tailWidth, to: right });
  });
  return runsPath(runs);
}

/** The three dots of the reply bubble. Each dot is a square of 2 cells. */
export const replyDots = [0, 1, 2].map((index) => ({
  x: REPLY.x + 3 + index * 4,
  y: REPLY.y + 4,
  size: 2,
}));
