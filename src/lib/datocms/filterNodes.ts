import type { Node } from 'datocms-structured-text-utils';
import visit from 'unist-util-visit';

export function filterNodes<T extends Node>(document: Node, predicate: (n: unknown) => n is T) {
  const result: T[] = [];

  visit(document, predicate, (node) => {
    result.push(node);
  });

  return result;
}
