import { useEffect, useRef, useState } from 'react';

import s from '../style.module.css';

import warningIcon from '~/icons/regular/triangle-exclamation.svg?raw';
import timesIcon from '~/icons/regular/xmark.svg?raw';

const STORAGE_KEY = 'datocms-search-ai-disclaimer-dismissed';
const DISMISS_ANIMATION_MS = 220;

type Phase = 'hidden' | 'visible' | 'dismissing';

function readInitialPhase(): Phase {
  if (typeof window === 'undefined') return 'hidden';
  try {
    return localStorage.getItem(STORAGE_KEY) === '1' ? 'hidden' : 'visible';
  } catch {
    return 'visible';
  }
}

export function ModalDisclaimer() {
  const [phase, setPhase] = useState<Phase>(readInitialPhase);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  if (phase === 'hidden') return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setPhase('dismissing');
    timerRef.current = window.setTimeout(() => {
      setPhase('hidden');
      timerRef.current = null;
    }, DISMISS_ANIMATION_MS);
  };

  return (
    <div className={s.disclaimer} data-state={phase}>
      <span className={s.disclaimerIcon} dangerouslySetInnerHTML={{ __html: warningIcon }} />
      <span className={s.disclaimerText}>
        AI answers are experimental and may be inaccurate. Always double-check before relying on
        them.
      </span>
      <button
        type="button"
        className={s.disclaimerClose}
        onClick={handleDismiss}
        aria-label="Dismiss disclaimer"
        dangerouslySetInnerHTML={{ __html: timesIcon }}
      />
    </div>
  );
}
