import s from '../style.module.css';
import { useSearch } from '../context';
import { ArrowLeft, X } from 'lucide';
import { IconReact } from '~/components/Icon/Icon';

type Props = {
  title: string;
};

export function ModalHeader({ title }: Props) {
  const {
    actions: { goHome, closeModal },
  } = useSearch();
  return (
    <div className={s.cardHeader}>
      <button type="button" className={s.backButton} onClick={goHome} aria-label="Back">
        <span>
          <IconReact icon={ArrowLeft} />
        </span>
      </button>
      <span className={s.cardHeaderTitle}>{title}</span>
      <button
        type="button"
        className={s.closeButton}
        onClick={closeModal}
        aria-label="Close search"
      >
        <IconReact icon={X} />
      </button>
    </div>
  );
}
