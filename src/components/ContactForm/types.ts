/*
 * The contract between ContactForm and a page that sends the data (the prop
 * `external`). Not in the prototype.
 *
 * When the fields are valid, the form fires the event `contactform:send` on
 * its root element ([data-contact-form]). The page sends the data and calls
 * `resolve` one time with the outcome.
 */

export type ContactFormOutcome =
  | {
      ok: true;
      /** Go to this URL. Without it, the form shows its success state. */
      redirect?: string;
    }
  | {
      ok: false;
      /** Replaces the default submit error message. */
      message?: string;
      /** The error message of each field, by the name of its input. */
      fieldErrors?: Record<string, string>;
    };

export interface ContactFormSendDetail {
  formData: FormData;
  resolve: (outcome: ContactFormOutcome) => void;
}

export const CONTACT_FORM_SEND_EVENT = 'contactform:send';
