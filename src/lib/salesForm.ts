import { actions, isActionError, isInputError } from 'astro:actions';
import { CONTACT_FORM_SEND_EVENT, type ContactFormSendDetail } from '~/components/ContactForm';
import { getCookie } from '~/lib/cookies';
import { solveTurnstile } from '~/lib/loadTurnstile';

// The same label as the action expects (isTurnstileTokenValid).
const TURNSTILE_ACTION = 'contact';
const FALLBACK = 'Please try again, or email us at sales@datocms.com.';
// The Turnstile messages already tell the user to try again.
const TURNSTILE_FALLBACK = 'If the problem continues, email us at sales@datocms.com.';

const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

/**
 * Connect the contact form of the page to the action
 * forms.submitSalesRequest. The form has the `data-contact-form` attribute
 * and the `external` prop. A `[data-turnstile]` box inside the form holds
 * the anti-bot widget.
 */
export function initSalesForm() {
  const root = document.querySelector<HTMLElement>('[data-contact-form]');
  const turnstileBox = root?.querySelector<HTMLElement>('[data-turnstile]');

  // Show the frame of the box only when the widget has a height.
  if (turnstileBox) {
    new ResizeObserver(() => {
      const widget = turnstileBox.firstElementChild;
      const height = widget ? widget.getBoundingClientRect().height : 0;
      turnstileBox.toggleAttribute('data-visible', height > 0);
    }).observe(turnstileBox, { box: 'content-box' });
  }

  // The dashboard keeps the e-mail of the account in this cookie.
  const emailInput = root?.querySelector<HTMLInputElement>('input[name="email"]');
  const savedEmail = getCookie('datoAccountEmail');
  if (emailInput && !emailInput.value && savedEmail) {
    try {
      emailInput.value = decodeURIComponent(savedEmail);
    } catch {
      emailInput.value = savedEmail;
    }
  }

  root?.addEventListener(CONTACT_FORM_SEND_EVENT, async (event) => {
    const { formData, resolve } = (event as CustomEvent<ContactFormSendDetail>).detail;

    let token: string;
    try {
      token = turnstileBox ? await solveTurnstile(turnstileBox, TURNSTILE_ACTION) : '';
    } catch (error) {
      const text = error instanceof Error ? error.message : 'The anti-bot check failed.';
      resolve({ ok: false, message: `${sentence(text)} ${TURNSTILE_FALLBACK}` });
      return;
    }
    formData.append('token', token);

    try {
      const redirect = await actions.forms.submitSalesRequest.orThrow(formData);
      resolve({ ok: true, redirect });
    } catch (error) {
      if (isInputError(error)) {
        const fieldErrors = Object.fromEntries(
          Object.entries(error.fields).map(([name, errors]) => [
            name,
            (errors as string[]).join(', '),
          ]),
        );
        resolve({ ok: false, fieldErrors });
      } else if (isActionError(error)) {
        resolve({ ok: false, message: `${sentence(error.message)} ${FALLBACK}` });
      } else {
        // The default message of the form.
        resolve({ ok: false });
      }
    }
  });
}
