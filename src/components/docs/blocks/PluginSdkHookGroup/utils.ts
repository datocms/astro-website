import { readFragment, type FragmentOf } from 'gql.tada';
import ky from 'ky';
import {
  Application,
  DeclarationReflection,
  FileRegistry,
  IntersectionType,
  JSONOutput,
  ReferenceType,
  Reflection,
  ReflectionType,
  type SomeType,
} from 'typedoc';
import { invariant } from '~/lib/invariant';
import { slugify } from '~/lib/slugify';
import { temporarilyCache } from '~/lib/temporarlyCache';
import type { TocEntry, TocGroup } from '../../ContentPlusToc/types';
import { PluginSdkHookGroupFragment } from './graphql';

export type PluginSdkHook = {
  name: string;
  description: string | null;
  example: string | null;
  groups: string[];
  ctx: Ctx[] | null;
  lineNumber: number;
};

type Block = { __typename: 'PluginSdkHookGroupRecord' } & FragmentOf<
  typeof PluginSdkHookGroupFragment
>;

export async function buildGroupsFromPluginSdkHooks(content: {
  blocks: Array<{ __typename: string } | Block>;
}): Promise<TocGroup[]> {
  const sdkHookGroupBlocks = content.blocks.filter(
    (block): block is Block => block.__typename === 'PluginSdkHookGroupRecord',
  );

  const entries = (
    await Promise.all(
      sdkHookGroupBlocks.map(async (block) => {
        const { groupName } = readFragment(PluginSdkHookGroupFragment, block);

        const hooks = (await fetchPluginSdkHooks()).filter((hook) =>
          hook.groups.includes(groupName),
        );

        return hooks
          .sort((a, b) => a.lineNumber - b.lineNumber)
          .map<TocEntry>((hook) => ({
            label: `${hook.name}()`,
            url: `#${slugify(hook.name)}`,
          }));
      }),
    )
  ).flat();

  return entries.length > 0 ? [{ title: 'Hooks', entries }] : [];
}

// const baseUrl = 'http://localhost:5000/types.json';
// const url = 'https://cdn.jsdelivr.net/npm/datocms-plugin-sdk/types.json';

// TODO: release new version of sdk and use it here!
const url =
  'https://gist.githubusercontent.com/stefanoverna/cfaa38d59a68d878bf74351b6edee694/raw/1eedfe04fe835dc6fb16e8fb369d58dc74f8774a/gistfile1.txt';

export const fetchPluginSdkHooks = temporarilyCache(60, async (): Promise<PluginSdkHook[]> => {
  const jsonOutput = await ky<JSONOutput.ProjectReflection>(url).json();

  const app = await Application.bootstrap({
    entryPoints: [],
    entryPointStrategy: 'merge',
  });

  const project = app.deserializer.reviveProject(
    jsonOutput,
    'datocms-plugin-sdk',
    process.cwd(),
    new FileRegistry(),
  );

  invariant(project.children);

  const connectParameters = project.children.find(
    (child) => child.name === 'FullConnectParameters',
  );

  invariant(connectParameters);

  const hooks = (connectParameters.type as ReflectionType).declaration.children;

  invariant(hooks);

  const result = hooks.map((hook) => {
    const signature = hook.signatures
      ? hook.signatures[0]
      : (hook.type as ReflectionType).declaration.signatures?.[0];

    invariant(signature);
    invariant(signature.parameters);

    const ctxParameter = signature.parameters.find((p) => p.name === 'ctx');

    const ctx = ctxParameter
      ? buildCtx(dereference(ctxParameter.type!)).sort((a, b) => a.name.localeCompare(b.name))
      : null;

    return {
      name: hook.name,
      description: findShortText(hook),
      example: findExample(hook),
      groups:
        findFirstTag(hook, '@tag')
          ?.trim()
          ?.split(/\s*,\s*/) || [],
      ctx,
      lineNumber: hook.sources![0]!.line,
    };
  });

  return result.sort((a, b) => a.lineNumber - b.lineNumber);
});

export function dereference(type: SomeType) {
  if (type instanceof ReferenceType) {
    if (type.reflection instanceof DeclarationReflection) {
      const innerType = type.reflection.type!;
      return dereference(innerType);
    } else {
      throw new Error('Invalid reflection type');
    }
  }

  return type;
}

function findFirstTag(signature: Reflection, tagName: string) {
  if (!signature.comment || !signature.comment.blockTags) {
    return null;
  }

  const tagNode = signature.comment.blockTags.find((tag) => tag.tag === tagName);

  if (!tagNode) {
    return null;
  }

  return tagNode.content.map((chunk) => chunk.text).join('');
}

function findExample(signature: Reflection) {
  const example = findFirstTag(signature, '@example');

  if (!example) {
    return null;
  }

  const lines = example
    .split(/\n/)
    .filter((l, i, all) => l.length !== 0 || (i !== 0 && i !== all.length - 1));

  const spacesPerLine = lines.map((line) => {
    const spaces = line.match(/^\s*/);
    return spaces ? spaces[0].length : 0;
  });

  const commonIndentation = Math.min(...spacesPerLine);

  const pruned = lines.map((line) => line.substring(commonIndentation)).join('\n');

  return pruned.match(/```[a-z]*\n([\s\S]*?)\n```/)![1]!.trim();
}

function addFinalPeriod(text: string) {
  if (['!', '.'].includes(text[text.length - 1]!)) {
    return text;
  }

  return `${text}.`;
}

function findShortText(signature: Reflection) {
  return (
    (signature.comment &&
      addFinalPeriod(signature.comment.summary.map((chunk) => chunk.text).join(''))) ||
    null
  );
}

export type Property = {
  type: 'function' | 'property';
  name: string;
  description: string | null;
  example: string | null;
  lineNumber: number;
};

type Ctx = {
  name: string;
  description: string | null;
  properties: Array<Property>;
};

function buildCtx(rawDefinition: SomeType): Ctx[] {
  const definition = dereference(rawDefinition);

  if (definition instanceof ReflectionType) {
    invariant(definition.declaration.children);

    const properties = definition.declaration.children.filter(
      (child) => !['mode', 'getSettings', 'setHeight', 'bodyPadding'].includes(child.name),
    );

    if (properties.length === 0) {
      return [];
    }

    const name =
      rawDefinition instanceof ReferenceType ? rawDefinition.name : definition.declaration.name;

    const description =
      rawDefinition instanceof ReferenceType ? findShortText(rawDefinition.reflection!) : null;

    return [
      {
        name,
        description,
        properties: properties.map((child) => {
          if (child.type instanceof ReflectionType && child.type.declaration.signatures) {
            return {
              name: child.name,
              type: 'function',
              description: findShortText(child),
              example: findExample(child),
              lineNumber: child.sources![0]!.line,
            };
          }

          invariant(child.sources);

          return {
            name: child.name,
            type: 'property',
            description: findShortText(child),
            example: findExample(child),
            lineNumber: child.sources![0]!.line,
          };
        }),
      },
    ];
  }

  if (definition instanceof IntersectionType) {
    return definition.types.flatMap((subType) => {
      return buildCtx(subType);
    });
  }

  throw new Error(`Don't know how to handle ${definition.toString()} (${definition.type})`);
}