# Authentication

DatoCMS offers two ways for agents to authenticate.

## API tokens (Content Delivery & Management APIs)

Create an API token in your DatoCMS project under **Settings → API tokens**, then send it as a bearer token:

```
Authorization: Bearer <API_TOKEN>
```

- Content Delivery API (GraphQL): https://graphql.datocms.com/
- Content Management API (REST): https://site-api.datocms.com/
- Real-time Updates API (GraphQL + SSE): https://graphql-listen.datocms.com/

Regardless of which API token you use, make sure that its corresponding permissions are enabled:

- **Content Delivery API / Real-time Updates API** — enable **"Access the Content Delivery API"** or **"Access the Content Delivery API in Preview Mode"**
- **Content Management API** — enable **"Access the Content Management API"**

Without the right permissions toggled, the token won't be able to make calls to those APIs.

Docs:

- https://www.datocms.com/docs/content-management-api/authentication
- https://www.datocms.com/docs/content-delivery-api/authentication
- https://www.datocms.com/docs/real-time-updates-api/api-reference

## OAuth (MCP server)

The DatoCMS MCP server at https://mcp.datocms.com authenticates via OAuth: connect it from any MCP-compatible client and authorize through DatoCMS.

Docs: https://www.datocms.com/docs/mcp-server
