import { describe, expect, it } from 'vitest';
import { prefersMarkdown } from './prefersMarkdown';

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function request(headers: Record<string, string>): Request {
  return new Request('https://www.datocms.com/docs', { headers });
}

describe('prefersMarkdown', () => {
  it('honours an explicit Accept: text/markdown', () => {
    expect(prefersMarkdown(request({ accept: 'text/markdown' }))).toBe(true);
    expect(prefersMarkdown(request({ accept: 'text/markdown, text/html;q=0.9, */*;q=0.8' }))).toBe(
      true,
    );
  });

  it('serves HTML to browsers', () => {
    expect(
      prefersMarkdown(
        request({
          'user-agent': CHROME_UA,
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'sec-fetch-mode': 'navigate',
        }),
      ),
    ).toBe(false);
  });

  it('serves markdown to AI agents', () => {
    for (const ua of [
      'Claude-User/1.0',
      'ClaudeBot/1.0',
      'Claude-SearchBot/1.0',
      'GPTBot/1.2',
      'ChatGPT-User/1.0',
      'OAI-SearchBot/1.0',
      'PerplexityBot/1.0',
      'Google-CloudVertexBot',
      'Mozilla/5.0 (compatible; MyAgent/1.0; +https://example.com/bot)',
    ]) {
      expect(prefersMarkdown(request({ 'user-agent': ua })), ua).toBe(true);
    }
  });

  it('keeps serving HTML to search crawlers, so we never cloak', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; DatoCmsSearchBot)',
      'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 Applebot/0.1',
      'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)',
    ]) {
      expect(prefersMarkdown(request({ 'user-agent': ua })), ua).toBe(false);
    }
  });

  it('keeps serving HTML to link unfurlers, so previews keep their og: tags', () => {
    for (const ua of [
      'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
      'facebookexternalhit/1.1',
      'Twitterbot/1.0',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0; +https://www.linkedin.com)',
      'Discordbot/2.0 (+https://discordapp.com)',
      'WhatsApp/2.19.81 A',
    ]) {
      expect(prefersMarkdown(request({ 'user-agent': ua })), ua).toBe(false);
    }
  });

  it('keeps serving HTML to auditing tools that measure the real page', () => {
    expect(prefersMarkdown(request({ 'user-agent': `${CHROME_UA} Chrome-Lighthouse` }))).toBe(
      false,
    );
  });

  it('lets an explicit Accept override the user agent in both directions', () => {
    // A crawler that asks for markdown gets it...
    expect(
      prefersMarkdown(
        request({
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
          accept: 'text/markdown',
        }),
      ),
    ).toBe(true);

    // ...and a browser that asks for it gets it too.
    expect(
      prefersMarkdown(
        request({ 'user-agent': CHROME_UA, 'sec-fetch-mode': 'navigate', accept: 'text/markdown' }),
      ),
    ).toBe(true);
  });

  it('treats Sec-Fetch-Mode as proof of a browser, whatever the user agent claims', () => {
    expect(
      prefersMarkdown(request({ 'user-agent': 'ClaudeBot/1.0', 'sec-fetch-mode': 'navigate' })),
    ).toBe(false);
  });

  it('treats a signed request (RFC 9421) as agent traffic', () => {
    expect(
      prefersMarkdown(request({ 'user-agent': '', 'signature-agent': '"https://claude.ai"' })),
    ).toBe(true);
  });

  it('serves HTML when there is nothing to go on', () => {
    expect(prefersMarkdown(request({}))).toBe(false);
  });
});
