import { WebComponent } from '~/lib/WebComponent';

const DONE_MS = 1000;

let liveRegion: HTMLElement | undefined;

/** One live region for the page: a page can have hundreds of anchors. */
function getLiveRegion() {
  if (!liveRegion) {
    liveRegion = document.createElement('span');
    liveRegion.className = 'visuallyHidden';
    liveRegion.setAttribute('role', 'status');
    document.body.append(liveRegion);
  }

  return liveRegion;
}

customElements.define(
  'heading-anchor',
  class extends WebComponent {
    #timer: ReturnType<typeof setTimeout> | undefined;

    parsedCallback() {
      const link = this.$<HTMLAnchorElement>('a');
      const status = getLiveRegion();

      // The browser also follows the link: the address gets the hash.
      this.on(link, 'click', () => void this.#copy(link.href, status));
    }

    async #copy(url: string, status: HTMLElement) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // The address of the page has the link: the visitor can copy it there.
        return;
      }

      this.toggleAttribute('data-copied', true);
      status.textContent = 'Link copied';
      clearTimeout(this.#timer);
      this.#timer = setTimeout(() => {
        this.toggleAttribute('data-copied', false);
        status.textContent = '';
      }, DONE_MS);
    }
  },
);
