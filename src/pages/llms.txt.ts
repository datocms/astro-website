import type { APIRoute } from 'astro';
import { baseUrl } from '~/lib/draftMode';
import { fetchBlob } from '~/lib/serveLlmsBundle';

const BLOCKQUOTE =
  'DatoCMS is the headless CMS that combines GraphQL and REST APIs ' +
  'with a configurable content model — deliver content to websites, ' +
  'mobile apps, and AI agents from a single source of truth.';

const AGENTS_SECTION = (url: (path: string) => string) => `## For agents

- [Agent skills](${url('/.well-known/agent-skills/index.json')}): Index of skills for AI coding agents working with DatoCMS projects
- [API catalog](${url('/.well-known/api-catalog')}): Machine-readable catalog of DatoCMS APIs for agent discovery
- [MCP server card](${url('/.well-known/mcp.json')}): JSON card describing the DatoCMS MCP server
- [MCP server](https://mcp.datocms.com): Let Claude and other AI assistants chat with your DatoCMS projects
- [Authentication](${url('/.well-known/auth.md')}): How to authenticate against DatoCMS APIs, written for AI agents`;

const OPTIONAL_SECTION = (url: (path: string) => string) => `## Optional

- [Full site content](${url('/llms-full.txt')}): Every docs page plus the rest of the site, concatenated — skip if context is tight
- [Docs full text](${url('/docs/llms-full.txt')}): All documentation pages concatenated`;

/**
 * Root /llms.txt — built by merging two nightly-generated blob bundles:
 *
 *   1. llms.txt          – curated docs index (## Docs, ## Official packages READMEs)
 *   2. llms-extras.txt   – non-docs content (## Glossary, ## Academy, ## Blog, …)
 *
 * The blobs are the source of truth for links; we insert the hand-written
 * blockquote, the ## For agents section (not covered by any blob), and the
 * ## Optional pointers to full-text ingestion bundles.
 *
 * llms-extras.txt has NO public route — its content only surfaces here.
 */
export const GET: APIRoute = async ({ request }) => {
  const origin = baseUrl(request);
  const url = (path: string) => new URL(path, origin).href;

  const [docs, extras] = await Promise.all([fetchBlob('llms.txt'), fetchBlob('llms-extras.txt')]);

  // If the blobs are unavailable (blob store down, env misconfigured), serve a
  // minimal fallback so the endpoint never 404s for AI crawlers.
  if (!docs) {
    const fallback = `# DatoCMS

> ${BLOCKQUOTE}

${AGENTS_SECTION(url)}

${OPTIONAL_SECTION(url)}
`;

    return new Response(fallback, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Surrogate-Control': 'max-age=31536000',
      },
    });
  }

  // Insert the blockquote after the H1 line
  const docsWithBlockquote = docs.replace(/^(# .+)$/m, `$1\n\n> ${BLOCKQUOTE}`);

  // Strip the H1 from extras (it's the same "# DatoCMS") so we don't repeat it
  const extrasBody = extras ? extras.replace(/^# .+\n\n/, '') : '';

  const body = [docsWithBlockquote, extrasBody, AGENTS_SECTION(url), OPTIONAL_SECTION(url)]
    .filter(Boolean)
    .join('\n\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Surrogate-Control': 'max-age=31536000',
    },
  });
};
