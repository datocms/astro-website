import cn from 'classnames';

import s from '../../style.module.css';
import { renderBackticks } from './renderText';
import type { ResultWithArea } from './types';

type Props = {
  results: ResultWithArea[];
  selectedIndex: number;
  onHover: (idx: number) => void;
  dimmed: boolean;
};

export function ResultsList({ results, selectedIndex, onHover, dimmed }: Props) {
  const isCommunity = results[0]?.area.id === 'community';
  return (
    <div className={cn(dimmed && s.resultsDimmed, isCommunity && s.area)}>
      {results.map((result, i) => (
        <a
          href={result.url}
          key={result.url}
          className={cn(s.result, selectedIndex === i && s.selected)}
          data-selected={selectedIndex === i || undefined}
          onMouseEnter={() => onHover(i)}
          style={{ ['--i' as any]: i }}
        >
          <div dangerouslySetInnerHTML={{ __html: result.area.icon }} />
          <div className={s.resultBodyWrapper}>
            <div className={s.resultArea}>
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
            </div>
            <div className={s.resultTitle}>
              {isCommunity ? result.title : renderBackticks(result.title)}
            </div>
            {result.blurb && <div className={s.resultBlurb}>{result.blurb}</div>}
          </div>
        </a>
      ))}
    </div>
  );
}
