export async function invalidateCacheTags(keys: string[]) {
  // return await ky
  //   .post(`https://api.fastly.com/service/${FASTLY_SERVICE_ID}/purge`, {
  //     headers: {
  //       'fastly-key': FASTLY_KEY,
  //       // required for stale-while-revalidate to work
  //       'fastly-soft-purge': '1',
  //     },
  //     json: { surrogate_keys: keys },
  //   })
  //   .json();
}
