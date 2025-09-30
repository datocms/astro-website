import type { APIRoute } from 'astro';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';

const DocGroupForMd = graphql(/* GraphQL */ `
  query DocGroupForMd($groupSlug: String!) {
    group: docGroup(filter: { slug: { eq: $groupSlug } }) {
      id
      pagesOrSections: pages {
        __typename
        ... on DocGroupPageRecord {
          page {
            id
            slug
          }
        }
        ... on DocGroupSectionRecord {
          title
          pages {
            page {
              id
              slug
            }
          }
        }
      }
    }
  }
`);

const DocPageForMd = graphql(/* GraphQL */ `
  query DocPageForMd($pageId: ItemId!) {
    page: docPage(filter: { id: { eq: $pageId } }) {
      title
      content {
        value
      }
    }
  }
`);

type STNode = any;

function mdInline(n: STNode): string {
  if (!n) return '';
  if (typeof n === 'string') return n;

  const { type, value, marks, url, title, children } = n;

  if (type === 'span') {
    let t = value ?? '';
    if (marks?.includes('code')) t = '`' + t + '`';
    if (marks?.includes('strong')) t = `**${t}**`;
    if (marks?.includes('emphasis')) t = `_${t}_`;
    return t;
  }

  if (type === 'link') {
    const text = (children || []).map(mdInline).join('');
    const label = text || title || url || '';
    return `[${label}](${url})`;
  }

  return (children || []).map(mdInline).join('');
}

function mdBlock(n: STNode): string {
  if (!n) return '';
  const { type, level, children, language, code, items } = n;

  switch (type) {
    case 'heading': {
      const h = '#'.repeat(Math.min(Math.max(level ?? 1, 1), 6));
      return `${h} ${(children || []).map(mdInline).join('')}`;
    }
    case 'paragraph':
      return (children || []).map(mdInline).join('') || '';
    case 'list':
      return (items || [])
        .map((li: any) => `- ${(li.children || []).map(mdInline).join('')}`)
        .join('\n');
    case 'code':
      return `\`\`\`${language || ''}\n${code || ''}\n\`\`\``;
    case 'blockquote':
      return (children || [])
        .map(mdBlock)
        .join('\n')
        .split('\n')
        .map((l) => (l ? `> ${l}` : '>'))
        .join('\n');
    default:
      return (children || []).map(mdBlock).join('\n');
  }
}

function structuredTextToMarkdown(value: any): string {
  if (!value) return '';
  const nodes: STNode[] = value?.document?.children || value?.children || [];
  return nodes.map(mdBlock).filter(Boolean).join('\n\n');
}

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const raw = (params as any).rest ?? (params as any).slug ?? '';

    const parts = typeof raw === 'string' && raw.length ? raw.split('/') : [];

    const groupSlug = parts[0];
    const pageSlug = parts.length >= 2 ? parts[parts.length - 1] : 'index';

    const responseHeaders = new Headers({
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=86400',
    });

    if (!groupSlug) {
      return new Response(`# Not found\n\nInvalid docs path.`, {
        status: 404,
        headers: responseHeaders,
      });
    }

    const { group } = await executeQueryOutsideAstro(DocGroupForMd, {
      request,
      responseHeaders,
      variables: { groupSlug },
      excludeInvalid: true,
    });

    if (!group) {
      return new Response(`# Not found`, {
        status: 404,
        headers: responseHeaders,
      });
    }

    const handles = (group.pagesOrSections ?? []).flatMap((entry: any) =>
      entry.__typename === 'DocGroupPageRecord'
        ? [entry.page]
        : (entry.pages ?? []).map((p: any) => p.page),
    );

    const handle = handles.find((p: any) => p.slug === pageSlug);
    if (!handle) {
      const path = `/docs/${groupSlug}/${pageSlug}`;
      return new Response(`# Not found\n\nNo doc at \`${path}\`.`, {
        status: 404,
        headers: responseHeaders,
      });
    }

    const result = await executeQueryOutsideAstro(DocPageForMd, {
      request,
      responseHeaders,
      variables: { pageId: handle.id },
      excludeInvalid: true,
      returnCacheTags: true,
    });

    const page = (result as any)?.page;
    if (!page) {
      return new Response(`# Not found\n\nPage not found.`, {
        status: 404,
        headers: responseHeaders,
      });
    }

    const title = (page.title || pageSlug).toString();
    const stValue = page.content?.value;
    const mdBody = structuredTextToMarkdown(stValue);

    const lines: string[] = [`# ${title}`];
    if (mdBody) lines.push('', mdBody);

    return new Response(lines.join('\n'), { headers: responseHeaders });
  } catch (err) {
    return new Response(`# Error\n\n${(err as Error).message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }
};
