import { createMarkdownProcessor, type AstroMarkdownOptions } from '@astrojs/markdown-remark';
import rehypeExpressiveCode from 'rehype-expressive-code';
import expressiveCodeConfig from '~~/ec.config.mjs';
import { autolinkHeadings, callouts, figureAroundCodeBlocks } from './rehypePlugins';

const config: AstroMarkdownOptions = {
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

export async function markdownToHtml(content: string): Promise<string> {
  const processor = await processorPromise;
  const result = await processor.render(content);
  return result.code;
}
