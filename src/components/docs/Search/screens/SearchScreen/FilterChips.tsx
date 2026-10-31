import cn from 'classnames';

import s from '../../style.module.css';
import { COMMUNITY_GROUP_ID, groups } from '../../constants';

import forumIcon from '~/icons/regular/message-lines.svg?raw';

type Props = {
  selected: string;
  onSelect: (id: string) => void;
  showCommunity: boolean;
};

export function FilterChips({ selected, onSelect, showCommunity }: Props) {
  const docGroups = groups.filter((g) => g.id !== COMMUNITY_GROUP_ID);
  const communityGroup = groups.find((g) => g.id === COMMUNITY_GROUP_ID);

  return (
    <div className={s.filters}>
      {docGroups.map((group) => (
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
      {showCommunity && communityGroup && (
        <>
          <span className={s.filterDivider} aria-hidden />
          <button
            type="button"
            className={cn(s.filterChip, selected === communityGroup.id && s.filterChipActive)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(communityGroup.id)}
          >
            <span className={s.filterChipIcon} dangerouslySetInnerHTML={{ __html: forumIcon }} />
            Community Forum
          </button>
        </>
      )}
    </div>
  );
}
