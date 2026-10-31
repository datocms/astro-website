import type { ReactNode } from 'react';

import s from '../style.module.css';

type Props = {
  children: ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  phase: 'closed' | 'open' | 'closing';
};

export function ModalBackdrop({ children, onMouseDown, phase }: Props) {
  return (
    // The modal always has the default theme, also on a page with a theme.
    <div className={s.backdrop} onMouseDown={onMouseDown} data-state={phase} data-theme="default">
      {children}
    </div>
  );
}
