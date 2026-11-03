// The <contact-card> element (see Component.astro). Floating UI sets the
// position of the card while it is open. The anchor is the parent element
// of the card: the button, or the text of the page closer. The position is fixed, thus a
// parent with `overflow: hidden` does not cut the card. The card stays in
// the viewport, and goes below the host when there is no space above.

import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
  type Placement,
} from '@floating-ui/dom';
import { WebComponent } from '~/lib/WebComponent';

export const TAG = 'contact-card';

class ContactCard extends WebComponent {
  private host: HTMLElement | null = null;
  private anchor: HTMLElement | null = null;
  private cleanup: (() => void) | null = null;

  parsedCallback() {
    // The host is the link that contains the card.
    const host = this.closest<HTMLElement>('[data-contact-host]');
    if (!host) throw new Error(`[${TAG}]: Could not find [data-contact-host]`);
    this.host = host;
    this.anchor = this.parentElement;

    // Touch has no hover: the link goes straight to its page.
    if (matchMedia('(hover: hover)').matches) {
      this.on(host, 'mouseenter', this.show);
      this.on(host, 'mouseleave', this.hide);
    }
    this.on(host, 'focusin', () => {
      if (host.matches(':focus-visible')) this.show();
    });
    this.on(host, 'focusout', this.hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.hide();
  }

  private show = () => {
    if (this.cleanup || !this.anchor) return;
    const anchor = this.anchor;
    const start = (this.dataset.placement ?? 'top-start') as Placement;

    this.cleanup = autoUpdate(anchor, this, async () => {
      const { x, y, placement, middlewareData } = await computePosition(anchor, this, {
        placement: start,
        strategy: 'fixed',
        middleware: [offset(8), flip({ padding: 16 }), shift({ padding: 16 }), hide()],
      });

      Object.assign(this.style, { left: `${x}px`, top: `${y}px` });
      this.dataset.side = placement.split('-')[0];
      // Open after the first position, thus the card does not jump.
      if (middlewareData.hide?.referenceHidden) delete this.dataset.open;
      else this.dataset.open = '';
    });
  };

  private hide = () => {
    delete this.dataset.open;
    this.cleanup?.();
    this.cleanup = null;
  };
}

export function defineContactCard() {
  if (!customElements.get(TAG)) customElements.define(TAG, ContactCard);
}
