import Textarea from 'react-textarea-autosize';
import s from './style.module.css';
import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { getCookie } from '~/lib/cookies';
import { actions } from 'astro:actions';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  jobFunction: string;
  title: string;
  body: string;
  issueType: 'sales' | 'enterprise' | 'feedback';
};

export function Form({ issueType }: { issueType: 'sales' | 'enterprise' | 'feedback' }) {
  const defaultValues: FormValues = {
    firstName: '',
    lastName: '',
    email: getCookie('datoAccountEmail') || '',
    jobFunction: '',
    title: '',
    body: '',
    issueType,
  };

  return (
    <div className={s.root}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        nativeSubmitForm
        onSubmit={async (formValues) => {
          await actions.pipedrive.createSalesLead.orThrow(formValues);
        }}
        // https://app.frontapp.com/settings/tim:1275912/channels/edit/9473928/settings
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/nzap4XhKrZaOsUgc8z60aWZmDiaXqbcs69ZEcrTnEmrZ9RFy4pLak0OqBcEvkSN-Py6tbtle8KXhPe4X_QgF89gP1Qpl97WhzTQMz8wWQ3hCpUMXJqNtE9056-Av"
      >
        <div className={s.formCols}>
          <FieldReactComponent
            name="firstName"
            label="First name"
            placeholder="Your first name"
            validations={{ required: 'Required' }}
          />

          <FieldReactComponent
            name="lastName"
            label="Last name"
            placeholder="Your last name"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <FieldReactComponent
            name="email"
            label="Work email"
            placeholder="Your work email"
            validations={{
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                message: 'Invalid email',
              },
            }}
          />

          <FieldReactComponent
            name="jobFunction"
            label="Job role"
            validations={{ required: 'Required' }}
            options={[
              'Editorial & Content',
              'Developer/Engineering',
              'Product & Project',
              'Sales & Marketing',
              'Administrative',
              'Other',
            ]}
          />
        </div>

        <FieldReactComponent
          name="title"
          label="Topic"
          placeholder="Just a title"
          validations={{ required: 'Required' }}
        />

        <FieldReactComponent
          name="body"
          label="Tell us"
          placeholder="Your feedback"
          validations={{ required: 'Required' }}
          render={({ field }) => <Textarea {...field} placeholder="Your feedback" />}
        />

        <FieldReactComponent name="issueType" type="hidden" />
      </FormReactComponent>
    </div>
  );
}
