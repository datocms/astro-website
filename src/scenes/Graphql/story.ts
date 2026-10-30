/*
 * The data of the fragment "From the edge." of the GraphQL chapter
 * (Ping.astro). The fragment measures the TTFB from the browser of the
 * visitor at the nearest edge of the Content Delivery API, live. It
 * shows no number that it did not measure.
 */

/**
 * The endpoint that the fragment calls: the edge of the Content Delivery
 * API that gets the request answers it alone, with no request to the
 * origin, and with the code of that edge: {"datacenter":"MXP"}. CORS
 * allows all the origins, and `Timing-Allow-Origin: *` gives the
 * Resource Timing of the request to the page: responseStart -
 * requestStart is the TTFB. (The worker is
 * packages/cloudflare-worker-cda/src/worker.ts of cloudflare-workers.)
 * A browser that does not give the Resource Timing gets the time of the
 * fetch, and the caption says round trip.
 */
export const ENDPOINT = 'https://graphql.datocms.com/geo/ping';

/** The timed requests after the warm-up. The fragment shows their median. */
export const SAMPLES = 5;

/** After this time with no answer to a request, the fragment shows the fallback (FAILED) */
export const TIMEOUT_MS = 3000;

/**
 * The globe behind the number: the video of the home page, quiet.
 * The squares of the sea and of the land are the inverse surface with 8%
 * and 22% of the text, with the inverse surface as stroke: the land
 * shows clearly, the sea a little. No lens: the globe is not
 * a thing to touch.
 */
export const GLOBE = {
  src: '/videos/spinning-globe.pxv',
  settings: {
    bgFill: 'var(--surface-inverse)',
    bgStroke: 'var(--surface-inverse)',
    midFill: 'color-mix(in srgb, var(--surface-inverse) 92%, var(--text-on-inverse))',
    midStroke: 'var(--surface-inverse)',
    highFill: 'color-mix(in srgb, var(--surface-inverse) 78%, var(--text-on-inverse))',
    highStroke: 'var(--surface-inverse)',
    hover: false,
  },
};

export const BROWSER = { wide: 'Your browser', narrow: 'You' };

export const EDGE = 'Nearest edge';

/**
 * The static fallback: the words in place of the number when no answer
 * comes. They claim no number. They repeat the text of the fragment.
 */
export const FAILED = 'From the nearest edge';

/**
 * The caption under the number. `still` before the answer and with no
 * JS: no number yet, thus no "just now". `ttfb` when the browser gives
 * the Resource Timing of the requests, `roundTrip` when the fragment
 * times the fetch. `failed` with no answer (the three seconds are
 * TIMEOUT_MS): it tells the visitor that the measure did not work and
 * keeps the claim of the fragment. The pills already tell from where to where.
 */
export const CAPTION = {
  still: 'We measure it live, in your browser.',
  ttfb: 'Time to first byte. Median of five requests, just now.',
  roundTrip: 'Round trip to our API. Median of five requests, just now.',
  failed: 'We could not measure it from here. Every query is still answered from the nearest edge.',
};

/**
 * The cities of the edges, by the code that the endpoint gives (the IATA
 * code of the nearest airport, as Cloudflare names its data centres).
 * Only the large ones: an edge that is not here shows its code alone.
 */
export const CITIES: Record<string, string> = {
  AMS: 'Amsterdam',
  ARN: 'Stockholm',
  ATL: 'Atlanta',
  BCN: 'Barcelona',
  BOG: 'Bogotá',
  BOM: 'Mumbai',
  BOS: 'Boston',
  BRU: 'Brussels',
  CDG: 'Paris',
  CPH: 'Copenhagen',
  DEL: 'New Delhi',
  DEN: 'Denver',
  DFW: 'Dallas',
  DUB: 'Dublin',
  DXB: 'Dubai',
  EWR: 'Newark',
  EZE: 'Buenos Aires',
  FCO: 'Rome',
  FRA: 'Frankfurt',
  GRU: 'São Paulo',
  HEL: 'Helsinki',
  HKG: 'Hong Kong',
  IAD: 'Ashburn',
  ICN: 'Seoul',
  JNB: 'Johannesburg',
  KIX: 'Osaka',
  LAX: 'Los Angeles',
  LHR: 'London',
  LIS: 'Lisbon',
  MAD: 'Madrid',
  MEL: 'Melbourne',
  MEX: 'Mexico City',
  MIA: 'Miami',
  MRS: 'Marseille',
  MXP: 'Milan',
  NRT: 'Tokyo',
  ORD: 'Chicago',
  OSL: 'Oslo',
  PRG: 'Prague',
  SCL: 'Santiago',
  SEA: 'Seattle',
  SIN: 'Singapore',
  SJC: 'San Jose',
  SYD: 'Sydney',
  VIE: 'Vienna',
  WAW: 'Warsaw',
  YVR: 'Vancouver',
  YYZ: 'Toronto',
  ZRH: 'Zurich',
};
