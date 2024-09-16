import ky from 'ky';
// import { serialize } from 'next-mdx-remote/serialize';
import { Application, FileRegistry, type JSONOutput } from 'typedoc';
import { invariant } from '../PluginSdkHookGroup';

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

export type ReactUiLiveExample = {
  componentName: string;
  code: string;
  title: string;
  description: string;
};

export async function parse(): Promise<ReactUiLiveExample[]> {
  // TODO: release new version of sdk and use it here!
  const jsonOutput = await ky<JSONOutput.ProjectReflection>(
    'https://gist.githubusercontent.com/stefanoverna/476316a1d441f9f80d5eabac8ea7976e/raw/c64a50482f5aad0762257968dbcf31eb3c2ba91a/types.json',
  ).json();

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

  return project.children!.flatMap((child) => {
    const blockTags = child.signatures?.[0]?.comment?.blockTags;
    const examples = (blockTags && blockTags.filter((b) => b.tag === '@example' && b.name)) || [];

    return examples.flatMap((example) => {
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

      return {
        componentName: child.name,
        code: codeWithoutMarkdown,
        title: example.name,
        description,
      };
    });
  });
}

let cachedPromise: ReturnType<typeof parse> | undefined;

export function fetchReactUiExamples() {
  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = parse();

  return fetchReactUiExamples();
}
