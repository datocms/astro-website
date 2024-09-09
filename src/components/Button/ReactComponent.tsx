import cn from 'classnames';
import style from './style.module.css';
import { fsClassNames, pClassNames, sClassNames } from './common';
import type { ReactHTML, ReactNode } from 'react';

type Props = {
  as?: keyof ReactHTML;
  fs?: keyof typeof fsClassNames;
  p?: keyof typeof pClassNames;
  s?: keyof typeof sClassNames;
  block?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

export function ButtonReactComponent({
  as: Component = 'button',
  children,
  fs,
  p,
  s,
  block,
  disabled,
  ...other
}: Props) {
  return (
    <Component
      {...other}
      className={cn(
        style.root,
        'className' in other ? (other.className as string) : null,
        disabled && style.disabled,
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
