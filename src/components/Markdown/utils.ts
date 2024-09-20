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
  smartypants: true,
};

const processorPromise = createMarkdownProcessor(config);

export async function markdown(content: string) {
  const processor = await processorPromise;
  const result = await processor.render(content);
  return result.code;
}
