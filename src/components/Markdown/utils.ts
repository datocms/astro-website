import { createMarkdownProcessor, type AstroMarkdownOptions } from '@astrojs/markdown-remark';
import rehypeExpressiveCode from 'rehype-expressive-code';
import expressiveCodeConfig from '~~/ec.config.mjs';
import { autolinkHeadings, figureAroundCodeBlocks } from './rehypePlugins';

export const config: AstroMarkdownOptions = {
  syntaxHighlight: false,
  rehypePlugins: [
    figureAroundCodeBlocks,
    autolinkHeadings,
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

export async function singleLineMarkdown(content: string) {
  const processor = await processorPromise;
  const result = await processor.render(content);
  return new HTMLString(
    result.code.indexOf('<p>') === 0 && result.code.indexOf('</p>') === result.code.length - 4
      ? result.code.slice(3, -4)
      : result.code,
  );
}

export class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return 'HTMLString';
  }
}
