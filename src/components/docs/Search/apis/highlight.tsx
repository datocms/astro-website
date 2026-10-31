import { escapeRegExp } from 'lodash-es';
import type { ReactNode } from 'react';

export function highlight(text: string, query: string): ReactNode {
  const terms = query.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;
  const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return text.split(regex).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}
