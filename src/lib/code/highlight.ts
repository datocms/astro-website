import { createCssVariablesTheme, createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

/*
 * Syntax highlighting for CodeSnippetPreview, with Shiki, when the page
 * renders: no script in the browser. The theme gives each token a CSS
 * variable, not a colour (--shiki-token-keyword…), and the component maps
 * the variables to the tokens of the site (src/styles/tokens.css, "Code").
 * The JavaScript engine of regular expressions runs in Cloudflare Workers,
 * where the WASM one does not.
 */

/** The languages a snippet can be in. */
export type CodeLang =
  'graphql' | 'json' | 'ts' | 'tsx' | 'shell' | 'http' | 'vue' | 'svelte' | 'astro';

const theme = createCssVariablesTheme({ name: 'site', variablePrefix: '--shiki-' });

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [
      import('shiki/langs/graphql.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/shellscript.mjs'),
      import('shiki/langs/http.mjs'),
      import('shiki/langs/vue.mjs'),
      import('shiki/langs/svelte.mjs'),
      import('shiki/langs/astro.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

const LANG: Record<CodeLang, string> = {
  graphql: 'graphql',
  json: 'json',
  ts: 'typescript',
  tsx: 'tsx',
  shell: 'shellscript',
  http: 'http',
  vue: 'vue',
  svelte: 'svelte',
  astro: 'astro',
};

/** A token of a line: its text and the CSS variable of its colour. */
export interface HighlightedToken {
  text: string;
  color?: string;
}

/** The lines of a snippet, each a list of tokens. */
export async function highlight(code: string, lang: CodeLang): Promise<HighlightedToken[][]> {
  const shiki = await getHighlighter();
  const toLines = (text: string, as: string) =>
    shiki
      .codeToTokens(text, { lang: as, theme: 'site' })
      .tokens.map((line) => line.map(({ content, color }) => ({ text: content, color })));

  const source = code.replace(/\n$/, '');
  const lines = toLines(source, LANG[lang]);
  if (lang === 'graphql') return lines;

  // Shiki shows a template string as one string, in TypeScript and in the
  // script of a Vue, Svelte or Astro file. A line that ends with
  // "/* GraphQL */ `" starts a GraphQL query, and a line that starts with
  // "`" ends it: the lines between them get the colours of GraphQL.
  const text = source.split('\n');
  for (let start = 0; start < text.length; start++) {
    if (!/\/\* GraphQL \*\/ `$/.test(text[start]!)) continue;
    const end = text.findIndex((line, i) => i > start && line.trimStart().startsWith('`'));
    if (end < 0) break;
    const query = toLines(text.slice(start + 1, end).join('\n'), LANG.graphql);
    lines.splice(start + 1, end - start - 1, ...query);
    start = end;
  }
  return lines;
}
