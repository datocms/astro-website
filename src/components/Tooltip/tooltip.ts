// The <dato-tooltip> element (see Component.astro). Floating UI sets the
// position of the bubble while it is open, also when the page scrolls or
// the window changes size.

import { arrow, autoUpdate, computePosition, flip, hide, offset, shift } from '@floating-ui/dom';

export const TAG = 'dato-tooltip';

const STATIC_SIDE: Record<string, string> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

class DatoTooltip extends HTMLElement {
  private trigger: HTMLElement | null = null;
  private bubble: HTMLElement | null = null;
  private arrowElement: HTMLElement | null = null;
  private cleanup: (() => void) | null = null;

  connectedCallback() {
    this.trigger = this.querySelector('[data-trigger]');
    this.bubble = this.querySelector('[data-bubble]');
    this.arrowElement = this.querySelector('[data-arrow]');
    if (!this.trigger || !this.bubble) return;

    this.trigger.addEventListener('mouseenter', this.show);
    this.trigger.addEventListener('mouseleave', this.hide);
    this.addEventListener('focusin', this.show);
    this.addEventListener('focusout', this.hide);
  }

  disconnectedCallback() {
    this.hide();
  }

  private show = () => {
    const { trigger, bubble, arrowElement } = this;
    if (this.cleanup || !trigger || !bubble) return;

    this.dataset.open = '';
    this.cleanup = autoUpdate(trigger, bubble, async () => {
      const { x, y, placement, middlewareData } = await computePosition(trigger, bubble, {
        placement: 'top',
        strategy: 'fixed',
        middleware: [
          offset(10),
          flip({ fallbackPlacements: ['bottom', 'left', 'right'] }),
          shift({ padding: 10 }),
          ...(arrowElement ? [arrow({ element: arrowElement, padding: 5 })] : []),
          hide(),
        ],
      });

      Object.assign(bubble.style, {
        left: `${x}px`,
        top: `${y}px`,
        visibility: middlewareData.hide?.referenceHidden ? 'hidden' : '',
      });

      if (arrowElement && middlewareData.arrow) {
        const { x: arrowX, y: arrowY } = middlewareData.arrow;
        const staticSide = STATIC_SIDE[placement.split('-')[0]!]!;
        Object.assign(arrowElement.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: `${-arrowElement.offsetWidth / 2}px`,
        });
      }
    });
  };

  private hide = () => {
    delete this.dataset.open;
    this.cleanup?.();
    this.cleanup = null;
  };
}

export function defineTooltip() {
  if (!customElements.get(TAG)) customElements.define(TAG, DatoTooltip);
}
