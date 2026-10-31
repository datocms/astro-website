import { isActionError, isInputError } from 'astro:actions';
import {
  CONTACT_FORM_SEND_EVENT,
  type ContactFormOutcome,
  type ContactFormSendDetail,
} from '~/components/ContactForm';
import { solveTurnstile } from '~/lib/loadTurnstile';

/*
 * Glue between a ContactForm with the prop `external` and an Astro action.
 * ContactForm validates the fields and fires the send event. This helper
 * solves the Turnstile check, calls the action and gives the outcome back.
 * The page that uses it must put an element with `data-turnstile` in the
 * slot `extra` of the form.
 */

interface ExternalFormOptions {
  /** The same label as the action expects (isTurnstileTokenValid). */
  turnstileAction: string;
  /** Added to the message of an action error: tell the visitor what to do. */
  fallback: string;
  /** Calls the action. It returns the URL of the page to show next. */
  send: (formData: FormData) => Promise<string | undefined>;
}

const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

export function connectExternalForm(root: HTMLElement, options: ExternalFormOptions) {
  const { turnstileAction, fallback, send } = options;
  const turnstileBox = root.querySelector<HTMLElement>('[data-turnstile]');

  // Show the frame of the box only when the widget has a height.
  if (turnstileBox) {
    new ResizeObserver(() => {
      const widget = turnstileBox.firstElementChild;
      const height = widget ? widget.getBoundingClientRect().height : 0;
      turnstileBox.toggleAttribute('data-visible', height > 0);
    }).observe(turnstileBox, { box: 'content-box' });
  }

  root.addEventListener(CONTACT_FORM_SEND_EVENT, async (event) => {
    const { formData, resolve } = (event as CustomEvent<ContactFormSendDetail>).detail;
    const settle = (outcome: ContactFormOutcome) => resolve(outcome);

    let token: string;
    try {
      token = turnstileBox ? await solveTurnstile(turnstileBox, turnstileAction) : '';
    } catch (error) {
      const text = error instanceof Error ? error.message : 'The anti-bot check failed.';
      // The Turnstile messages already tell the user to try again.
      settle({ ok: false, message: `${sentence(text)} If the problem continues, ${fallback}` });
      return;
    }
    formData.append('token', token);

    try {
      settle({ ok: true, redirect: await send(formData) });
    } catch (error) {
      if (isInputError(error)) {
        const fieldErrors = Object.fromEntries(
          Object.entries(error.fields).map(([name, errors]) => [
            name,
            (errors as string[]).join(', '),
          ]),
        );
        settle({ ok: false, fieldErrors });
      } else if (isActionError(error)) {
        settle({
          ok: false,
          message: `${sentence(error.message)} Please try again, or ${fallback}`,
        });
      } else {
        // The default message of the form.
        settle({ ok: false });
      }
    }
  });
}
