import type { ReactNode } from 'react';
import styles from './style.module.css';

/* The React version of FormBox and FormRow, for the forms of React islands. */
export function FormBoxReactComponent({ children }: { children: ReactNode }) {
  return <div className={styles.box}>{children}</div>;
}

export function FormRowReactComponent({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
