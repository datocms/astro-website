import type { APIRoute } from 'astro';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import { handleUnexpectedError } from './api/_utils';

const query = graphql(/* GraphQL */ `
  query LlmsExtrasTxtQuery {
    llmstxt {
      extras
    }
  }
`);

export const GET: APIRoute = async ({ request }) => {
  try {
    const responseHeaders = new Headers({
      'Content-Type': 'text/markdown; charset=utf-8',
    });

    const { llmstxt } = await executeQueryOutsideAstro(query, {
      request,
      responseHeaders,
    });

    return new Response(llmstxt?.extras || '', {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
