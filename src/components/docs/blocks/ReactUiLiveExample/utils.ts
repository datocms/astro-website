import { readFragment, type FragmentOf } from 'gql.tada';
import ky from 'ky';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Application, FileRegistry, type JSONOutput } from 'typedoc';
import { invariant } from '~/lib/invariant';
import { slugify } from '~/lib/slugify';
import { cachedFn } from '~/lib/temporarlyCache';
import type { TocEntry, TocGroup } from '../../ContentPlusToc/types';
import { ReactUiLiveExampleFragment } from './graphql';

type Block = { __typename: 'ReactUiLiveExampleRecord' } & FragmentOf<
  typeof ReactUiLiveExampleFragment
>;

export async function buildGroupsFromReactUiLiveExamples(content: {
  blocks: Array<{ __typename: string } | Block>;
}): Promise<TocGroup[]> {
  const sdkHookGroupBlocks = content.blocks.filter(
    (block): block is Block => block.__typename === 'ReactUiLiveExampleRecord',
  );

  const entries = (
    await Promise.all(
      sdkHookGroupBlocks.map(async (block) => {
        const { componentName } = readFragment(ReactUiLiveExampleFragment, block);

        const examples = (await fetchReactUiExamples()).filter(
          (example) => example.componentName === componentName,
        );

        return examples.map<TocEntry>((example) => ({
          label: example.title,
          url: `#${slugify(example.title)}`,
        }));
      }),
    )
  ).flat();

  return entries.length > 0 ? [{ title: 'Examples', entries }] : [];
}

export type ReactUiLiveExample = {
  componentName: string;
  code: string;
  title: string;
  description: string;
  serializedMdxExample: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>;
};

// TODO: release new version of sdk and use it here!
const url =
  'https://gist.githubusercontent.com/stefanoverna/476316a1d441f9f80d5eabac8ea7976e/raw/c64a50482f5aad0762257968dbcf31eb3c2ba91a/types.json';

export const fetchReactUiExamples = cachedFn(async (): Promise<ReactUiLiveExample[]> => {
  const jsonOutput = await ky<JSONOutput.ProjectReflection>(url).json();

  const app = await Application.bootstrap({
    entryPoints: [],
    entryPointStrategy: 'merge',
  });

  const project = app.deserializer.reviveProject(
    jsonOutput,
    'datocms-react-ui',
    process.cwd(),
    new FileRegistry(),
  );

  const result = await Promise.all(
    project.children!.flatMap((child) => {
      const blockTags = child.signatures?.[0]?.comment?.blockTags || child.comment?.blockTags;

      const examples = (blockTags && blockTags.filter((b) => b.tag === '@example' && b.name)) || [];

      return examples.map(async (example) => {
        invariant(example.name);

        const codePart = example.content.find(
          (part) => part.kind === 'code' && part.text.match(/```[a-z]*\n/),
        );

        const normalizedCode = codePart ? removeCommonIndentation(codePart.text) : undefined;

        if (!normalizedCode) {
          return [];
        }

        const codeWithoutMarkdown = normalizedCode
          .match(/```[a-z]*\n([\s\S]*?)\n```/)?.[1]
          ?.replace(/;$/, '');

        if (!codeWithoutMarkdown) {
          return [];
        }

        const allOtherParts = example.content.filter((part) => part !== codePart);
        const description = allOtherParts.map((part) => part.text).join('');

        return [
          {
            componentName: child.name,
            code: codeWithoutMarkdown,
            title: example.name,
            description,
            serializedMdxExample: await serialize(codeWithoutMarkdown),
          },
        ];
      });
    }),
  );

  return result.flat();
});

function removeCommonIndentation(example: string) {
  const lines = example
    .split(/\n/)
    .filter((l, i, all) => l.length !== 0 || (i !== 0 && i !== all.length - 1));

  const spacesPerLine = lines
    .filter((line) => line.length > 0)
    .map((line) => {
      const spaces = line.match(/^\s*/);
      return spaces ? spaces[0].length : 0;
    });

  const commonIndentation = Math.min(...spacesPerLine);

  return lines.map((line) => line.substring(commonIndentation)).join('\n');
}
