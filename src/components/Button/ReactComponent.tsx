import cn from 'classnames';
import style from './style.module.css';
import { fsClassNames, pClassNames, sClassNames } from './common';
import type { ElementType, ReactNode } from 'react';

type Props<T extends keyof JSX.IntrinsicElements = 'button'> = {
  as?: T;
  fs?: keyof typeof fsClassNames;
  p?: keyof typeof pClassNames;
  s?: keyof typeof sClassNames;
  block?: boolean;
  children: ReactNode;
} & JSX.IntrinsicElements[T];

export function ButtonReactComponent<T extends keyof JSX.IntrinsicElements>({
  as = 'button' as T,
  children,
  fs,
  p,
  s,
  block,
  ...other
}: Props<T>) {
  const Component = as as any;

  return (
    <Component
      {...other}
      className={cn(
        style.root,
        'className' in other ? (other.className as string) : null,
        'disabled' in other && other.disabled ? style.disabled : null,
        block && style.block,
        s && sClassNames[s],
        fs && fsClassNames[fs],
        p && pClassNames[p],
      )}
    >
      {children}
    </Component>
  );
}
