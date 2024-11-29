import type { Node } from 'datocms-structured-text-utils';
import { visit } from 'unist-util-visit';

export function filterNodes<T extends Node>(document: Node, predicate: (n: Node) => n is T) {
  const result: T[] = [];

  visit(
    document,
    (node: unknown) => predicate(node as Node),
    (node) => {
      result.push(node as T);
    },
  );

  return result;
}
