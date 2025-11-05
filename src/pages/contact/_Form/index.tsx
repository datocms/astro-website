import { getData } from 'country-list';
import { navigate } from 'astro:transitions/client';
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
  issueType: 'sales' | 'enterprise';
};

export function Form({ issueType }: { issueType: 'sales' | 'enterprise' }) {
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
    issueType,
  };

  return (
    <div className={s.root}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        onSubmit={async (formData) => {
          const redirectUrl = await actions.forms.submitSalesRequest.orThrow(formData);
          navigate(redirectUrl);
        }}
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
            'Our partners (Netlify, Vercel, Imgix...)',
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
