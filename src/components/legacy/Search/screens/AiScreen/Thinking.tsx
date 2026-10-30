import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';

import s from '../../style.module.css';
import { Ticker } from './Ticker';

type Props = {
  reasoning?: string;
};

export function Thinking({ reasoning }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const overflow = inner.scrollHeight - outer.clientHeight;
    inner.style.transform = overflow > 0 ? `translateY(-${overflow}px)` : '';
  }, [reasoning]);
  return (
    <div className={s.thinking}>
      {reasoning && (
        <div className={s.thinkingWindow} ref={outerRef}>
          <div className={s.thinkingInner} ref={innerRef}>
            <Streamdown parseIncompleteMarkdown controls={false} linkSafety={{ enabled: false }}>
              {reasoning}
            </Streamdown>
          </div>
        </div>
      )}
      <Ticker />
    </div>
  );
}
