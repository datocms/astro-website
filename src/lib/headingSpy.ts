/**
 * Find the heading that the visitor reads, for a table of contents. The
 * heading is the last one whose top is above the read line. At the end of
 * the page, the last heading in the viewport is the one that the visitor
 * reads, also when its top does not get to the line. Before the first
 * heading, the result is the fallback link (or null).
 */

/** A heading is the one that the visitor reads when its top is above this part of the viewport height. */
const READ_LINE = 0.3;

interface Options {
  /** The links of the table of contents. A link to an id that is not on the page is ignored. */
  links: HTMLAnchorElement[];
  /** The link to mark before the first heading. */
  fallback?: HTMLAnchorElement | null;
  /** Stops the listeners. */
  signal: AbortSignal;
  /** Runs at the start and each time that the link changes. */
  onChange: (link: HTMLAnchorElement | null) => void;
}

export function spyHeadings({ links, fallback = null, signal, onChange }: Options) {
  const entries = links.flatMap((link) => {
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    return heading ? [{ link, heading }] : [];
  });

  let frame = 0;
  let active: HTMLAnchorElement | null | undefined;

  const find = () => {
    const line = window.innerHeight * READ_LINE;
    const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    let found: HTMLAnchorElement | null = null;

    for (const { link, heading } of entries) {
      const top = heading.getBoundingClientRect().top;
      if (top <= line || (atEnd && top < window.innerHeight)) found = link;
    }

    return found ?? fallback;
  };

  const update = () => {
    frame = 0;
    const next = find();
    if (next === active) return;
    active = next;
    onChange(next);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', schedule, { passive: true, signal });
  signal.addEventListener('abort', () => cancelAnimationFrame(frame));
}

/**
 * Scroll a list that has its own scroll so that the link is in view, with
 * a margin of two links. Do not scroll the page.
 */
export function revealInList(link: HTMLElement, list: HTMLElement) {
  if (list.scrollHeight <= list.clientHeight) return;

  const linkBox = link.getBoundingClientRect();
  const listBox = list.getBoundingClientRect();
  const margin = linkBox.height * 2;

  if (linkBox.top < listBox.top + margin) {
    list.scrollTop -= listBox.top + margin - linkBox.top;
  } else if (linkBox.bottom > listBox.bottom - margin) {
    list.scrollTop += linkBox.bottom - (listBox.bottom - margin);
  }
}
