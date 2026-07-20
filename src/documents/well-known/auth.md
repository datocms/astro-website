# Authentication

DatoCMS offers two ways for agents to authenticate.

## API tokens (Content Delivery & Management APIs)

Create an API token in your DatoCMS project under **Settings → API tokens**, then send it as a bearer token:

    Authorization: Bearer <API_TOKEN>

- Content Delivery API (GraphQL): https://graphql.datocms.com/
- Content Management API (REST): https://site-api.datocms.com

Docs: https://www.datocms.com/docs/content-management-api

## OAuth (MCP server)

The DatoCMS MCP server at https://mcp.datocms.com authenticates via OAuth — connect it from any MCP-compatible client and authorize through DatoCMS.

Docs: https://www.datocms.com/docs/mcp-server
