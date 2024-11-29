import Textarea from 'react-textarea-autosize';
import s from './style.module.css';
import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { getCookie } from '~/lib/cookies';

type FormValues = {
  email: string;
  project: string;
  body: string;
  errorId: string;
  uploads: string;
  issueType: string;
};

type Props = {
  initialValues: Partial<FormValues>;
};

export function Form({ initialValues = {} }: Props) {
  const defaultValues: FormValues = {
    project: '',
    body: '',
    errorId: '',
    uploads: '',
    issueType: '',
    ...initialValues,
    email: initialValues.email || getCookie('datoAccountEmail') || '',
  };

  return (
    <div className={s.root}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        nativeSubmitForm
        // https://app.frontapp.com/settings/tim:1275912/channels/edit/2627592/settings
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/PDaCIm6Sjad1ZB19swTizIZHgnFCnk0gEd2P97xZTsF_ZRHeTxSY6SUa_bNxF5yUR9I_1JjwZugyWTypqNlVrxGKafAmMA_PgF5EZ2AOnZ5ROsZc9jI0qblkauNC"
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
          name="body"
          label="What's your question?"
          placeholder="Please tell us how we can help"
          validations={{ required: 'Required' }}
          render={({ field }) => <Textarea {...field} />}
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
