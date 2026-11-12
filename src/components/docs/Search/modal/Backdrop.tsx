import type { ReactNode } from 'react';

import s from '../style.module.css';

type Props = {
  children: ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  phase: 'closed' | 'open' | 'closing';
};

/*
 * The theme of the modal. On a docs page (the docs layout sets
 * data-theme="docs" on <body>) the modal has the docs theme. On all other
 * pages it has the purple theme, also on a page or a section with a
 * different theme.
 */
function modalTheme() {
  if (typeof document === 'undefined') return 'purple';
  return document.body.dataset.theme === 'docs' ? 'docs' : 'purple';
}

export function ModalBackdrop({ children, onMouseDown, phase }: Props) {
  return (
    // The modal always has the dense type scale: on a marketing page and on
    // a docs page, the text of the modal has the same size.
    <div
      className={s.backdrop}
      onMouseDown={onMouseDown}
      data-state={phase}
      data-theme={modalTheme()}
      data-density="dense"
    >
      {children}
    </div>
  );
}
