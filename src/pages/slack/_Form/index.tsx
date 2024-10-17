import { FormReactComponent } from '~/components/form/Form/ReactComponent';
import { FieldReactComponent } from '~/components/form/Field/ReactComponent';
import { actions } from 'astro:actions';
import { navigate } from 'astro:transitions/client';

export function Form() {
  return (
    <FormReactComponent
      defaultValues={{ email: '' }}
      submitLabel="Get my Slack invite!"
      onSubmit={async (values) => {
        await actions.inviteEmailToSlackChannel.orThrow(values);
        navigate('/slack/thanks');
      }}
    >
      <FieldReactComponent
        name="email"
        label="Please insert your email"
        placeholder="m.smith@gmail.com"
        validations={{
          required: 'Required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
            message: 'Invalid email',
          },
        }}
      />
    </FormReactComponent>
  );
}
