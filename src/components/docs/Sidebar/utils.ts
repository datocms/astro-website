import {
  render as toPlainText,
  type StructuredTextDocument,
} from 'datocms-structured-text-to-plain-text';
import { isHeading, type Heading, type Node } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';
import { buildUrlFromGql, DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder';
import { graphql, readFragment, type FragmentOf } from '~/lib/datocms/graphql';
import { slugify } from '~/lib/slugify';
import type { Entry, Group } from './types';

export const DocGroupItemsFragment = graphql(
  /* GraphQL */ `
    fragment DocGroupItemsFragment on DocGroupRecord {
      pagesOrSections: pages {
        __typename
        ... on DocGroupPageRecord {
          page {
            id
            title
            slug
            __typename
            ...DocPageUrlFragment
          }
        }
        ... on DocGroupSectionRecord {
          title
          pages {
            page {
              id
              title
              slug
              __typename
              ...DocPageUrlFragment
            }
          }
        }
      }
    }
  `,
  [DocPageUrlFragment],
);

export function buildItemsForDocGroup(
  group: FragmentOf<typeof DocGroupItemsFragment>,
): Array<Entry | Group> {
  return readFragment(DocGroupItemsFragment, group).pagesOrSections.map((pageOrSection) =>
    pageOrSection.__typename === 'DocGroupPageRecord'
      ? {
          label: pageOrSection.page.title,
          url: buildUrlFromGql(pageOrSection.page),
        }
      : {
          label: pageOrSection.title,
          entries: pageOrSection.pages.map(({ page }) => ({
            label: page.title,
            url: buildUrlFromGql(page),
          })),
        },
  );
}

export function buildItemsFromHeadings(structuredTextValue: unknown): Array<Entry | Group> {
  return filterNodes((structuredTextValue as StructuredTextDocument).document, (n): n is Heading =>
    isHeading(n as Node),
  ).map((heading) => {
    const innerText = toPlainText(heading)!;

    return {
      url: `#${slugify(innerText)}`,
      label: innerText,
    };
  });
}
