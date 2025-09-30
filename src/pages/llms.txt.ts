import type { APIRoute } from 'astro';
import { baseUrl } from '~/lib/draftMode';
import { handleUnexpectedError } from './api/_utils';
import { fetchSitemapUrls } from './sitemap.xml';

const EXCLUDE_CONTAINS = ['/404'];
const DOMAIN_ONLY_SECTIONS = true;

function shouldInclude(url: string, origin: string) {
  if (EXCLUDE_CONTAINS.some((p) => url.includes(p))) return false;
  if (DOMAIN_ONLY_SECTIONS && !url.startsWith('/')) {
    try {
      const u = new URL(url, origin);
      return u.origin === origin;
    } catch {
      return false;
    }
  }
  return true;
}

function sectionFor(path: string) {
  if (path.startsWith('/docs')) return 'Docs';
  if (path.startsWith('/blog')) return 'Blog';
  if (path.startsWith('/features')) return 'Features';
  if (path.startsWith('/user-guides')) return 'User Guides';
  if (path.startsWith('/product-updates')) return 'Product Updates';
  return 'Site';
}

type Meta = { title: string; desc: string };

async function fetchMeta(absUrl: string): Promise<Meta> {
  try {
    const res = await fetch(absUrl, { redirect: 'follow' });
    if (!res.ok) return { title: absUrl, desc: '' };
    const html = await res.text();

    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || absUrl;

    const desc =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim() ||
      html
        .match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
        ?.trim() ||
      '';

    return {
      title: title.replace(/\s+/g, ' ').trim(),
      desc: desc.replace(/\s+/g, ' ').trim(),
    };
  } catch {
    return { title: absUrl, desc: '' };
  }
}

async function mapWithConcurrency<I, O>(
  items: I[],
  limit: number,
  fn: (item: I) => Promise<O>,
): Promise<O[]> {
  const ret: O[] = [];
  let idx = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, Math.max(1, items.length)) }).map(async () => {
      while (idx < items.length) {
        const i = idx++;
        ret[i] = await fn(items[i]);
      }
    }),
  );

  return ret;
}
function escapeMd(s: string) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/`/g, '\\`');
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const origin = baseUrl(request);

    const responseHeaders = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
    });

    const paths = (await fetchSitemapUrls(request, responseHeaders)).filter((p) =>
      shouldInclude(p, origin),
    );

    const absUrls = paths.map((p) => new URL(p, origin).toString());

    const CONCURRENCY = 12;
    const metas = await mapWithConcurrency(absUrls, CONCURRENCY, fetchMeta);

    const items = paths.map((path, i) => {
      const url = new URL(path, origin).toString();
      return {
        url,
        path,
        title: metas[i].title || url,
        desc: metas[i].desc || '',
        section: sectionFor(path),
      };
    });

    const header = [
      '# DatoCMS llms.txt',
      `# Domain: ${origin}`,
      `# Generated: ${new Date().toISOString()}`,
      '',
    ].join('\n');

    const bySection = items.reduce<Record<string, typeof items>>((acc, it) => {
      (acc[it.section] ||= []).push(it);
      return acc;
    }, {});

    const lines: string[] = [header];

    for (const section of Object.keys(bySection).sort()) {
      lines.push(`## ${section}`, '');
      for (const it of bySection[section]) {
        const urlForLlm =
          section === 'Docs' ? (it.url.endsWith('.md') ? it.url : `${it.url}.md`) : it.url;

        const title = escapeMd(it.title);
        const desc = it.desc ? `: ${escapeMd(it.desc)}` : '';

        lines.push(`- [${title}](${urlForLlm})${desc}`);
      }
      lines.push('');
    }

    if (!responseHeaders.has('Cache-Control')) {
      responseHeaders.set(
        'Cache-Control',
        'public, max-age=300, s-maxage=1800, stale-while-revalidate=86400',
      );
    }
    responseHeaders.set('Content-Type', 'text/plain; charset=utf-8');

    const body = lines.join('\n');
    return new Response(body, { headers: responseHeaders });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
