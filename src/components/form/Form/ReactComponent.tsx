import { useRef, type ReactNode } from 'react';
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import { useRecaptcha } from 'react-recaptcha-hook';
import toast, { Toaster } from 'react-hot-toast';
import s from './style.module.css';
import { RECAPTCHA_KEY } from 'astro:env/client';
import { ButtonReactComponent } from '../../Button/ReactComponent';

type Props<TFieldValues extends FieldValues = FieldValues> = {
  children: ReactNode;
  defaultValues?: DefaultValues<TFieldValues>;
  action?: string;
  submitLabel?: ReactNode;
  onSubmit?: (values: FieldValues) => Promise<void>;
  nativeSubmitForm?: boolean;
};

export function FormReactComponent<TFieldValues extends FieldValues = FieldValues>({
  children,
  defaultValues,
  action,
  submitLabel,
  onSubmit,
  nativeSubmitForm,
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

  const recaptchaInput = useRef<HTMLInputElement>(null);

  const defaultSubmit: SubmitHandler<FieldValues> = async (values, event) => {
    if (!recaptchaInput.current) {
      return;
    }

    event?.preventDefault();

    const token = await execute('form');

    recaptchaInput.current.value = token;

    if (onSubmit) {
      try {
        await onSubmit(values);
      } catch (e) {
        toast.error('Ouch! There was an error submitting the form!');
        setError('root.FORM_ERROR', { type: '500' });
        setTimeout(() => clearErrors('root.FORM_ERROR'), 100);
        return;
      }
    }

    if (nativeSubmitForm) {
      event?.target.submit();
    }
  };

  const waiting = formState.isSubmitting || (formState.isSubmitSuccessful && nativeSubmitForm);

  return (
    <FormProvider {...methods}>
      <Toaster />
      <form
        className={s.form}
        onSubmit={handleSubmit(defaultSubmit)}
        method="POST"
        action={action}
        encType="multipart/form-data"
        acceptCharset="utf-8"
      >
        {children}

        <input type="hidden" name="g-recaptcha-response" ref={recaptchaInput} />

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
