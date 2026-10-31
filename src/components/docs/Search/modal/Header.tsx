import s from '../style.module.css';
import { useSearch } from '../context';

import arrowLeftIcon from '~/icons/regular/arrow-left.svg?raw';

type Props = {
  title: string;
};

export function ModalHeader({ title }: Props) {
  const {
    actions: { goHome },
  } = useSearch();
  return (
    <div className={s.cardHeader}>
      <button type="button" className={s.backButton} onClick={goHome} aria-label="Back">
        <span dangerouslySetInnerHTML={{ __html: arrowLeftIcon }} />
      </button>
      <span className={s.cardHeaderTitle}>{title}</span>
    </div>
  );
}
