import { parse, type HTMLElement } from 'node-html-parser';

export type TabsHtmlItem =
  | { type: 'html'; content: string }
  | { type: 'tabs'; tabs: Array<{ title: string; html: string }> };

export function parseTabsInHtml(html: string): TabsHtmlItem[] {
  const root = parse(html);
  const container: HTMLElement = (root.querySelector('body') as HTMLElement) ?? root;

  const items: TabsHtmlItem[] = [];
  let buffer = '';

  const flushBuffer = () => {
    if (buffer.trim()) {
      items.push({ type: 'html', content: buffer });
      buffer = '';
    }
  };

  for (const node of container.childNodes) {
    if (node.nodeType === 1) {
      const element = node as HTMLElement;

      if (element.tagName.toLowerCase() === 'tabs-placeholder') {
        flushBuffer();
        const tabs: Array<{ title: string; html: string }> = [];
        for (const child of element.childNodes) {
          if (child.nodeType !== 1) continue;
          const tabEl = child as HTMLElement;
          if (tabEl.tagName.toLowerCase() !== 'tab-placeholder') continue;
          tabs.push({
            title: tabEl.getAttribute('data-title') || '',
            html: tabEl.innerHTML,
          });
        }
        if (tabs.length > 0) items.push({ type: 'tabs', tabs });
      } else {
        buffer += element.outerHTML;
      }
    } else if (node.nodeType === 3) {
      buffer += node.textContent;
    }
  }

  flushBuffer();
  return items;
}
