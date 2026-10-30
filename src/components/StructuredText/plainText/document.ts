import { stripStega } from '@datocms/astro';
import type { Node, Span } from 'datocms-structured-text-utils';

type Edge = 'start' | 'end';

const DROPPED = new Set(['block', 'inlineBlock', 'inlineItem', 'thematicBreak', 'code']);

/**
 * Remove the nodes that have no text, and replace each link to a record
 * with its text. Then the document needs no records to render.
 */
export function textOnly(nodes: Node[]): Node[] {
  return nodes.flatMap((node): Node[] => {
    if (DROPPED.has(node.type)) return [];
    if (node.type === 'itemLink') return textOnly(node.children);
    if ('children' in node) {
      return [{ ...node, children: textOnly(node.children as Node[]) } as Node];
    }
    return [node];
  });
}

function edgeSpan(node: Node, edge: Edge): Span | undefined {
  if (node.type === 'span') return node;
  if (!('children' in node)) return undefined;
  const children = edge === 'start' ? node.children : [...node.children].reverse();
  for (const child of children) {
    const span = edgeSpan(child as Node, edge);
    if (span) return span;
  }
  return undefined;
}

function cloneWithSpan<T extends Node>(node: T, edge: Edge, value: (span: Span) => string): T {
  if (node.type === 'span') return { ...node, value: value(node) };
  if (!('children' in node)) return node;
  const children = [...node.children] as Node[];
  const index = edge === 'start' ? 0 : children.length - 1;
  const child = children[index];
  if (child) children[index] = cloneWithSpan(child, edge, value);
  return { ...node, children } as T;
}

/**
 * Remove the white space at the start of the first span and at the end of
 * the last span. In draft mode, the last span ends with the invisible stega
 * characters of Content Link. These characters stay in place.
 */
export function trimEdges(blocks: Node[]): Node[] {
  const result = [...blocks];
  const first = result[0];
  if (first && edgeSpan(first, 'start')) {
    result[0] = cloneWithSpan(first, 'start', (span) => span.value.trimStart());
  }
  const lastIndex = result.length - 1;
  const last = result[lastIndex];
  if (last && edgeSpan(last, 'end')) {
    result[lastIndex] = cloneWithSpan(last, 'end', (span) => {
      const visible = stripStega(span.value);
      // The stega characters are a suffix of the value.
      const stega = span.value.startsWith(visible) ? span.value.slice(visible.length) : '';
      return visible.trimEnd() + stega;
    });
  }
  return result;
}
