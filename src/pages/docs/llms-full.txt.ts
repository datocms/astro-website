import type { APIRoute } from 'astro';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import { handleUnexpectedError } from '../api/_utils';

// Query to get all doc group starting points
const query = graphql(/* GraphQL */ `
  query LlmsFullTxtQuery {
    llmsFull {
      content
    }
  }
`);

export const GET: APIRoute = async ({ request }) => {
  try {
    const responseHeaders = new Headers({
      'Content-Type': 'text/markdown; charset=utf-8',
    });

    // Fetch all doc groups from DatoCMS
    const { llmsFull } = await executeQueryOutsideAstro(query, {
      request,
      responseHeaders,
    });

    return new Response(llmsFull?.content || '', {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
