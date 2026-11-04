// The <logo-plate> element: the logo of a partner on a white plate, that
// develops when the plate comes into view (see Component.astro). The
// development is in `~/lib/pixel-develop`: the `ink` mode keeps the full
// colours of the logo, thus the white of the plate does not make them pale.

import { developWhenInView } from '~/lib/pixel-develop';
import { WebComponent } from '~/lib/WebComponent';

export const TAG = 'logo-plate';

export class LogoPlateElement extends WebComponent {
  parsedCallback() {
    developWhenInView(this, {
      src: this.dataset.src!,
      canvas: this.$<HTMLCanvasElement>('canvas'),
      mode: 'ink',
      fit: 'contain',
    });
  }
}

export function defineLogoPlate() {
  if (!customElements.get(TAG)) customElements.define(TAG, LogoPlateElement);
}
