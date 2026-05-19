import type { ChangeEventHandler, KeyboardEventHandler, RefObject } from 'react';

import s from '../style.module.css';

import searchIcon from '~/icons/regular/magnifying-glass.svg?raw';

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  name: string;
  type?: 'text' | 'search';
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  placement?: 'top' | 'bottom';
  icon?: string;
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
  icon = searchIcon,
}: Props) {
  return (
    <div className={placement === 'bottom' ? s.bottomInputRow : s.inputRow}>
      <span className={s.inputIcon} dangerouslySetInnerHTML={{ __html: icon }} />
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
    </div>
  );
}
