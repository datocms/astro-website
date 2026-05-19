import cn from 'classnames';

import s from '../../style.module.css';
import { COMMUNITY_GROUP_ID, groups } from '../../constants';

import forumIcon from '~/icons/regular/message-lines.svg?raw';

type Props = {
  selected: string | null;
  onSelect: (id: string | null) => void;
  showCommunity: boolean;
};

export function FilterChips({ selected, onSelect, showCommunity }: Props) {
  return (
    <div className={s.filters}>
      <button
        type="button"
        className={cn(s.filterChip, selected === null && s.filterChipActive)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {groups
        .filter((g) => g.id !== COMMUNITY_GROUP_ID)
        .map((group) => (
          <button
            key={group.id}
            type="button"
            className={cn(s.filterChip, selected === group.id && s.filterChipActive)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(group.id)}
          >
            {group.label}
          </button>
        ))}
      {showCommunity && (
        <>
          <span className={s.filterDivider} aria-hidden />
          <button
            type="button"
            className={cn(s.filterChip, selected === COMMUNITY_GROUP_ID && s.filterChipActive)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(COMMUNITY_GROUP_ID)}
          >
            <span className={s.filterChipIcon} dangerouslySetInnerHTML={{ __html: forumIcon }} />
            Community Forum
          </button>
        </>
      )}
    </div>
  );
}
