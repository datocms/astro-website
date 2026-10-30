import cn from 'classnames';
import { type ReactNode } from 'react';
import s from './style.module.css';

export default function ProseReactComponent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(s.prose, className)}>{children}</div>;
}
