import { type Record as DatocmsRecord } from 'datocms-structured-text-utils';

export function withAllComponents<T extends DatocmsRecord>(
  blocks: T[],
  blockTypeNameToComponent: Record<T['__typename'], (props: any) => string>,
) {
  return blockTypeNameToComponent;
}
