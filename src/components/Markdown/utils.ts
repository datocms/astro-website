import { createMarkdownProcessor, type AstroMarkdownOptions } from '@astrojs/markdown-remark';
import rehypeExpressiveCode from 'rehype-expressive-code';
import striptags from 'striptags';
import expressiveCodeConfig from '~~/ec.config.mjs';
import { autolinkHeadings, callouts, figureAroundCodeBlocks } from './rehypePlugins';

export const config: AstroMarkdownOptions = {
  syntaxHighlight: false,
  rehypePlugins: [
    figureAroundCodeBlocks,
    autolinkHeadings,
    callouts,
    [rehypeExpressiveCode, expressiveCodeConfig],
  ],
  remarkRehype: {},
  gfm: true,
  smartypants: false,
};

const processorPromise = createMarkdownProcessor(config);

export async function markdown(content: string) {
  const processor = await processorPromise;
  const result = await processor.render(content);
  return new HTMLString(result.code);
}

export async function inlineMarkdown(content: string) {
  const processor = await processorPromise;
  const result = await processor.render(content);
  return new HTMLString(
    result.code.indexOf('<p>') === 0 && result.code.indexOf('</p>') === result.code.length - 4
      ? result.code.slice(3, -4)
      : result.code,
  );
}

export async function markdownToPlainText(content: string) {
  return striptags((await markdown(content)).toString());
}

export class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return 'HTMLString';
  }
}
