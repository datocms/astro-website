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
 * An explicit `Accept: text/markdown`. The only signal a caller can rely on,
 * and the only one we let change the body at a cacheable URL — it costs us a
 * `Vary: Accept`, which has a handful of distinct values in practice.
 */
export function acceptsMarkdown(request: Request): boolean {
  return (request.headers.get('accept') || '').includes('text/markdown');
}

/**
 * A client that is not a browser and would be better served markdown, inferred
 * rather than declared. Two signals:
 *
 * 1. `Sec-Fetch-Mode` — browsers send it on every navigation and non-browser
 *    clients essentially never do, so its presence means "a human is looking at
 *    this". Cheaper and more robust than trying to enumerate browser UAs.
 * 2. The user agent itself, via `isbot`: not a browser and not on the HTML-only
 *    list above, so markdown is the more useful representation.
 *
 * The `Signature-Agent` header (RFC 9421 web bot auth) counts too — an agent
 * that bothers to sign its requests is not rendering HTML.
 *
 * Deliberately *not* used to swap the body of a cacheable response. Doing that
 * would mean `Vary: User-Agent`, and Fastly would then keep one variant per
 * distinct user agent string against objects we cache for a year. The caller
 * redirects to the `.md` twin instead — see `agentRedirect` in the middleware.
 */
export function looksLikeAgent(request: Request): boolean {
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
