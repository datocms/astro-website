import { onEnterViewport, prefersReducedMotion } from './inView';

/**
 * Typewriter animation.
 *
 * The element contains the final content in a `[data-tw-final]` child.
 * That child stays in the layout with its full text, thus it keeps the
 * final size and assistive technology reads the full text. The script
 * hides the characters that are not typed yet with a CSS highlight
 * (`::highlight(typewriterHidden)`, `color: transparent`). The text stays
 * one text node, thus the kerning does not change when the animation
 * ends. An `aria-hidden` cursor is a child of the element.
 *
 * The steps must follow the order of the final text. Whitespace in the
 * final markup is not important: a step matches the non-whitespace
 * characters only.
 */

export type Frame = string | { text: string; ms: number };

export type Step =
  /**
   * Show the characters of `text`, one at a time. `speedCps: 0` shows all
   * of them immediately. `rhythm: 'human'` types in bursts: each word
   * starts slow and gets fast, a space takes longer, a punctuation mark
   * stops the hand, and some words start with a hesitation. The speed is
   * then the mean speed.
   */
  | { type: 'text'; text: string; speedCps?: number; rhythm?: 'even' | 'human' }
  /** Show a sequence of glyphs in the cursor, at the current position. */
  | { type: 'cursor'; glyphs: Frame[]; msPerGlyph?: number }
  | { type: 'pause'; ms: number }
  /**
   * Show a sequence of faces in the cursor. If the last frame is the same
   * as the next characters of the final text, those characters become
   * visible and the cursor goes away.
   */
  | { type: 'face'; frames: Frame[]; msPerFrame?: number }
  /**
   * Show random words from `words` in the cursor, one every `every` ms,
   * for `ms` ms. Then the next word of the final text becomes visible.
   */
  | { type: 'shuffle'; words: string[]; ms: number; every?: number; final: string }
  /** Hide the cursor. With `fadeMs`, the cursor fades out in that time. */
  | { type: 'hideCursor'; fadeMs?: number }
  /** Send a `typewriter:mark` event with `name` in `detail`, thus other parts can follow the script. */
  | { type: 'mark'; name: string };

export interface TypewriteOptions {
  /** The cursor glyph while typing. An empty string shows a bar (CSS). */
  cursor?: string;
  /** Random variation of each character delay (0.4 = ±40%). */
  jitter?: number;
  defaultCps?: number;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const isSpace = (ch: string) => /\s/.test(ch);

function frameOf(frame: Frame, fallbackMs: number) {
  return typeof frame === 'string' ? { text: frame, ms: fallbackMs } : frame;
}

/** One character of the final text: its text node and its offsets. */
interface CharPos {
  node: Text;
  /** UTF-16 offset of the character in `node`. */
  start: number;
  end: number;
  kind: 'glyph' | 'space';
}

/** The characters of every text node under `root`, in document order. */
function collectChars(root: Node): CharPos[] {
  const chars: CharPos[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    let offset = 0;
    for (const ch of node.data) {
      chars.push({
        node,
        start: offset,
        end: offset + ch.length,
        kind: isSpace(ch) ? 'space' : 'glyph',
      });
      offset += ch.length;
    }
  }
  return chars;
}

const HIGHLIGHT_NAME = 'typewriterHidden';

/**
 * The highlight that hides the characters not typed yet. One highlight
 * for all the typewriters of the page; each one adds its own range.
 * `null` when the browser has no CSS Custom Highlight API.
 */
function hiddenHighlight(): Highlight | null {
  if (typeof CSS === 'undefined' || !('highlights' in CSS) || typeof Highlight === 'undefined') {
    return null;
  }
  let highlight = CSS.highlights.get(HIGHLIGHT_NAME);
  if (!highlight) {
    highlight = new Highlight();
    CSS.highlights.set(HIGHLIGHT_NAME, highlight);
  }
  return highlight;
}

export function typewrite(
  el: HTMLElement,
  steps: Step[],
  { cursor: cursorGlyph = '', jitter = 0.4, defaultCps = 80 }: TypewriteOptions = {},
): Promise<void> {
  const finalEl = el.querySelector<HTMLElement>('[data-tw-final]');
  if (!finalEl) return Promise.resolve();

  const highlight = hiddenHighlight();
  if (prefersReducedMotion() || !highlight) {
    el.dataset.twState = 'done';
    return Promise.resolve();
  }

  const chars = collectChars(finalEl);
  const lastChar = chars[chars.length - 1];

  const cursor = document.createElement('span');
  cursor.dataset.twCursor = '';
  cursor.setAttribute('aria-hidden', 'true');

  /** Show `text` in the cursor. An empty string shows the bar. */
  const setGlyph = (text: string) => {
    cursor.textContent = text;
    cursor.toggleAttribute('data-tw-bar', text === '');
  };
  setGlyph(cursorGlyph);

  let index = 0;
  let last: CharPos | null = null;

  /** The range of the characters not typed yet, in the highlight. */
  let hidden: Range | null = null;

  /**
   * Hide the characters from `index` to the end. A new range each time:
   * every browser repaints when a range is added to a highlight.
   */
  const updateHidden = () => {
    if (hidden) highlight.delete(hidden);
    hidden = null;
    const first = chars[index];
    if (!first || !lastChar) return;
    hidden = new Range();
    hidden.setStart(first.node, first.start);
    hidden.setEnd(lastChar.node, lastChar.end);
    highlight.add(hidden);
  };

  /** The rectangle of one character, from a range. */
  const measure = new Range();
  const rectOf = (c: CharPos) => {
    measure.setStart(c.node, c.start);
    measure.setEnd(c.node, c.end);
    return measure.getBoundingClientRect();
  };

  // Hide the text before it shows: the CSS keeps it invisible until the
  // state is set.
  updateHidden();
  el.appendChild(cursor);
  el.dataset.twState = 'running';

  /**
   * Put the cursor after the last visible character. With `atNext`, put
   * it on the next glyph instead: a word or face that replaces the next
   * characters then starts on the correct line.
   */
  const place = (atNext = false) => {
    const base = el.getBoundingClientRect();
    const next = atNext ? chars.slice(index).find((c) => c.kind === 'glyph') : undefined;
    const ref = next ?? last ?? chars[0];
    if (!ref) return;
    const rect = rectOf(ref);
    cursor.style.left = `${(ref === last && !next ? rect.right : rect.left) - base.left}px`;
    cursor.style.top = `${rect.top - base.top}px`;
    // The cursor is a child of the element. The characters can be in a
    // child with a different type style, thus copy their font.
    const style = getComputedStyle(ref.node.parentElement ?? finalEl);
    cursor.style.color = style.color;
    // The computed `font` shorthand can be empty, thus copy each property.
    for (const prop of ['font-family', 'font-size', 'font-weight', 'letter-spacing'] as const) {
      cursor.style.setProperty(prop, style.getPropertyValue(prop));
    }
    // The rectangle of a range is the content area of the glyphs, not
    // the line box. A line height equal to that height puts the glyphs
    // of the cursor at the same top and baseline as the text.
    cursor.style.lineHeight = `${rect.height}px`;
  };

  /** Show whitespace characters up to the next glyph. */
  const flushSpaces = () => {
    let moved = false;
    while (index < chars.length && chars[index]!.kind === 'space') {
      last = chars[index]!;
      index += 1;
      moved = true;
    }
    if (moved) updateHidden();
  };

  /** Show the next `count` glyphs, and the spaces between them. */
  const revealGlyphs = (count: number) => {
    for (let i = 0; i < count; i += 1) {
      flushSpaces();
      if (index >= chars.length) return;
      last = chars[index]!;
      index += 1;
    }
    updateHidden();
  };

  const glyphCount = (text: string) => [...text].filter((ch) => !isSpace(ch)).length;

  const delayFor = (cps: number) => (1000 / cps) * (1 + (Math.random() * 2 - 1) * jitter);

  /** A random number from a normal distribution (Box-Muller). */
  const gaussian = () => {
    const u = 1 - Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  /**
   * The delay after `ch` when a person types. `wordPos` is the position
   * of `ch` in its word, and `prev` is the character before it. The
   * intervals between the keys of a person are not symmetric: most are
   * short and some are long. A log-normal jitter gives that shape.
   */
  const humanDelayFor = (cps: number, ch: string, prev: string, wordPos: number) => {
    const base = 1000 / cps;
    let factor: number;
    if (isSpace(ch)) {
      // The hand moves to the next word. After a full stop, the stop
      // itself is the long wait.
      factor = /[.!?:]/.test(prev) ? 1 : 1.6 + Math.random() * 0.8;
    } else if (/[.!?:]/.test(ch)) {
      factor = 5;
    } else if (/[,;]/.test(ch)) {
      factor = 2.5;
    } else if (/[-–—/]/.test(ch)) {
      factor = 1.8;
    } else if (wordPos === 0) {
      // The first key of a word is slow, a capital more (shift).
      factor = ch === ch.toUpperCase() && ch !== ch.toLowerCase() ? 1.5 : 1.2;
    } else if (wordPos >= 2) {
      // The rest of the word is a burst.
      factor = 0.8;
    } else {
      factor = 1;
    }
    let delay = base * factor * Math.exp(0.3 * gaussian());
    // Some words start with a hesitation, but not the first word.
    if (wordPos === 0 && prev !== '' && !isSpace(ch) && Math.random() < 0.08) {
      delay += base * (4 + Math.random() * 4);
    }
    return delay;
  };

  const run = async () => {
    place();
    for (const step of steps) {
      switch (step.type) {
        case 'pause':
          // The bar blinks while the typing stops.
          cursor.dataset.twIdle = '';
          await sleep(step.ms);
          delete cursor.dataset.twIdle;
          break;
        case 'mark':
          el.dispatchEvent(
            new CustomEvent('typewriter:mark', { bubbles: true, detail: step.name }),
          );
          break;
        case 'hideCursor':
          if (step.fadeMs) {
            cursor.style.transition = `opacity ${step.fadeMs}ms ease-out`;
            cursor.style.opacity = '0';
            await sleep(step.fadeMs);
            cursor.style.transition = '';
            cursor.style.opacity = '';
          }
          cursor.style.visibility = 'hidden';
          break;
        case 'cursor':
          for (const f of step.glyphs) {
            const { text, ms } = frameOf(f, step.msPerGlyph ?? 75);
            setGlyph(text);
            await sleep(ms);
          }
          setGlyph(cursorGlyph);
          break;
        case 'text': {
          const cps = step.speedCps ?? defaultCps;
          const human = step.rhythm === 'human';
          setGlyph(cursorGlyph);
          cursor.style.visibility = 'visible';
          let prev = '';
          let wordPos = 0;
          for (const ch of step.text) {
            if (isSpace(ch)) {
              flushSpaces();
              wordPos = 0;
            } else {
              revealGlyphs(1);
            }
            place();
            if (cps > 0) {
              await sleep(
                human ? humanDelayFor(cps, ch, prev, isSpace(ch) ? 0 : wordPos) : delayFor(cps),
              );
            }
            if (!isSpace(ch)) wordPos += 1;
            prev = ch;
          }
          break;
        }
        case 'face': {
          cursor.style.visibility = 'visible';
          place(true);
          let lastText = '';
          for (const f of step.frames) {
            const { text, ms } = frameOf(f, step.msPerFrame ?? 120);
            setGlyph(text);
            lastText = text;
            await sleep(ms);
          }
          if (lastText && matchesNext(lastText)) {
            revealGlyphs(glyphCount(lastText));
            cursor.style.visibility = 'hidden';
            setGlyph(cursorGlyph);
            place();
          }
          break;
        }
        case 'shuffle': {
          cursor.style.visibility = 'visible';
          flushSpaces();
          place(true);
          const every = step.every ?? 100;
          const end = performance.now() + step.ms;
          let i = 0;
          while (performance.now() < end) {
            setGlyph(step.words[i % step.words.length]!);
            i += 1;
            await sleep(every);
          }
          revealGlyphs(glyphCount(step.final));
          setGlyph(cursorGlyph);
          place();
          break;
        }
      }
    }
  };

  /** True if the next glyphs of the final text are the glyphs of `text`. */
  const matchesNext = (text: string) => {
    const wanted = [...text].filter((ch) => !isSpace(ch)).join('');
    let got = '';
    for (let i = index; i < chars.length && got.length < wanted.length; i += 1) {
      const c = chars[i]!;
      if (c.kind === 'glyph') got += c.node.data.slice(c.start, c.end);
    }
    return got === wanted;
  };

  const onResize = () => place();
  window.addEventListener('resize', onResize);

  return run().finally(() => {
    window.removeEventListener('resize', onResize);
    if (hidden) highlight.delete(hidden);
    cursor.remove();
    el.dataset.twState = 'done';
    el.dispatchEvent(new CustomEvent('typewriter:done', { bubbles: true }));
  });
}

export type TypewriterStart = 'load' | 'view' | 'manual';

/**
 * Connects every `[data-typewriter]` element in the page that is not
 * connected yet. The `Typewriter` component calls it.
 * A `manual` element starts on the `typewriter:start` event.
 */
export function initTypewriters(root: ParentNode = document) {
  for (const el of root.querySelectorAll<HTMLElement>('[data-typewriter]:not([data-tw-armed])')) {
    el.dataset.twArmed = '';
    const steps = JSON.parse(el.dataset.typewriter || '[]') as Step[];
    const start = (el.dataset.twStart || 'view') as TypewriterStart;
    const delay = Number(el.dataset.twDelay || 0);
    let started = false;
    const play = () => {
      if (started) return;
      started = true;
      setTimeout(() => typewrite(el, steps), delay);
    };
    if (start === 'load') play();
    else if (start === 'view') {
      onEnterViewport(el, play, {
        threshold: Number(el.dataset.twThreshold || 0),
        rootMargin: el.dataset.twRootMargin || '0px',
      });
    }
    el.addEventListener('typewriter:start', play);
  }
}
