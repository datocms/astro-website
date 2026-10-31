import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import s from './style.module.css';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { IconReact } from '~/components/Icon/Icon';

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

/*
 * 'none': no own trigger. Each element with `data-search-open` opens the
 * modal. The layout of the site uses it with its own search buttons.
 */
type TriggerVariant = 'input' | 'docs' | 'icon' | 'none';

/*
 * Some pages have more than one Search (for example, a trigger in the header
 * and a trigger in the hero). Only one of them opens on Cmd/Ctrl+K: the
 * first visible one, or the one that is open.
 */
let openOwner: object | null = null;

function Trigger({
  triggerRef,
  onOpen,
  variant = 'input',
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
  variant?: Exclude<TriggerVariant, 'none'>;
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
      <span className={s.triggerIcon}>
        <IconReact icon={faMagnifyingGlass} />
      </span>
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

type SearchProps = {
  variant?: TriggerVariant;
  /** Open the modal on the first render. */
  defaultOpen?: boolean;
  /** The element that gets the focus back when the modal closes. */
  opener?: HTMLElement | null;
};

export function Search({ variant, defaultOpen = false, opener = null }: SearchProps = {}) {
  const [phase, setPhase] = useState<Phase>(defaultOpen ? 'open' : 'closed');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(opener);
  const closeTimerRef = useRef<number | null>(null);
  const ownerRef = useRef<object>({});

  const openModal = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openOwner = ownerRef.current;
    setPhase('open');
  }, []);

  const closeModal = useCallback(() => {
    setPhase((prev) => (prev === 'open' ? 'closing' : prev));
  }, []);

  useEffect(() => {
    if (phase !== 'closing') return;
    closeTimerRef.current = window.setTimeout(() => {
      setPhase('closed');
      if (openOwner === ownerRef.current) openOwner = null;
      (openerRef.current ?? triggerRef.current)?.focus();
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
    if (defaultOpen) openOwner = ownerRef.current;
    // Run on mount only: defaultOpen is the first state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (openOwner && openOwner !== ownerRef.current) return;
        if (e.defaultPrevented) return;
        if (isEditableTarget(e.target) && !isMounted) return;
        if (!isMounted && variant !== 'none' && triggerRef.current?.offsetParent === null) return;
        e.preventDefault();
        if (!isMounted && variant === 'none') {
          openerRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
        openModal();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMounted, openModal, variant]);

  useEffect(() => {
    if (variant !== 'none') return;
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target.closest('[data-search-open]') : null;
      if (!(target instanceof HTMLElement)) return;
      e.preventDefault();
      openerRef.current = target;
      openModal();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [variant, openModal]);

  return (
    <>
      {variant !== 'none' && (
        <Trigger triggerRef={triggerRef} onOpen={openModal} variant={variant} />
      )}
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
