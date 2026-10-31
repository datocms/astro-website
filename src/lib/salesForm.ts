import { actions } from 'astro:actions';
import { connectExternalForm, fillAccountEmail } from '~/lib/externalForm';
import { WebComponent } from '~/lib/WebComponent';

const TAG = 'sales-form';

/**
 * <sales-form> connects the contact form inside it to the action
 * forms.submitSalesRequest. The form is a ContactForm with the `external`
 * prop. A `[data-turnstile]` box inside the form holds the anti-bot widget.
 * The element has no box of its own: give it `display: contents`.
 */
export class SalesForm extends WebComponent {
  parsedCallback() {
    const root = this.$('[data-contact-form]');

    fillAccountEmail(this.$<HTMLInputElement>('input[name="email"]'));

    connectExternalForm(root, {
      // The same label as the action expects (isTurnstileTokenValid).
      turnstileAction: 'contact',
      fallback: 'email us at sales@datocms.com.',
      send: (formData) => actions.forms.submitSalesRequest.orThrow(formData),
    });
  }
}

if (!customElements.get(TAG)) customElements.define(TAG, SalesForm);
