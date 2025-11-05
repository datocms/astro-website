import { type ReactNode } from 'react';
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import { useRecaptcha } from 'react-recaptcha-hook';
import toast, { Toaster } from 'react-hot-toast';
import s from './style.module.css';
import { RECAPTCHA_KEY } from 'astro:env/client';
import { ButtonReactComponent } from '~/components/Button/ReactComponent';
import { isActionError, isInputError } from 'astro:actions';

type Props<TFieldValues extends FieldValues = FieldValues> = {
  children: ReactNode;
  defaultValues?: DefaultValues<TFieldValues>;
  submitLabel?: ReactNode;
  onSubmit?: (data: FormData) => Promise<void>;
};

export function FormReactComponent<TFieldValues extends FieldValues = FieldValues>({
  children,
  defaultValues,
  submitLabel,
  onSubmit,
}: Props<TFieldValues>) {
  const execute = useRecaptcha({
    // must be v3 Recaptcha!
    sitekey: RECAPTCHA_KEY,
    hideDefaultBadge: true,
  });

  const methods = useForm<TFieldValues>({
    defaultValues: defaultValues,
  });

  const { clearErrors, setError, handleSubmit, formState } = methods;

  const defaultSubmit: SubmitHandler<TFieldValues> = async (values, event) => {
    event?.preventDefault();

    const token = await execute('form');

    if (onSubmit && event?.target) {
      try {
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

        if (isActionError(e)) {
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
