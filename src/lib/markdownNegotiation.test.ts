import { describe, expect, it } from 'vitest';
import { acceptsMarkdown, looksLikeAgent } from './markdownNegotiation';

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function request(headers: Record<string, string>): Request {
  return new Request('https://www.datocms.com/docs', { headers });
}

describe('acceptsMarkdown', () => {
  it('recognises an explicit Accept: text/markdown', () => {
    expect(acceptsMarkdown(request({ accept: 'text/markdown' }))).toBe(true);
    expect(acceptsMarkdown(request({ accept: 'text/markdown, text/html;q=0.9, */*;q=0.8' }))).toBe(
      true,
    );
  });

  it('ignores a browser Accept header', () => {
    expect(
      acceptsMarkdown(
        request({ accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }),
      ),
    ).toBe(false);
    expect(acceptsMarkdown(request({}))).toBe(false);
  });
});

describe('looksLikeAgent', () => {
  it('is false for browsers', () => {
    expect(
      looksLikeAgent(
        request({
          'user-agent': CHROME_UA,
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'sec-fetch-mode': 'navigate',
        }),
      ),
    ).toBe(false);
  });

  it('is true for AI agents', () => {
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
      expect(looksLikeAgent(request({ 'user-agent': ua })), ua).toBe(true);
    }
  });

  it('is false for search crawlers, so we never cloak', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; DatoCmsSearchBot)',
      'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 Applebot/0.1',
      'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)',
    ]) {
      expect(looksLikeAgent(request({ 'user-agent': ua })), ua).toBe(false);
    }
  });

  it('is false for link unfurlers, so previews keep their og: tags', () => {
    for (const ua of [
      'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
      'facebookexternalhit/1.1',
      'Twitterbot/1.0',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0; +https://www.linkedin.com)',
      'Discordbot/2.0 (+https://discordapp.com)',
      'WhatsApp/2.19.81 A',
    ]) {
      expect(looksLikeAgent(request({ 'user-agent': ua })), ua).toBe(false);
    }
  });

  it('is false for auditing tools that measure the real page', () => {
    expect(looksLikeAgent(request({ 'user-agent': `${CHROME_UA} Chrome-Lighthouse` }))).toBe(false);
  });

  it('treats Sec-Fetch-Mode as proof of a browser, whatever the user agent claims', () => {
    expect(
      looksLikeAgent(request({ 'user-agent': 'ClaudeBot/1.0', 'sec-fetch-mode': 'navigate' })),
    ).toBe(false);
  });

  it('treats a signed request (RFC 9421) as agent traffic', () => {
    expect(
      looksLikeAgent(request({ 'user-agent': '', 'signature-agent': '"https://claude.ai"' })),
    ).toBe(true);
  });

  it('is false when there is nothing to go on', () => {
    expect(looksLikeAgent(request({}))).toBe(false);
  });
});
