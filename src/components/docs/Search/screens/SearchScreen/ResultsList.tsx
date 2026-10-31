import cn from 'classnames';
import { formatDistanceToNowStrict } from 'date-fns';

import s from '../../style.module.css';
import { renderBackticks } from './renderText';
import type { ResultWithArea } from './types';
import { IconReact } from '~/components/Icon/Icon';

function relativeDate(date: string): string | null {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return `${formatDistanceToNowStrict(d)} ago`;
}

type Props = {
  results: ResultWithArea[];
  selectedIndex: number;
  onHover: (idx: number) => void;
};

export function ResultsList({ results, selectedIndex, onHover }: Props) {
  const isCommunity = results[0]?.area.id === 'community';
  return (
    <div>
      {results.map((result, i) => (
        <a
          href={result.url}
          key={result.url}
          className={cn(s.result, selectedIndex === i && s.selected)}
          data-selected={selectedIndex === i || undefined}
          onMouseEnter={() => onHover(i)}
          style={{ ['--i' as any]: i }}
        >
          <div className={s.resultArea}>
            <IconReact icon={result.area.icon} />
            <span>
              {result.category ? (
                <>
                  {!isCommunity && (
                    <>
                      {result.area.label} {'>'}{' '}
                    </>
                  )}
                  {renderBackticks(result.category)}
                </>
              ) : (
                result.area.label
              )}
              {result.date && relativeDate(result.date) && (
                <span className={s.resultDate}> · {relativeDate(result.date)}</span>
              )}
            </span>
          </div>
          <div className={s.resultTitle}>
            {isCommunity ? result.title : renderBackticks(result.title)}
          </div>
          {result.blurb && <div className={s.resultBlurb}>{result.blurb}</div>}
        </a>
      ))}
    </div>
  );
}
