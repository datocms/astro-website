import { getData } from 'country-list';
import Textarea from 'react-textarea-autosize';
import s from './style.module.css';
import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { getCookie } from '~/lib/cookies';
import { actions } from 'astro:actions';

type FormValues = {
  firstName: string;
  lastName: string;
  agencyName: string;
  agencyUrl: string;
  teamSize: string;
  productFamiliarity: string;
  email: string;
  country: string;
  body: string;
};

export function Form() {
  const defaultValues: FormValues = {
    firstName: '',
    lastName: '',
    agencyName: '',
    agencyUrl: '',
    teamSize: '',
    productFamiliarity: '',
    country: '',
    body: '',
    email: getCookie('datoAccountEmail') || '',
  };

  return (
    <div className={s.form}>
      <FormReactComponent
        defaultValues={defaultValues}
        submitLabel="Let's have a chat!"
        nativeSubmitForm
        onSubmit={async (formValues) => {
          // await actions.pipedrive.createPartnerProgramLead.orThrow(formValues);
          throw new Error('PIPPA');
        }}
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/3Sm_zJWUNAZjGDEATKFPqvusB9OfzY8rqYlrGJ1mjrCkgevT-jE7_fNnB8SOeobAgkr4Pff6S4eAjQN6f_euzEjsDxk76hp1CkVYfevIYPSpmoXztVnRgA86Dseo"
      >
        <div className={s.formCols}>
          <FieldReactComponent
            name="firstName"
            label="Your first name"
            placeholder="Enter your first name"
            validations={{ required: 'Required' }}
          />
          <FieldReactComponent
            name="lastName"
            label="Your last name"
            placeholder="Enter your last name"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <FieldReactComponent
            name="agencyName"
            label="What's the name of your agency?"
            placeholder="Acme Inc."
            validations={{ required: 'Required' }}
          />
          <FieldReactComponent
            name="agencyUrl"
            label="Do you have a website?"
            placeholder="https://www.acme.com"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <FieldReactComponent
            name="teamSize"
            label="Company size"
            placeholder="Select number of employees"
            options={["1 — it's just me", '2-10', '10-50', '50-200', '200-1000', '1000+']}
            validations={{ required: 'Required' }}
          />
          <FieldReactComponent
            name="productFamiliarity"
            label="How familiar are you with DatoCMS?"
            options={[
              'Exploring the product',
              'Already published a few projects',
              'Already published +10 projects',
            ]}
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <FieldReactComponent
            name="email"
            label="What's your DatoCMS account email?"
            placeholder="info@acme.com"
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
            label="Where are you based?"
            validations={{ required: 'Required' }}
            options={getData()
              .map(({ code, name }) => ({
                value: code,
                label: name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </div>

        <FieldReactComponent
          name="body"
          label="Please introduce yourself and your agency. If you have any additional question or concern, please ask!"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea placeholder="Looking forward to chat with you! ;-)" {...field} />
          )}
        />
      </FormReactComponent>
    </div>
  );
}
