import type { ChangeEventHandler, KeyboardEventHandler, RefObject } from 'react';

import s from '../style.module.css';
import type { IconData } from '~/components/Icon/data';
import { Search, X } from 'lucide';
import { IconReact } from '~/components/Icon/Icon';

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  name: string;
  type?: 'text' | 'search';
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  placement?: 'top' | 'bottom';
  icon?: IconData;
  /** When set, the row shows a close button. */
  onClose?: () => void;
};

export function ModalInputRow({
  inputRef,
  name,
  type = 'search',
  placeholder,
  value,
  onChange,
  onKeyDown,
  placement = 'top',
  icon = Search,
  onClose,
}: Props) {
  return (
    <div className={placement === 'bottom' ? s.bottomInputRow : s.inputRow}>
      <span className={s.inputIcon}>
        <IconReact icon={icon} />
      </span>
      <input
        ref={inputRef}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {onClose && (
        <button type="button" className={s.closeButton} onClick={onClose} aria-label="Close search">
          <IconReact icon={X} />
        </button>
      )}
    </div>
  );
}
