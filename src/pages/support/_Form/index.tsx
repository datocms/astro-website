import { navigate } from 'astro:transitions/client';
import Textarea from 'react-textarea-autosize';
import s from './style.module.css';
import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { getCookie } from '~/lib/cookies';
import { actions } from 'astro:actions';

type FormValues = {
  email: string;
  project: string;
  body: string;
  subject?: string;
  errorId: string;
  uploads?: FileList;
  issueType: string;
};

type Props = {
  initialValues: Partial<FormValues>;
};

export function Form({ initialValues = {} }: Props) {
  const defaultValues = {
    project: '',
    subject: '',
    body: '',
    errorId: '',
    issueType: '',
    ...initialValues,
    email: initialValues.email || getCookie('datoAccountEmail') || '',
  };

  return (
    <div className={s.root}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        onSubmit={async (formData) => {
          const redirectUrl = await actions.forms.submitSupportRequest.orThrow(formData);
          navigate(redirectUrl);
        }}
      >
        <FieldReactComponent
          name="email"
          label="DatoCMS account email"
          placeholder="Your account email"
          validations={{
            required: 'Required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
              message: 'Invalid email',
            },
          }}
        />
        <FieldReactComponent
          name="project"
          label="DatoCMS project URL"
          placeholder="https://<YOUR_PROJECT>.admin.datocms.com"
          validations={{ required: 'Required' }}
        />

        <FieldReactComponent
          name="subject"
          label="Subject"
          placeholder="Short description of the issue"
        />

        <FieldReactComponent
          name="body"
          label="What's your question?"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea placeholder="Please tell us how we can help" {...field} />
          )}
        />

        {initialValues.errorId && <FieldReactComponent name="errorId" label="Error ID" readOnly />}

        <FieldReactComponent
          name="uploads"
          label="Add any additional attachments, if necessary"
          type="file"
          multiple
        />

        <FieldReactComponent name="issueType" type="hidden" />
      </FormReactComponent>
    </div>
  );
}
