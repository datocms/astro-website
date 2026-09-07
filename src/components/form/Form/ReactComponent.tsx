import { type ReactNode } from 'react';
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import s from './style.module.css';
import { ButtonReactComponent } from '~/components/Button/ReactComponent';
import { isActionError, isInputError } from 'astro:actions';
import { TurnstileError, useTurnstile } from './useTurnstile';

type Props<TFieldValues extends FieldValues = FieldValues> = {
  children: ReactNode;
  defaultValues?: DefaultValues<TFieldValues>;
  submitLabel?: ReactNode;
  onSubmit?: (data: FormData) => Promise<void>;
  /**
   * Label of this form in the Cloudflare Turnstile analytics, ie. `contact`.
   * The action verifying the token must expect the same value.
   */
  turnstileAction: string;
};

export function FormReactComponent<TFieldValues extends FieldValues = FieldValues>({
  children,
  defaultValues,
  submitLabel,
  onSubmit,
  turnstileAction,
}: Props<TFieldValues>) {
  const turnstile = useTurnstile(turnstileAction);

  const methods = useForm<TFieldValues>({
    defaultValues: defaultValues,
  });

  const { clearErrors, setError, handleSubmit, formState } = methods;

  const defaultSubmit: SubmitHandler<TFieldValues> = async (_values, event) => {
    event?.preventDefault();

    if (onSubmit && event?.target) {
      try {
        const token = await turnstile.getToken();

        // Create FormData from the native form element
        const formData = new FormData(event.target as HTMLFormElement);
        formData.append('token', token);

        await onSubmit(formData);
      } catch (e) {
        if (isInputError(e)) {
          for (const [name, errors] of Object.entries(e.fields)) {
            setError(name as FieldPath<TFieldValues>, { message: (errors as string[]).join(', ') });
          }
        }

        if (isActionError(e) || e instanceof TurnstileError) {
          toast.error(e.message);
        } else {
          toast.error('Ouch! There was an error submitting the form!');
        }

        setError('root.FORM_ERROR', { type: '500' });
        setTimeout(() => clearErrors('root.FORM_ERROR'), 100);
        return;
      }
    }
  };

  const waiting = formState.isSubmitting;

  return (
    <FormProvider {...methods}>
      <Toaster position="bottom-right" toastOptions={{ className: s.toastNotification }} />
      <form className={s.form} onSubmit={handleSubmit(defaultSubmit)}>
        {children}

        {/* Invisible unless Cloudflare needs the visitor to click a checkbox */}
        <div ref={turnstile.containerRef} className={s.turnstile} />

        <div className={s.submit}>
          <div className={s.agree}>
            By submitting you agree to our <a href="/legal/terms">TOS</a> and acknowledge our{' '}
            <a href="/legal/privacy-policy">Privacy Policy</a>
          </div>

          <ButtonReactComponent as="button" type="submit" disabled={waiting}>
            {waiting ? 'Submitting...' : submitLabel}
          </ButtonReactComponent>
        </div>
      </form>
    </FormProvider>
  );
}
