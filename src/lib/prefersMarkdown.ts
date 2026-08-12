import { isbot } from 'isbot';

/**
 * Clients that must keep receiving HTML, even though they are not browsers.
 *
 * Two families, for two different reasons:
 *
 * - Search crawlers index what they are served. Serving them a markdown
 *   representation of a page that humans see as HTML is cloaking, and it also
 *   throws away the structured data and meta tags the HTML carries.
 * - Link unfurlers (Slack, LinkedIn, WhatsApp, …) scrape `<meta property="og:*">`
 *   to build previews. Markdown has no `<head>`, so every DatoCMS link pasted
 *   into Slack would lose its preview card.
 *
 * Matched case-insensitively as substrings of the user agent.
 */
const HTML_ONLY_CLIENTS = [
  // Search crawlers
  'googlebot',
  'google-inspectiontool',
  'bingbot',
  'applebot',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'petalbot',
  'sogou',
  'slurp',
  'ia_archiver',
  'datocmssearchbot',
  // Link unfurlers / social previews
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'slack-imgproxy',
  'discordbot',
  'whatsapp',
  'telegrambot',
  'pinterest',
  'redditbot',
  'skypeuripreview',
  'embedly',
  'quora link preview',
  'flipboard',
  // Auditing tools that measure the real page
  'chrome-lighthouse',
  'gtmetrix',
  'pagespeed',
];

function isHtmlOnlyClient(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return HTML_ONLY_CLIENTS.some((client) => ua.includes(client));
}

/**
 * Decide whether a request should be answered with markdown instead of HTML.
 *
 * Three signals, in precedence order:
 *
 * 1. `Accept: text/markdown` — an explicit request always wins, in both
 *    directions. This is the only signal a caller can rely on.
 * 2. `Sec-Fetch-Mode` — browsers send it on every navigation and non-browser
 *    clients essentially never do, so its presence means "a human is looking at
 *    this". Cheaper and more robust than trying to enumerate browser UAs.
 * 3. The user agent itself, via `isbot`: not a browser and not on the HTML-only
 *    list above, so markdown is the more useful representation.
 *
 * The `Signature-Agent` header (RFC 9421 web bot auth) counts as agent traffic
 * too — an agent that bothers to sign its requests is not rendering HTML.
 *
 * Caching note: because the user agent can now change the representation, HTML
 * responses carry `Vary: Accept, User-Agent`, and Fastly will keep one cached
 * variant per distinct user agent string. The fix, when we want the hit ratio
 * back, is to collapse the dimension at the edge rather than to drop the
 * signal here — have VCL compute the boolean once and vary on that instead:
 *
 *   sub vcl_recv {
 *     set req.http.X-Prefers-Markdown = req.http.User-Agent ~ "(?i)bot|agent|crawler" ? "1" : "0";
 *   }
 *
 * then `Vary: Accept, X-Prefers-Markdown`, which has exactly two values.
 */
export function prefersMarkdown(request: Request): boolean {
  const accept = request.headers.get('accept') || '';

  if (accept.includes('text/markdown')) {
    return true;
  }

  // A browser navigation. Nothing else to consider.
  if (request.headers.get('sec-fetch-mode')) {
    return false;
  }

  const userAgent = request.headers.get('user-agent') || '';

  if (isHtmlOnlyClient(userAgent)) {
    return false;
  }

  if (request.headers.get('signature-agent')) {
    return true;
  }

  return isbot(userAgent);
}
