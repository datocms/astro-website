import type { APIRoute } from 'astro';
import type { TadaDocumentNode } from 'gql.tada';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { BlogPostUrlFragment, buildUrlForBlogPost } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { DocPageUrlFragment, buildUrlForDocPage } from '~/lib/datocms/gqlUrlBuilder/docPage';
import {
  ProductUpdateUrlFragment,
  buildUrlForProductUpdate,
} from '~/lib/datocms/gqlUrlBuilder/productUpdate';
import { graphql } from '~/lib/datocms/graphql';
import { baseUrl } from '~/lib/draftMode';
import { handleUnexpectedError } from './api/_utils';

interface LlmsTxtItem {
  description: string;
  url?: string;
  depth?: number;
}

interface LlmsTxtSection {
  title: string;
  items: LlmsTxtItem[];
}

// Single comprehensive GraphQL query for all DatoCMS dynamic content
const llmsTxtQuery = graphql(
  /* GraphQL */ `
    query LlmsTxtQuery {
      docRoots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          pagesTree: pages {
            __typename
            ... on DocGroupPageRecord {
              page {
                title
                ...DocPageUrlFragment
              }
            }
            ... on DocGroupSectionRecord {
              title
              pages {
                __typename
                page {
                  title
                  ...DocPageUrlFragment
                }
              }
            }
          }
        }
      }
      blogPosts: allBlogPosts(first: 30, orderBy: _firstPublishedAt_DESC) {
        id
        title
        ...BlogPostUrlFragment
      }
      productUpdates: allChangelogEntries(
        first: 30
        orderBy: _firstPublishedAt_DESC
        filter: { showInBlog: { eq: true } }
      ) {
        title
        _firstPublishedAt
        ...ProductUpdateUrlFragment
      }
    }
  `,
  [BlogPostUrlFragment, ProductUpdateUrlFragment, DocPageUrlFragment],
);

/**
 * Generates an llms.txt file following the llmstxt.org specification.
 * This file provides a curated, markdown-formatted index of key pages
 * optimized for LLM consumption.
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    const siteBaseUrl = baseUrl(request);
    const responseHeaders = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
    });

    // Fetch all DatoCMS content in a single query
    const datoCmsData = await executeQueryOutsideAstro(llmsTxtQuery, {
      request,
      responseHeaders,
    });

    // Build sections
    const sections: LlmsTxtSection[] = [
      ...buildDocumentationSections(siteBaseUrl, datoCmsData.docRoots),
      buildDatoCmsSection(
        'Blog',
        siteBaseUrl,
        datoCmsData.blogPosts.map((p) => ({
          title: p.title,
          url: buildUrlForBlogPost(p),
        })),
      ),
      buildDatoCmsSection(
        'Product Updates',
        siteBaseUrl,
        datoCmsData.productUpdates.map((p) => ({
          title: `${formatDate(p._firstPublishedAt)} - ${p.title}`,
          url: buildUrlForProductUpdate(p),
        })),
      ),
    ];

    // Filter out empty sections
    const nonEmptySections = sections.filter((s) => s.items.length > 0);

    // Generate the llms.txt content
    const content = generateLlmsTxt(nonEmptySections);

    return new Response(content, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};

function generateLlmsTxt(sections: LlmsTxtSection[]): string {
  let output = '';

  // H1 Title (required by spec)
  output += '# DatoCMS\n\n';

  // Blockquote summary (recommended by spec)
  output +=
    '> DatoCMS is a headless CMS platform providing GraphQL and REST APIs for content management. Features include structured content modeling, real-time updates, multi-language support, built-in image/video processing, and a global CDN. Designed for developers building modern web applications, mobile apps, and omnichannel digital experiences.\n\n';

  // Add each section
  for (const section of sections) {
    if (section.items.length === 0) continue;

    output += `## ${section.title}\n\n`;

    for (const item of section.items) {
      const indent = '  '.repeat(item.depth ?? 0);
      const label = item.url ? `[${item.description}](${item.url})` : item.description;
      output += `${indent}- ${label}\n`;
    }

    output += '\n';
  }

  return output.trim() + '\n';
}

/**
 * Builds a section from DatoCMS data (already fetched via GraphQL)
 */
function buildDatoCmsSection(
  title: string,
  siteBaseUrl: string,
  items: Array<{ title: string; url: string }>,
): LlmsTxtSection {
  return {
    title,
    items: items.map((item) => ({
      url: `${siteBaseUrl}${item.url}.md`,
      description: item.title,
      depth: 0,
    })),
  };
}

type ExtractResult<T> = T extends TadaDocumentNode<infer R, any> ? R : never;

function buildDocumentationSections(
  siteBaseUrl: string,
  docRoots: ExtractResult<typeof llmsTxtQuery>['docRoots'],
): LlmsTxtSection[] {
  return docRoots.map((root) => {
    const items: LlmsTxtItem[] = [];

    for (const child of root.children ?? []) {
      items.push({
        description: child.name,
        depth: 0,
      });

      for (const entry of child.pagesTree ?? []) {
        if (!entry) continue;

        if (entry.__typename === 'DocGroupPageRecord') {
          const page = entry.page;
          items.push({
            description: page.title,
            url: `${siteBaseUrl}${buildUrlForDocPage(page)}.md`,
            depth: 1,
          });
        } else if (entry.__typename === 'DocGroupSectionRecord') {
          items.push({
            description: entry.title,
            depth: 1,
          });

          for (const sectionPage of entry.pages) {
            if (!sectionPage) continue;
            const page = sectionPage.page;

            items.push({
              description: page.title,
              url: `${siteBaseUrl}${buildUrlForDocPage(page)}.md`,
              depth: 2,
            });
          }
        }
      }
    }

    return {
      title: root.name,
      items,
    };
  });
}

function formatDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.valueOf())) return iso;
  return parsed.toISOString().slice(0, 10);
}
