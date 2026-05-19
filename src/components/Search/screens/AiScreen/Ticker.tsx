import { useEffect, useState } from 'react';

import s from '../../style.module.css';

const TICKER_MESSAGES = [
  'Fetching GraphQL query examples…',
  'Consulting the Structured Text spec…',
  'Untangling modular content blocks…',
  'Polishing imgix transformations…',
  'Resolving locale fallbacks…',
  'Warming up the CDA cache…',
  'Looking up field validators…',
  'Tracing inverse relationships…',
  'Lining up draft records…',
  'Cross-referencing the docs…',
  'Asking the deploy pipeline nicely…',
  'Pairing models to their fields…',
  'Sorting taxonomy trees…',
];

export function Ticker() {
  const [i, setI] = useState(() => Math.floor(Math.random() * TICKER_MESSAGES.length));
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % TICKER_MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={s.ticker} aria-hidden="true">
      <span className={s.tickerDots}>
        <span className={s.tickerDot} />
        <span className={s.tickerDot} />
        <span className={s.tickerDot} />
      </span>
      <span className={s.tickerViewport}>
        <span className={s.tickerTrack} style={{ transform: `translateY(-${i * 1.5}em)` }}>
          {TICKER_MESSAGES.map((m, k) => (
            <span key={k} className={s.tickerItem}>
              {m}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}
