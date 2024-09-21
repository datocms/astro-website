import HTMLParsedElement from 'html-parsed-element';

export class WebComponent extends HTMLParsedElement {
  eventListenerRemovers: Array<() => void> = [];

  $$<T extends HTMLElement>(selector: string): T[] {
    return Array.from(this.querySelectorAll<T>(selector));
  }

  $<T extends HTMLElement>(selector: string): T {
    const element = this.querySelector<T>(selector);

    if (!element) {
      throw new Error(`[${this.localName}]: Could not find ${selector}`);
    }

    return element;
  }

  on<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
    element: T,
    event: K,
    callback: (event: HTMLElementEventMap[K], element: T) => void,
  ): () => void;

  on<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    element: HTMLElement,
    event: K,
    selector: string,
    callback: (event: HTMLElementEventMap[K], element: T) => void,
  ): () => void;

  on<E extends CustomEvent, T extends HTMLElement>(
    element: T,
    event: string,
    callback: (event: E, element: T) => void,
  ): () => void;

  on<E extends CustomEvent, T extends HTMLElement = HTMLElement>(
    element: HTMLElement,
    event: string,
    selector: string,
    callback: (event: E, element: T) => void,
  ): () => void;

  on(element: HTMLElement, event: string, ...args: any[]): () => void {
    const callback = args.length === 1 ? args[0] : args[1];
    const selector = args.length === 1 ? undefined : args[0];

    const callbackWrapper = (e: Event) => {
      if (selector) {
        const hit = this.findClosestAncestor({
          startFrom: e.target as HTMLElement,
          upTo: element,
          selector,
        });

        if (hit) {
          callback.call(this, e, hit);
        }
      } else {
        callback.call(this, e, element);
      }
    };
    element.addEventListener(event, callbackWrapper);

    const remover = () => {
      element.removeEventListener(event, callbackWrapper);
      this.eventListenerRemovers = this.eventListenerRemovers.filter((r) => r !== remover);
    };

    return remover;
  }

  findClosestAncestor({
    startFrom,
    upTo,
    selector,
  }: {
    startFrom: HTMLElement;
    upTo: HTMLElement;
    selector: string;
  }): HTMLElement | null {
    let currentElement: HTMLElement | null = startFrom;

    while (currentElement && currentElement !== upTo.parentElement) {
      if (currentElement.matches(selector)) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }

    // Check the 'upTo' element itself
    if (upTo.matches(selector)) {
      return upTo;
    }

    // If no match is found
    return null;
  }

  disconnectedCallback() {
    for (const remover of this.eventListenerRemovers) {
      remover();
    }
  }
}
