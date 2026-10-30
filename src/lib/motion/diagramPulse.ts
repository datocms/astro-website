/*
 * The pulse of a diagram that follows the edges of its parts (the frames
 * of src/scenes/ that use src/scenes/diagram/style.module.css). It goes
 * around a part, along the line to the next part, around it, and so on.
 * At each part it goes in two: one dash on each side, and the two meet
 * again at the other side. The script draws the two paths in an svg over
 * the parts, and removes them at the end. `linePulse` is the plain pulse
 * of the same svg: one dash along the line from one part to the next;
 * `pathPulse` is one dash along a path that the scene gives.
 */
import { DIAGRAM_MS } from './diagramLoop';

// The length of the dash of the pulse, in px
const DASH = 40;
// The speed of the pulse, in px for each ms, and the limits of its time
const SPEED = 0.3;
/** The speed of a pulse with no given time, in px for each ms: a scene can give its own path the same speed */
export const PULSE_SPEED = SPEED;
const TRAVEL_MIN = 1.6 * DIAGRAM_MS.travel;
const TRAVEL_MAX = 3 * DIAGRAM_MS.travel;
const SVG = 'http://www.w3.org/2000/svg';

/** A box in px of the root */
type Box = { left: number; top: number; right: number; bottom: number; r: number };

export interface EdgePulseOptions {
  /** The box of the diagram. The svg `trace` covers it, with no viewBox: its units are px of `root`. */
  root: HTMLElement;
  /** The svg of the pulse, over the parts. Its `data-pulse-class` is the class of the pulse of the grammar. */
  trace: SVGSVGElement;
  /**
   * The svg of the track. Its middle is the axis of the pulse. The track
   * is vertical when its `[data-axis="x"]` does not show, or when
   * `vertical` is true.
   */
  links: Element;
  /** The track is vertical. Without it, `[data-axis="x"]` of `links` tells. */
  vertical?: boolean;
  /** The parts, in the order of the pulse */
  parts: Element[];
  /** The space between the pulse and the edge of `part`, in px */
  out: (part: Element) => number;
  /**
   * The pulse starts at the far side of the first part, on the axis of
   * the track, and does not go around it
   */
  fromEnd?: boolean;
  /**
   * The pulse goes up (or to the left on a horizontal track): the parts
   * are in the order of the pulse, from the bottom (or the right)
   */
  backward?: boolean;
}

/** The parts of an `EdgePulseOptions` that `linePulse` uses, and its two parts */
export interface LinePulseOptions extends Pick<
  EdgePulseOptions,
  'root' | 'trace' | 'links' | 'vertical' | 'backward'
> {
  /** The part where the pulse starts: at its far side */
  from: Element;
  /** The part where the pulse stops: at its near side */
  to: Element;
}

/**
 * The half of the edge of `b` from the point where the pulse comes in (at
 * `c` on the axis across the line) to the point on the other side where
 * the two halves meet (the mirror of `c`, thus the two halves have the
 * same length): over the top (`a`) or under the bottom when the line is
 * horizontal, on the left (`a`) or the right when it is vertical. The path
 * is already at its start.
 */
function half(b: Box, vertical: boolean, a: boolean, c: number): string {
  const { left: l, top: t, right: rt, bottom: bt } = b;
  const r = Math.min(b.r, (rt - l) / 2, (bt - t) / 2);
  if (!vertical) {
    const m = t + bt - c;
    return a
      ? `L ${l} ${t + r} A ${r} ${r} 0 0 1 ${l + r} ${t} L ${rt - r} ${t} A ${r} ${r} 0 0 1 ${rt} ${t + r} L ${rt} ${m}`
      : `L ${l} ${bt - r} A ${r} ${r} 0 0 0 ${l + r} ${bt} L ${rt - r} ${bt} A ${r} ${r} 0 0 0 ${rt} ${bt - r} L ${rt} ${m}`;
  }
  const m = l + rt - c;
  return a
    ? `L ${l + r} ${t} A ${r} ${r} 0 0 0 ${l} ${t + r} L ${l} ${bt - r} A ${r} ${r} 0 0 0 ${l + r} ${bt} L ${m} ${bt}`
    : `L ${rt - r} ${t} A ${r} ${r} 0 0 1 ${rt} ${t + r} L ${rt} ${bt - r} A ${r} ${r} 0 0 1 ${rt - r} ${bt} L ${m} ${bt}`;
}

/** The point of `b` where the pulse comes in (`start`), or where it goes out, at `c` on the axis across the line */
function end(b: Box, vertical: boolean, start: boolean, c: number): [number, number] {
  if (vertical) return [start ? c : b.left + b.right - c, start ? b.top : b.bottom];
  return [start ? b.left : b.right, start ? c : b.top + b.bottom - c];
}

/**
 * The box of `el` in px of `root`, `out` px out of its edge. `root` can be
 * in a zoomed box: the scale makes the screen px into px of `root`.
 */
export function partBox(root: HTMLElement, el: Element, out = 0): Box {
  const frame = root.getBoundingClientRect();
  const scale = frame.width / root.offsetWidth || 1;
  const rect = el.getBoundingClientRect();
  return {
    left: (rect.left - frame.left) / scale - out,
    top: (rect.top - frame.top) / scale - out,
    right: (rect.right - frame.left) / scale + out,
    bottom: (rect.bottom - frame.top) / scale + out,
    r: (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) + out,
  };
}

const box = partBox;

/** Tells if the track `links` is vertical */
function isVertical(links: Element, vertical?: boolean): boolean {
  if (vertical !== undefined) return vertical;
  const x = links.querySelector('[data-axis="x"]');
  return !!x && getComputedStyle(x).display === 'none';
}

/**
 * A pulse that goes up (or to the left) is a pulse that goes down in a
 * mirror: the boxes go in the mirror, the script draws the path there,
 * and the transform of the path (`MIRROR`) puts it back. The axis across
 * the track does not change.
 */
function mirror(b: Box, vertical: boolean): Box {
  return vertical
    ? { ...b, top: -b.bottom, bottom: -b.top }
    : { ...b, left: -b.right, right: -b.left };
}

const MIRROR = { vertical: 'matrix(1 0 0 -1 0 0)', horizontal: 'matrix(-1 0 0 1 0 0)' };

/**
 * Draws the path `d` in `trace` with the class of the pulse, and moves one
 * dash along it, one time, in `duration` ms (or at the speed of the pulse
 * when `duration` is not given). The path goes at the end.
 */
function run(
  trace: SVGSVGElement,
  d: string,
  transform: string | null,
  duration?: number,
): Promise<unknown> {
  const path = document.createElementNS(SVG, 'path');
  path.setAttribute('class', trace.dataset.pulseClass ?? '');
  path.setAttribute('d', d);
  if (transform) path.setAttribute('transform', transform);
  trace.append(path);
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${DASH} ${length + DASH}`;
  path.style.strokeDashoffset = `${DASH}`;
  const animation = path.animate([{ strokeDashoffset: DASH }, { strokeDashoffset: -length }], {
    duration: duration ?? Math.min(TRAVEL_MAX, Math.max(TRAVEL_MIN, length / SPEED)),
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    fill: 'forwards',
  });
  animation.finished.then(
    () => path.remove(),
    () => path.remove(),
  );
  return animation.finished;
}

/**
 * Sends one dash along the path `d` (in px of the root of `trace`), one
 * time, in `duration` ms, or at the speed of the pulse when `duration` is
 * not given. A scene uses it for a track of its own that is not a line
 * between two parts (the branch of the image lab). The promise resolves
 * when the dash is at the end.
 */
export async function pathPulse(trace: SVGSVGElement, d: string, duration?: number): Promise<void> {
  await Promise.allSettled([run(trace, d, null, duration)]);
}

/**
 * Sends one dash along the line, from the far side of `from` to the near
 * side of `to`, in the time of a travel of the grammar. Where the line
 * starts after `from` (the file name under a picture, on phones), the dash
 * starts at the start of the line. The promise resolves when the dash is
 * at the end.
 */
export async function linePulse({
  root,
  trace,
  links,
  from,
  to,
  vertical,
  backward = false,
}: LinePulseOptions): Promise<void> {
  const v = isVertical(links, vertical);
  const flip = (b: Box) => (backward ? mirror(b, v) : b);
  const line = flip(box(root, links, 0));
  const a = flip(box(root, from, 0));
  const b = flip(box(root, to, 0));
  const c = v ? (line.left + line.right) / 2 : (line.top + line.bottom) / 2;
  const d = v
    ? `M ${c} ${Math.max(a.bottom, line.top)} L ${c} ${b.top}`
    : `M ${Math.max(a.right, line.left)} ${c} L ${b.left} ${c}`;
  await Promise.allSettled([
    run(trace, d, backward ? MIRROR[v ? 'vertical' : 'horizontal'] : null, DIAGRAM_MS.travel),
  ]);
}

/**
 * Sends the pulse along the parts, one after the other, with the line
 * between each two: two dashes, one on each side of each part. Each piece
 * of the line is on the axis of the track. A gap in the line (the file
 * name under a picture, on phones) is a move: the pulse goes under it.
 * The promise resolves when the two dashes are at the end.
 */
export async function edgePulse({
  root,
  trace,
  links,
  vertical: v,
  parts,
  out,
  fromEnd = false,
  backward = false,
}: EdgePulseOptions): Promise<void> {
  const vertical = isVertical(links, v);
  const flip = (b: Box) => (backward ? mirror(b, vertical) : b);
  const line = flip(box(root, links, 0));
  const c = vertical ? (line.left + line.right) / 2 : (line.top + line.bottom) / 2;
  const boxes = parts.map((part) => flip(box(root, part, out(part))));
  const transform = backward ? MIRROR[vertical ? 'vertical' : 'horizontal'] : null;
  const animations = [true, false].map((a) => {
    let d = '';
    boxes.forEach((b, i) => {
      const [x, y] = end(b, vertical, true, c);
      if (i === 0 && fromEnd) {
        // On the axis: the line from the first part is straight
        d += vertical ? `M ${c} ${b.bottom} ` : `M ${b.right} ${c} `;
        return;
      }
      if (i === 0) d += `M ${x} ${y} `;
      else {
        // The line comes from the end of the track when the part before is far from it (the gap of the file name)
        const prev = end(boxes[i - 1]!, vertical, false, c);
        const gap = vertical ? line.top - prev[1] : line.left - prev[0];
        if (i === 1 && gap > 4) d += vertical ? `M ${x} ${line.top} ` : `M ${line.left} ${y} `;
        d += `L ${x} ${y} `;
      }
      d += half(b, vertical, a, c) + ' ';
    });
    return run(trace, d, transform);
  });
  await Promise.allSettled(animations);
}
