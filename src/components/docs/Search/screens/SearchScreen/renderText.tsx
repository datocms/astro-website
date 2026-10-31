import type { ReactNode } from 'react';

export function renderBackticks(text: ReactNode): ReactNode {
  if (typeof text !== 'string') return text;
  return text
    .split(/(?:\\`|`)([^`]+?)(?:\\`|`)/g)
    .map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part));
}
