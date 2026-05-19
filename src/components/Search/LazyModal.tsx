import { useEffect } from 'react';

import { ModalBackdrop } from './modal/Backdrop';
import { ModalCard } from './modal/Card';
import { SearchProvider, useSearch } from './context';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen/SearchScreen';
import { AiScreen } from './screens/AiScreen/AiScreen';

type Phase = 'closed' | 'open' | 'closing';

function ScreenSwitch() {
  const {
    state: { screen },
  } = useSearch();
  if (screen === 'home') return <HomeScreen />;
  if (screen === 'search') return <SearchScreen />;
  return <AiScreen />;
}

function ModalContents({ onClose, phase }: { onClose: () => void; phase: Phase }) {
  const {
    state: { screen },
    actions: { goHome },
  } = useSearch();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (screen === 'home') onClose();
      else goHome();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, goHome, screen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <ModalBackdrop onMouseDown={handleBackdropClick} phase={phase}>
      <ModalCard phase={phase}>
        <ScreenSwitch />
      </ModalCard>
    </ModalBackdrop>
  );
}

export default function LazyModal({ onClose, phase }: { onClose: () => void; phase: Phase }) {
  return (
    <SearchProvider onClose={onClose}>
      <ModalContents onClose={onClose} phase={phase} />
    </SearchProvider>
  );
}
