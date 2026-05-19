import cn from 'classnames';
import { type ReactNode, forwardRef } from 'react';

import s from '../style.module.css';

type Props = {
  children: ReactNode;
  className?: string;
};

export const ModalBody = forwardRef<HTMLDivElement, Props>(function ModalBody(
  { children, className },
  ref,
) {
  return (
    <div className={cn(s.cardBody, className)} ref={ref} data-scroll-container="true">
      {children}
    </div>
  );
});
