import { type ReactNode } from 'react';
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { FormRowReactComponent } from '~/components/FormBox/ReactComponent';
import {
  formControlClass,
  FormFieldReactComponent,
  FormSelectReactComponent,
} from '~/components/FormField/ReactComponent';

/*
 * A field of a react-hook-form form, in a row of a FormBox. It has the look
 * of FormField (the contact forms).
 */
type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: ReactNode;
  placeholder?: string;
  validations?: RegisterOptions<TFieldValues, TName>;
  options?: string[] | Array<{ value: string; label: ReactNode }>;
  render?: ControllerProps<TFieldValues, TName>['render'];
  type?: string;
  multiple?: boolean;
  readOnly?: boolean;
};

export function FieldReactComponent<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  placeholder,
  validations,
  options,
  render,
  type,
  multiple,
  readOnly,
}: Props<TFieldValues, TName>) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const field = register(name, validations);

  let input = (
    <input
      {...field}
      className={formControlClass}
      id={name}
      placeholder={placeholder}
      type={type}
      multiple={multiple}
      readOnly={readOnly}
    />
  );

  if (options) {
    input = (
      <FormSelectReactComponent id={name} {...field}>
        <option value="" disabled>
          {placeholder || 'Please select one…'}
        </option>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </FormSelectReactComponent>
    );
  }

  if (render) {
    input = (
      <Controller<TFieldValues, TName>
        render={render}
        name={name}
        control={control}
        rules={validations}
      />
    );
  }

  if (type === 'hidden') {
    return input;
  }

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <FormRowReactComponent>
      <FormFieldReactComponent
        htmlFor={name}
        label={label}
        required={Boolean(validations)}
        error={errorMessage}
      >
        {input}
      </FormFieldReactComponent>
    </FormRowReactComponent>
  );
}

type FieldsetReactComponentProps = {
  label: string;
  children: ReactNode;
};

/* A group of controls with one label, in a row of a FormBox. */
export function FieldsetReactComponent({ label, children }: FieldsetReactComponentProps) {
  return (
    <FormRowReactComponent>
      <FormFieldReactComponent label={label}>{children}</FormFieldReactComponent>
    </FormRowReactComponent>
  );
}
