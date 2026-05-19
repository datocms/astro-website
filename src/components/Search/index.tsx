import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import s from './style.module.css';

import searchIcon from '~/icons/regular/magnifying-glass.svg?raw';

const LazyModal = lazy(() => import('./LazyModal'));

function prefetchModal() {
  void import('./LazyModal');
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return true;
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const platform = uaData?.platform ?? navigator.platform ?? '';
  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

type TriggerVariant = 'input' | 'docs' | 'icon';

function Trigger({
  triggerRef,
  onOpen,
  variant = 'input',
}: {
  triggerRef: React.RefObject<HTMLButtonElement>;
  onOpen: () => void;
  variant?: TriggerVariant;
}) {
  const isMac = useMemo(isMacPlatform, []);

  const className =
    variant === 'icon'
      ? s.triggerIconOnly
      : `${s.trigger} ${variant === 'input' ? s.triggerInput : s.triggerDocs}`;

  return (
    <button
      ref={triggerRef}
      type="button"
      className={className}
      onClick={onOpen}
      onPointerEnter={prefetchModal}
      onFocus={prefetchModal}
      aria-label="Open search and AI"
    >
      <span className={s.triggerIcon} dangerouslySetInnerHTML={{ __html: searchIcon }} />
      {variant !== 'icon' && (
        <>
          <span className={s.triggerLabel}>Search or Ask AI…</span>
          <span className={s.triggerKbd} aria-hidden>
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </span>
        </>
      )}
    </button>
  );
}

type Phase = 'closed' | 'open' | 'closing';

const EXIT_ANIMATION_MS = 180;

export function Search({ variant }: { variant?: TriggerVariant } = {}) {
  const [phase, setPhase] = useState<Phase>('closed');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const openModal = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setPhase('open');
  }, []);

  const closeModal = useCallback(() => {
    setPhase((prev) => (prev === 'open' ? 'closing' : prev));
  }, []);

  useEffect(() => {
    if (phase !== 'closing') return;
    closeTimerRef.current = window.setTimeout(() => {
      setPhase('closed');
      triggerRef.current?.focus();
      closeTimerRef.current = null;
    }, EXIT_ANIMATION_MS);
    return () => {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [phase]);

  const isMounted = phase !== 'closed';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (isEditableTarget(e.target) && !isMounted) return;
        if (!isMounted && triggerRef.current?.offsetParent === null) return;
        e.preventDefault();
        openModal();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMounted, openModal]);

  return (
    <>
      <Trigger triggerRef={triggerRef} onOpen={openModal} variant={variant} />
      {isMounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <Suspense fallback={null}>
            <LazyModal onClose={closeModal} phase={phase} />
          </Suspense>,
          document.body,
        )}
    </>
  );
}
