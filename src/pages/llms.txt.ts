import type { APIRoute } from 'astro';
import { baseUrl } from '~/lib/draftMode';

export const GET: APIRoute = ({ request }) => {
  const origin = baseUrl(request);
  const url = (path: string) => new URL(path, origin).href;

  const body = `# DatoCMS

> DatoCMS is the GraphQL and REST headless CMS for the modern web — model your content once and deliver it to any channel via API.

## Everything in one file
- [Complete site content — all docs plus the rest of the site, concatenated](${url('/llms-full.txt')})

## Documentation
- [Docs index (LLM-friendly)](${url('/docs/llms.txt')})
- [Content Delivery API — GraphQL](${url('/docs/content-delivery-api')})
- [Content Management API — REST](${url('/docs/content-management-api')})

## Product
- [Product overview](${url('/product')})
- [Features](${url('/features')})
- [Pricing](${url('/pricing')})

## Learn
- [Blog](${url('/blog')})
- [Academy](${url('/academy')})
- [Glossary](${url('/glossary')})

## Full text by section
- [All documentation](${url('/docs/llms-full.txt')})
- [Site content beyond the docs](${url('/llms-extras.txt')})

## For agents
- [Agent skills](${url('/.well-known/agent-skills.json')})
- [API catalog](${url('/.well-known/api-catalog')})
- [MCP server card](${url('/.well-known/mcp.json')})
- [MCP server](https://mcp.datocms.com)
- [Authentication](${url('/.well-known/auth.md')})
- [Sitemap](${url('/sitemap.xml')})
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Surrogate-Control': 'max-age=31536000',
    },
  });
};
