export function notFoundResponse() {
  return new Response(null, {
    status: 404,
    statusText: 'Not found',
  });
}
