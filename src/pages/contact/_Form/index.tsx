import { getData } from 'country-list';
import Textarea from 'react-textarea-autosize';
import s from './style.module.css';
import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { getCookie } from '~/lib/cookies';
import { actions } from 'astro:actions';

type FormValues = {
  companyName: string;
  country: string;
  industry: string;
  firstName: string;
  lastName: string;
  email: string;
  jobFunction: string;
  useCase: string;
  body: string;
  referral: string;
  issueType: 'sales';
};

export function Form() {
  const defaultValues: FormValues = {
    companyName: '',
    country: '',
    industry: '',
    firstName: '',
    lastName: '',
    email: getCookie('datoAccountEmail') || '',
    jobFunction: '',
    useCase: '',
    body: '',
    referral: '',
    issueType: 'sales',
  };

  return (
    <div className={s.root}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        nativeSubmitForm
        onSubmit={async (formValues) => {
          await actions.pipedrive.createLead.orThrow(formValues);
        }}
        // https://app.frontapp.com/settings/tim:1275912/channels/edit/9473928/settings
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/nzap4XhKrZaOsUgc8z60aWZmDiaXqbcs69ZEcrTnEmrZ9RFy4pLak0OqBcEvkSN-Py6tbtle8KXhPe4X_QgF89gP1Qpl97WhzTQMz8wWQ3hCpUMXJqNtE9056-Av"
      >
        <FieldReactComponent
          name="companyName"
          label="Company name"
          placeholder="Your company name"
          validations={{ required: 'Required' }}
        />

        <div className={s.formCols}>
          <FieldReactComponent
            name="country"
            label="Country"
            validations={{ required: 'Required' }}
            options={getData()
              .map(({ code, name }) => ({
                value: code,
                label: name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
          <FieldReactComponent
            name="industry"
            label="Industry"
            options={[
              'Agency / Freelancer',
              'Ecommerce / Retail',
              'FinTech',
              'Media / Publishing',
              'SaaS',
              'Automotive',
              'CleanTech / Utility',
              'Food & Beverage',
              'Education',
              'Non-Profit & Culture',
              'Other',
            ]}
            validations={{ required: 'Required' }}
          />
        </div>

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
            label="Job function"
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
          name="useCase"
          label="Use case"
          options={[
            'Ecommerce',
            'Moving to headless',
            'Migrating from other headless CMS',
            'Agency',
            'Other',
          ]}
          validations={{ required: 'Required' }}
        />

        <FieldReactComponent
          name="body"
          label="What's your question?"
          placeholder="Please tell us how we can help"
          validations={{ required: 'Required' }}
          render={({ field }) => <Textarea {...field} />}
        />

        <FieldReactComponent
          name="referral"
          label="How did you hear about us?"
          options={[
            'A colleague/recommendation/forum',
            'Software review platform (G2, Capterra...)',
            'Our partners (Gatsby, Next.js...)',
            'Social Media (Twitter, LinkedIn...)',
            'Search',
            'Other',
          ]}
          validations={{ required: 'Required' }}
        />

        <FieldReactComponent name="issueType" type="hidden" />
      </FormReactComponent>
    </div>
  );
}
