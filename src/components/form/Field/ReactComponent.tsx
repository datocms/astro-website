import cn from 'classnames';
import { type ReactNode } from 'react';
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import s from './style.module.css';

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
      id={name}
      placeholder={placeholder}
      type={type}
      multiple={multiple}
      readOnly={readOnly}
    />
  );

  if (options) {
    input = (
      <>
        <select id={name} {...field}>
          <option value="" disabled>
            {placeholder || 'Please select one...'}
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
        </select>
      </>
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
    <div className={cn(s.field, errorMessage && s.fieldError)}>
      {label && (
        <label htmlFor={name}>
          {label}
          {validations && <span className={s.required}> *</span>}
        </label>
      )}

      {input}

      {errorMessage && <div className={s.error}>{errorMessage}</div>}
    </div>
  );
}

type FieldsetReactComponentProps = {
  label: string;
  children: ReactNode;
};

export function FieldsetReactComponent({ label, children }: FieldsetReactComponentProps) {
  return (
    <div className={s.field}>
      <label>{label}</label>

      {children}
    </div>
  );
}
