/*
 * A small syntax highlighter for the code that a form makes in the browser
 * (CodeSnippet). Expressive Code highlights when the page renders, thus it
 * cannot highlight text that changes while the user types. Shiki in the
 * browser is too large for this: its HTML grammar loads the grammars of
 * JavaScript and CSS.
 *
 * Each token gets a role of ec.config.mjs (plain, punctuation, keyword,
 * string, constant, function). The CSS gives each role its --code-* colour,
 * as for the code blocks of Expressive Code.
 */

export type SnippetLang = 'json' | 'html' | 'markdown' | 'text';

export type TokenRole = 'plain' | 'punctuation' | 'keyword' | 'string' | 'constant' | 'function';

export interface SnippetToken {
  text: string;
  role: TokenRole;
}

/** The patterns of a language, in order. Each pattern has one capture group for each part. */
type Rule = { pattern: RegExp; roles: TokenRole[] };

const RULES: Record<Exclude<SnippetLang, 'text'>, Rule[]> = {
  json: [
    // A key: the quotes are punctuation, the name is a function (as in Expressive Code).
    {
      pattern: /(")((?:[^"\\]|\\.)*)(")(?=\s*:)/y,
      roles: ['punctuation', 'function', 'punctuation'],
    },
    { pattern: /("(?:[^"\\]|\\.)*")/y, roles: ['constant'] },
    { pattern: /(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/y, roles: ['keyword'] },
    { pattern: /([{}[\],:])/y, roles: ['punctuation'] },
  ],
  html: [
    { pattern: /(<\/?)([\w-]+)/y, roles: ['punctuation', 'function'] },
    { pattern: /(\/?>)/y, roles: ['punctuation'] },
    { pattern: /([\w-]+)(=)("[^"]*")/y, roles: ['keyword', 'punctuation', 'constant'] },
  ],
  markdown: [
    // A link can hold an image: [![text](image)](url). The text stays plain.
    { pattern: /(!?\[)/y, roles: ['punctuation'] },
    { pattern: /(\]\()([^)\s]*)(\))/y, roles: ['punctuation', 'constant', 'punctuation'] },
    { pattern: /(\])/y, roles: ['punctuation'] },
  ],
};

/** Split `code` into tokens. The text of the tokens, in order, is `code`. */
export function tokenize(code: string, lang: SnippetLang): SnippetToken[] {
  if (lang === 'text') return [{ text: code, role: 'plain' }];

  const rules = RULES[lang];
  const tokens: SnippetToken[] = [];
  let plain = '';
  let index = 0;

  const push = (text: string, role: TokenRole) => {
    if (!text) return;
    if (plain) {
      tokens.push({ text: plain, role: 'plain' });
      plain = '';
    }
    tokens.push({ text, role });
  };

  scan: while (index < code.length) {
    for (const { pattern, roles } of rules) {
      pattern.lastIndex = index;
      const match = pattern.exec(code);
      if (!match) continue;
      roles.forEach((role, group) => push(match[group + 1] ?? '', role));
      index = pattern.lastIndex;
      continue scan;
    }
    plain += code[index];
    index += 1;
  }

  if (plain) tokens.push({ text: plain, role: 'plain' });
  return tokens;
}
