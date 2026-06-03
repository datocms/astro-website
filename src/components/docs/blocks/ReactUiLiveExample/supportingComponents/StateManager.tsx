import { useState, type ReactNode } from 'react';

export function StateManager<T>({
  initial,
  children,
}: {
  initial: T;
  children: (value: T, setValue: (newValue: T) => void) => ReactNode;
}) {
  const [value, setValue] = useState(initial);

  return children(value, setValue);
}
