import {
  render as toPlainText,
  type StructuredTextDocument,
} from 'datocms-structured-text-to-plain-text';
import { isHeading, type Heading, type Node } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';
import { buildUrlFromGql } from '~/lib/datocms/gqlUrlBuilder';
import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { graphql, readFragment, type FragmentOf } from '~/lib/datocms/graphql';
import { slugify } from '~/lib/slugify';
import type { SidebarEntry, SidebarGroup } from './types';

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
): Array<SidebarEntry | SidebarGroup> {
  return readFragment(DocGroupItemsFragment, group).pagesOrSections.map((pageOrSection) =>
    pageOrSection.__typename === 'DocGroupPageRecord'
      ? {
          label: pageOrSection.page.title,
          url: buildUrlFromGql(pageOrSection.page),
        }
      : {
          title: pageOrSection.title,
          entries: pageOrSection.pages.map(({ page }) => ({
            label: page.title,
            url: buildUrlFromGql(page),
          })),
        },
  );
}

export function buildItemsFromHeadings(
  structuredTextValue: unknown,
): Array<SidebarEntry | SidebarGroup> {
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
