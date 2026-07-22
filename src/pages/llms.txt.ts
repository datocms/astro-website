import type { APIRoute } from 'astro';
import { baseUrl } from '~/lib/draftMode';

export const GET: APIRoute = ({ request }) => {
  const origin = baseUrl(request);
  const url = (path: string) => new URL(path, origin).href;

  const body = `# DatoCMS

> DatoCMS is the headless CMS that combines GraphQL and REST APIs with a configurable content model — deliver content to websites, mobile apps, and AI agents from a single source of truth.

## Documentation

- [Documentation index (LLM-friendly)](${url('/docs/llms.txt')}): The full docs tree as curated markdown links, from getting started through advanced topics
- [Content Delivery API](${url('/docs/content-delivery-api')}): GraphQL API reference for fetching published content into your apps
- [Content Management API](${url('/docs/content-management-api')}): REST API for creating, updating, and managing content programmatically
- [Structured text / Dast](${url('/docs/dast')}): The abstract syntax tree format used by DatoCMS for rich text fields
- [MCP server](${url('/docs/mcp')}): Let AI agents interact with your DatoCMS project through the Model Context Protocol

## Product

- [Product overview](${url('/product')}): What DatoCMS does and how it's different
- [Features](${url('/features')}): The full feature set — structured content, localization, media area, plugins, and more
- [Pricing](${url('/pricing')}): Plans and limits
- [Enterprise](${url('/features/ai')}): AI features — auto-translation, image tagging, content generation

## Learn

- [Blog](${url('/blog')}): Product updates, technical deep-dives, and CMS best practices
- [Academy](${url('/academy')}): Structured courses covering everything from content modeling to advanced GraphQL
- [Glossary](${url('/glossary')}): Definitions of CMS and web-development terms, optimized for LLM citations

## For agents

- [Agent skills](${url('/.well-known/agent-skills/index.json')}): Index of skills for AI coding agents working with DatoCMS projects
- [API catalog](${url('/.well-known/api-catalog')}): Machine-readable catalog of DatoCMS APIs for agent discovery
- [MCP server card](${url('/.well-known/mcp.json')}): JSON card describing the DatoCMS MCP server
- [MCP server](https://mcp.datocms.com): Let Claude and other AI assistants chat with your DatoCMS projects
- [Authentication](${url('/.well-known/auth.md')}): How to authenticate against DatoCMS APIs, written for AI agents

## Optional

- [Full site content](${url('/llms-full.txt')}): Every docs page plus the rest of the site, concatenated — skip if context is tight
- [Docs full text](${url('/docs/llms-full.txt')}): All documentation pages concatenated
- [Site content beyond docs](${url('/llms-extras.txt')}): Blog, academy, product pages, and more — skip if you only need the docs
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Surrogate-Control': 'max-age=31536000',
    },
  });
};
