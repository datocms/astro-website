import type { ReactNode } from 'react';

import s from '../style.module.css';

type Props = {
  children: ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  phase: 'closed' | 'open' | 'closing';
};

export function ModalBackdrop({ children, onMouseDown, phase }: Props) {
  return (
    <div className={s.backdrop} onMouseDown={onMouseDown} data-state={phase}>
      {children}
    </div>
  );
}
