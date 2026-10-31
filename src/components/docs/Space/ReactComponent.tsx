import classNames from 'classnames';
import type { ReactNode } from 'react';
import s from './style.module.css';

type Props = {
  top?: 1 | 2 | 3 | 4;
  bottom?: 1 | 2 | 3 | 4;
  children: ReactNode;
};

const mt = [null, 'mt1', 'mt2', 'mt3', 'mt4'];
const mb = [null, 'mb1', 'mb2', 'mb3', 'mb4'];

export function SpaceReactComponent({ top, bottom, children }: Props) {
  return (
    <div className={classNames([top && s[mt[top]!], bottom && s[mb[bottom]!]])}>{children}</div>
  );
}
