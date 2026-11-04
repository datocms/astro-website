import { createMarkdownProcessor, type AstroMarkdownOptions } from '@astrojs/markdown-remark';
import rehypeExpressiveCode from 'rehype-expressive-code';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
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

/*
 * The processor for a text that we did not write (the README of a plugin).
 * First the HTML of the author becomes elements (rehypeRaw), and the
 * sanitizer removes the unsafe ones (the GitHub rules). Then the other
 * plugins add their own markup (the anchors, the code blocks), and the
 * sanitizer does not remove it. The code of a code span or a code block is
 * text, thus its `<` stays a `<`.
 */
const untrustedProcessorPromise = createMarkdownProcessor({
  ...config,
  rehypePlugins: [rehypeRaw, rehypeSanitize, ...(config.rehypePlugins ?? [])],
});

export async function markdownToHtml(content: string): Promise<string> {
  const processor = await processorPromise;
  const result = await processor.render(content);
  return result.code;
}

/** Like markdownToHtml, for a text that we did not write: the unsafe HTML goes. */
export async function untrustedMarkdownToHtml(content: string): Promise<string> {
  const processor = await untrustedProcessorPromise;
  const result = await processor.render(content);
  return result.code;
}
