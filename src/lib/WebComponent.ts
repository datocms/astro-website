export class WebComponent extends HTMLElement {
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

  on<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    elementOrElements: T | T[],
    event: K,
    callback: (event: HTMLElementEventMap[K], element: T) => void,
  ): () => void {
    const elements = Array.isArray(elementOrElements) ? elementOrElements : [elementOrElements];
    const removers: Array<() => void> = [];

    for (const element of elements) {
      const callbackWrapper = (e: HTMLElementEventMap[K]) => {
        callback.call(this, e, element);
      };
      element.addEventListener(event, callbackWrapper);

      const remover = () => {
        element.removeEventListener(event, callbackWrapper);
        this.eventListenerRemovers = this.eventListenerRemovers.filter((r) => remover !== r);
      };

      removers.push(remover);
    }

    return () => {
      for (const remover of removers) {
        remover();
      }
    };
  }

  disconnectedCallback() {
    for (const remover of this.eventListenerRemovers) {
      remover();
    }
  }
}
