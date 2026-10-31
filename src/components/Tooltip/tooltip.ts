// The <dato-tooltip> element (see Component.astro). Floating UI sets the
// position of the bubble while it is open, also when the page scrolls or
// the window changes size.

import { arrow, autoUpdate, computePosition, flip, hide, offset, shift } from '@floating-ui/dom';
import { WebComponent } from '~/lib/WebComponent';

export const TAG = 'dato-tooltip';

const STATIC_SIDE: Record<string, string> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

interface Parts {
  trigger: HTMLElement;
  bubble: HTMLElement;
  arrowElement: HTMLElement | null;
}

class DatoTooltip extends WebComponent {
  private parts: Parts | null = null;
  private cleanup: (() => void) | null = null;

  parsedCallback() {
    const trigger = this.$('[data-trigger]');
    // The arrow is optional.
    this.parts = {
      trigger,
      bubble: this.$('[data-bubble]'),
      arrowElement: this.querySelector<HTMLElement>('[data-arrow]'),
    };

    this.on(trigger, 'mouseenter', this.show);
    this.on(trigger, 'mouseleave', this.hide);
    this.on(this, 'focusin', this.show);
    this.on(this, 'focusout', this.hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.hide();
  }

  private show = () => {
    if (this.cleanup || !this.parts) return;
    const { trigger, bubble, arrowElement } = this.parts;

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
