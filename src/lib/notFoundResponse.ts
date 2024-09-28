export function avoidAstroTypeCheckBug(_: unknown) {
  // See https://github.com/withastro/language-tools/issues/476 for more context.
  return;
}

export function notFoundResponse() {
  return new Response(null, {
    status: 404,
    statusText: 'Not found',
  });
}
