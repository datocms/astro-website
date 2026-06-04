import { getData } from 'country-list';
import { navigate } from 'astro:transitions/client';
import Textarea from 'react-textarea-autosize';
import { actions } from 'astro:actions';
import s from './style.module.css';
import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { getCookie } from '~/lib/cookies';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyUrl: string;
  currentCms: string;
  country: string;
  body: string;
};

const CMS_OPTIONS = [
  'TYPO3',
  'Sitecore',
  'Adobe Experience Manager (AEM)',
  'Drupal',
  'Umbraco',
  'Custom-built / proprietary',
  'Other',
];

export function Form() {
  const defaultValues: FormValues = {
    firstName: '',
    lastName: '',
    email: getCookie('datoAccountEmail') || '',
    companyName: '',
    companyUrl: '',
    currentCms: '',
    country: '',
    body: '',
  };

  return (
    <div className={s.form}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Request your free migration assessment"
        onSubmit={async (formData) => {
          const redirectUrl = await actions.forms.submitDvLegacyCmsRequest.orThrow(formData);
          navigate(redirectUrl);
        }}
      >
        <div className={s.formCols}>
          <FieldReactComponent
            name="firstName"
            label="First name"
            placeholder="Jane"
            validations={{ required: 'Required' }}
          />
          <FieldReactComponent
            name="lastName"
            label="Last name"
            placeholder="Smith"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <FieldReactComponent
            name="companyName"
            label="Company name"
            placeholder="Acme Inc."
            validations={{ required: 'Required' }}
          />
          <FieldReactComponent
            name="companyUrl"
            label="Company website"
            placeholder="https://www.acme.com"
          />
        </div>

        <div className={s.formCols}>
          <FieldReactComponent
            name="email"
            label="Work email"
            placeholder="jane@acme.com"
            validations={{
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                message: 'Invalid email',
              },
            }}
          />
          <FieldReactComponent
            name="country"
            label="Country"
            validations={{ required: 'Required' }}
            options={getData()
              .map(({ code, name }) => ({ value: code, label: name }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </div>

        <FieldReactComponent
          name="currentCms"
          label="What CMS are you currently running?"
          placeholder="Select your current CMS"
          options={CMS_OPTIONS}
          validations={{ required: 'Required' }}
        />

        <FieldReactComponent
          name="body"
          label="Tell us about your project"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea
              placeholder="Describe your current CMS setup, team size, what's driving the migration, and what you need on the other side."
              {...field}
            />
          )}
        />
      </FormReactComponent>

      <div className={s.formNote}>
        <span>🔒</span>
        <span>
          <strong>De Voorhoede + DatoCMS</strong> — Your details are shared with both teams and used
          solely to arrange your free migration assessment. No spam, no third parties.
        </span>
      </div>
    </div>
  );
}
