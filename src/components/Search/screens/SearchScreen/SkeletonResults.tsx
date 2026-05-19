import cn from 'classnames';

import s from '../../style.module.css';

export function SkeletonResults() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className={s.skeleton} style={{ ['--i' as any]: i }} aria-hidden>
          <div className={s.skeletonIcon} />
          <div className={s.skeletonBody}>
            <div className={cn(s.skeletonLine, s.skeletonLineTitle)} />
            <div className={cn(s.skeletonLine, s.skeletonLineMeta)} />
          </div>
        </div>
      ))}
    </>
  );
}
