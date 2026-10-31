/**
 * The base class of the client custom elements. The site loads each
 * client script as a module, and a module runs after the parser has
 * built the page. Thus the children are parsed when the element connects.
 */
export class WebComponent extends HTMLElement {
  eventListenerRemovers: Array<() => void> = [];
  #ready = false;

  /** Subclasses put their setup here. The children are parsed when it runs. */
  parsedCallback(): void {}

  /**
   * Run the setup one time, when the element connects for the first time.
   * If the element moves to a different parent, the setup does not run again.
   */
  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    this.parsedCallback();
  }

  /** The elements in this element that match `selector`. `T` can be an SVG element. */
  $$<T extends Element = HTMLElement>(selector: string): T[] {
    return Array.from(this.querySelectorAll<T>(selector));
  }

  /**
   * The first element in this element that matches `selector`. It throws
   * an error when no element matches. `T` can be an SVG element.
   */
  $<T extends Element = HTMLElement>(selector: string): T {
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
    this.eventListenerRemovers.push(remover);

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
    if ('matches' in upTo && upTo.matches(selector)) {
      return upTo;
    }

    // If no match is found
    return null;
  }

  /** Remove each listener that `on()` added or that is in `eventListenerRemovers`. */
  disconnectedCallback() {
    const removers = this.eventListenerRemovers;
    this.eventListenerRemovers = [];
    for (const remover of removers) {
      remover();
    }
  }
}
