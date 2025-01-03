import type { TransformedMeta } from 'datocms-structured-text-generic-html-renderer';
import type { ItemLink } from 'datocms-structured-text-utils';
import { type Node as DastNode, type Document } from 'datocms-structured-text-utils';

export { default as Text } from './Component.astro';

type AstroComponent<P> = (props: P) => any;

type DatocmsRecord = {
  __typename: string;
  id: string;
} & {
  [prop: string]: unknown;
};

declare type StructuredText<
  R1 extends DatocmsRecord = DatocmsRecord,
  R2 extends DatocmsRecord = R1,
> = {
  value: Document | unknown;
  blocks?: R1[];
  links?: R2[];
};

type BlockComponents<R1 extends DatocmsRecord, _R2 extends DatocmsRecord> = {
  [R in R1 as R['__typename']]: AstroComponent<{ block: R }>;
};

type LinkToRecordComponents<_R1 extends DatocmsRecord, R2 extends DatocmsRecord> = {
  [R in R2 as R['__typename']]: AstroComponent<{
    node: ItemLink;
    attrs: TransformedMeta;
    record: R;
  }>;
};

type InlineRecordComponents<_R1 extends DatocmsRecord, R2 extends DatocmsRecord> = {
  [R in R2 as R['__typename']]: AstroComponent<{ record: R }>;
};

type Props<R1 extends DatocmsRecord, R2 extends DatocmsRecord> =
  | {
      data: Document | DastNode | null | undefined;
      blockComponents?: never;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks: R1[]; links: R2[] })
        | null
        | undefined;
      blockComponents: BlockComponents<R1, R2>;
      linkToRecordComponents: LinkToRecordComponents<R1, R2>;
      inlineRecordComponents: InlineRecordComponents<R1, R2>;
    }
  | {
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks: R1[]; links?: never })
        | null
        | undefined;
      blockComponents: BlockComponents<R1, R2>;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks?: never; links: R2[] })
        | null
        | undefined;
      blockComponents?: never;
      linkToRecordComponents: LinkToRecordComponents<R1, R2>;
      inlineRecordComponents: InlineRecordComponents<R1, R2>;
    }
  | {
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks?: never; links?: never })
        | null
        | undefined;
      blockComponents?: never;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    };

export function ensureValidStructuredTextProps<R1 extends DatocmsRecord, R2 extends DatocmsRecord>(
  props: Props<R1, R2>,
): Props<R1, R2> {
  return props;
}
