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
    // It always has the dense type scale: on a marketing page and on a docs
    // page, the text of the modal has the same size.
    <div
      className={s.backdrop}
      onMouseDown={onMouseDown}
      data-state={phase}
      data-theme="default"
      data-density="dense"
    >
      {children}
    </div>
  );
}
