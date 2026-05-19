import type { ReactNode } from 'react';

import s from '../style.module.css';

type Props = {
  children: ReactNode;
  phase: 'closed' | 'open' | 'closing';
};

export function ModalCard({ children, phase }: Props) {
  return (
    <div className={s.card} role="dialog" aria-modal="true" aria-label="Search" data-state={phase}>
      {children}
    </div>
  );
}
