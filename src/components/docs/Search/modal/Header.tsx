import s from '../style.module.css';
import { useSearch } from '../context';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { IconReact } from '~/components/Icon/Icon';

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
        <span>
          <IconReact icon={faArrowLeft} />
        </span>
      </button>
      <span className={s.cardHeaderTitle}>{title}</span>
    </div>
  );
}
