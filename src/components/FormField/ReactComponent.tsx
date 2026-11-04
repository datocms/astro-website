import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import classNames from 'classnames';
import type { ComponentProps, ReactNode } from 'react';
import { IconReact } from '~/components/Icon/Icon';
import styles from './style.module.css';

/*
 * The React version of FormField, for the forms of React islands. It has
 * the same look: the label, the control and the error message. The island
 * gives the control (an input, a select, a textarea, or a group of
 * controls) as children, with the classes below.
 */
type Props = {
  /** The id of the control. Without it, the label is not a <label>: use it for a group of controls. */
  htmlFor?: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function FormFieldReactComponent({ htmlFor, label, required, error, children }: Props) {
  const labelClass = classNames('labelMedium', styles.label);
  const labelContent = (
    <>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </>
  );

  return (
    <div className={styles.field}>
      {htmlFor ? (
        <label className={labelClass} htmlFor={htmlFor}>
          {labelContent}
        </label>
      ) : (
        <p className={labelClass}>{labelContent}</p>
      )}
      {children}
      {error && <p className={classNames('labelMedium', styles.error)}>{error}</p>}
    </div>
  );
}

/** The classes of a text input or a textarea in a FormFieldReactComponent. */
export const formControlClass = classNames('body', styles.control);
export const formTextareaClass = classNames('body', styles.control, styles.textarea);

/** A native select with the chevron of FormField. */
export function FormSelectReactComponent({ className, ...props }: ComponentProps<'select'>) {
  return (
    <div className={styles.select}>
      <select
        className={classNames('body', styles.control, styles.nativeSelect, className)}
        {...props}
      />
      <span className={styles.chevron}>
        <IconReact icon={faChevronDown} />
      </span>
    </div>
  );
}
