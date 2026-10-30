import { resolveDocsHref } from '~/lib/llmtxt/converter';
import type {
  JsonSchemaObjectAnalysis,
  JsonSchemaPropertyAnalysis,
} from './analyzeSchemaProperties';

type RenderOptions = {
  showRequiredOptional: boolean;
  baseUrl: string;
};

/**
 * Resolve link hrefs inside a pre-formatted type string produced by
 * `analyzeSchemaProperties` (e.g. `[ResourceLinkage<"X">](/docs/.../X)`).
 * Scoped to that well-known shape — not a generic markdown link rewriter.
 */
function resolveTypeLinks(type: string, baseUrl: string): string {
  return type.replace(
    /\]\(([^)]+)\)/g,
    (_match, href: string) => `](${resolveDocsHref(href, baseUrl)})`,
  );
}

async function propertyToMarkdown(
  prop: JsonSchemaPropertyAnalysis,
  opts: RenderOptions,
): Promise<string> {
  const name = `${prop.prefix ?? ''}${prop.property}${prop.suffix ?? ''}`;
  const blocks: string[] = [`**\`${name}\`**`];

  const bullets: string[] = [];
  if (prop.deprecated) {
    bullets.push('Deprecated');
  } else if (opts.showRequiredOptional) {
    bullets.push(prop.required ? 'Required' : 'Optional');
  }
  if (prop.types.length > 0) {
    const resolvedTypes = prop.types.map((t) => resolveTypeLinks(t, opts.baseUrl));
    bullets.push(`Type: ${resolvedTypes.join(', ')}`);
  }

  const resolvedExamples =
    prop.examples.length > 0 ? (await Promise.all(prop.examples)).map((e) => e.trim()) : [];
  const inlineExamples = resolvedExamples.filter((e) => !e.includes('\n'));
  const blockExamples = resolvedExamples.filter((e) => e.includes('\n'));
  if (inlineExamples.length > 0) {
    const label = inlineExamples.length > 1 ? 'Examples' : 'Example';
    bullets.push(`${label}: ${inlineExamples.map((e) => `\`${e}\``).join(', ')}`);
  }

  if (bullets.length > 0) {
    blocks.push(bullets.map((b) => `- ${b}`).join('\n'));
  }

  if (prop.description) {
    blocks.push(prop.description.trim());
  }
  if (prop.deprecated) {
    blocks.push(prop.deprecated.trim());
  }
  for (const example of blockExamples) {
    blocks.push(`Example:\n\n\`\`\`json\n${example}\n\`\`\``);
  }

  if (prop.moreInfo) {
    for (const info of prop.moreInfo) {
      const nested = await objectAnalysisToMarkdown(info.properties, opts);
      blocks.push(`<details>\n<summary>Show ${info.title}</summary>\n\n${nested}\n\n</details>`);
    }
  }

  return blocks.join('\n\n');
}

export async function objectAnalysisToMarkdown(
  obj: JsonSchemaObjectAnalysis,
  opts: RenderOptions,
): Promise<string> {
  const blocks: string[] = [];

  for (const prop of obj.regular) {
    blocks.push(await propertyToMarkdown(prop, opts));
  }

  if (obj.deprecated.length > 0) {
    const deprecatedBlocks: string[] = [];
    for (const prop of obj.deprecated) {
      deprecatedBlocks.push(await propertyToMarkdown(prop, opts));
    }
    blocks.push(
      `<details>\n<summary>Show deprecated</summary>\n\n${deprecatedBlocks.join('\n\n')}\n\n</details>`,
    );
  }

  return blocks.join('\n\n');
}
