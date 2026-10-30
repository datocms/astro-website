import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { readFragment, type FragmentOf } from 'gql.tada';
import type { FAQPage, WithContext } from 'schema-dts';
import { FaqBlockFragment, FaqRecordFragment } from './graphql';

type FaqItem = FragmentOf<typeof FaqRecordFragment> | FragmentOf<typeof FaqBlockFragment>;

export function faqsToJsonLd(faqs: FaqItem[]): WithContext<FAQPage> | null {
  const mainEntity = faqs
    .map((masked) => {
      const isBlock =
        (masked as unknown as { __typename: string }).__typename === 'QuestionAnswerRecord';
      const data = isBlock
        ? readFragment(FaqBlockFragment, masked as FragmentOf<typeof FaqBlockFragment>)
        : readFragment(FaqRecordFragment, masked as FragmentOf<typeof FaqRecordFragment>);

      const question =
        data.__typename === 'QuestionAnswerRecord' ? toPlainText(data.question) : data.question;
      const answer = toPlainText(data.answer);

      if (!question || !answer) return null;

      return {
        '@type': 'Question' as const,
        name: question,
        acceptedAnswer: { '@type': 'Answer' as const, text: answer },
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  if (mainEntity.length === 0) return null;

  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity };
}
