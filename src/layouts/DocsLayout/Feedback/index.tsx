import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { actions, isInputError } from 'astro:actions';
import s from './style.module.css';

import thumbsDown from '~/icons/regular/thumbs-down.svg?raw';
import thumbsUp from '~/icons/regular/thumbs-up.svg?raw';
import { ButtonReactComponent } from '~/components/Button/ReactComponent';

type FormValues = {
  email: string;
  notes: string;
};

export function Feedback() {
  const { register, reset, setError, handleSubmit, formState } = useForm<FormValues>();
  const [positiveFeedback, setPositiveFeedback] = useState<boolean | undefined>();
  const [success, setSuccess] = useState(false);

  const handleFeedback = (positive: boolean) => {
    setPositiveFeedback(positive);
  };

  const onSubmit = async ({ email, notes }: FormValues) => {
    const url = `${document.location.protocol}//${document.location.host}${document.location.pathname}`;

    const { data, error } = await actions.sendFeedbackAboutDocPage({
      namespace: 'docs',
      url,
      reaction: positiveFeedback ? 'positive' : 'negative',
      notes,
      email,
    });

    if (data) {
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } else if (isInputError(error)) {
      setError('email', { message: error.fields.email?.[0] });
      setError('notes', { message: error.fields.notes?.[0] });
      setSuccess(false);
    }
  };

  return (
    <div>
      {success ? (
        <>Thank you! We received your feedback 🙏</>
      ) : (
        <>
          <button
            type="button"
            className={classNames(s.thumbsButton, positiveFeedback && s.activeThumbsButton)}
            onClick={() => handleFeedback(true)}
          >
            <span dangerouslySetInnerHTML={{ __html: thumbsUp }} />
            Yes
          </button>
          <button
            type="button"
            className={classNames(
              s.thumbsButton,
              positiveFeedback === false && s.activeThumbsButton,
            )}
            onClick={() => handleFeedback(false)}
          >
            <span dangerouslySetInnerHTML={{ __html: thumbsDown }} />
            No
          </button>
          {positiveFeedback !== undefined && (
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={s.field}>
                <div className={s.label}>
                  <div className={s.labelName}>
                    {positiveFeedback
                      ? 'Let us know what we do well'
                      : 'Let us know what we can do better'}
                  </div>
                  <div className={s.labelInfo}>Optional</div>
                </div>
                <textarea placeholder="Your feedback..." {...register('notes')} />
              </div>
              <div className={s.field}>
                <div className={s.label}>
                  <div className={s.labelName}>
                    To receive further updates or address your feedback, kindly share your email
                    address with us.
                  </div>
                  <div className={s.labelInfo}>Optional</div>
                </div>
                <input placeholder="Enter your email" {...register('email')} />
                {formState.errors.email && (
                  <div className={s.fieldError}>{formState.errors.email.message}</div>
                )}
              </div>

              <p className={s.labelInfo}>If you need a reply, please contact support instead.</p>

              <ButtonReactComponent as="button" p="small" block disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Submitting...' : 'Submit feedback'}
              </ButtonReactComponent>
            </form>
          )}
        </>
      )}
    </div>
  );
}
