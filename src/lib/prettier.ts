import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';

/*
 * Prettier for the code samples of the docs, which the server formats on each
 * render. In Cloudflare Workers the package `prettier` resolves to its
 * browser build, which has no parser of its own. Thus use the standalone
 * build in each runtime, with the plugin of the parsers that the samples use
 * (`babel` and `json5` are both in the Babel plugin).
 */
export function format(code: string, options: { parser: 'babel' | 'json5' }) {
  return prettier.format(code, { ...options, plugins: [babel, estree] });
}
