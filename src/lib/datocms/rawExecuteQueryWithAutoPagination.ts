import {
  type ExecuteQueryOptions as CdaExecuteQueryOptions,
  rawExecuteQuery as rawCdaExecuteQuery,
} from '@datocms/cda-client';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import { type ArgumentNode, type FieldNode, Kind, type SelectionNode, visit } from 'graphql';
import { omit } from 'lodash-es';

export async function rawExecuteQueryWithAutoPagination<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: Exclude<CdaExecuteQueryOptions<Variables>, 'token' | 'excludeInvalid'>,
): Promise<[Result, Response]> {
  let variables = options!.variables as any;
  let variablesToExclude: string[] = [];
  let alreadyFoundCollectionSelectionSetThatNeedsToBeDuped = false;

  const newQuery = visit(query, {
    SelectionSet: {
      leave: (selectionSet) => {
        const newSelections: SelectionNode[] = [];

        // end goal: we want to take all allXXXX() {} selection sets
        for (const selectionNode of selectionSet.selections) {
          const info = parseCollectionSelectionSetThatNeedsToBeDuped(
            selectionNode,
            options?.variables,
          );

          if (!info) {
            newSelections.push(selectionNode);
            continue;
          }

          if (alreadyFoundCollectionSelectionSetThatNeedsToBeDuped) {
            throw new Error('Cannot manage multiple selections in a single query!');
          }

          alreadyFoundCollectionSelectionSetThatNeedsToBeDuped = true;

          variables = omit(variables, info.variablesToExclude);
          variablesToExclude = [...variablesToExclude, ...info.variablesToExclude];

          let skip: number;

          for (
            skip = info.initialSkip;
            info.numberOfTotalRecords - skip + info.initialSkip > 0;
            skip += 100
          ) {
            const newSelectionNode: FieldNode = {
              ...(selectionNode as FieldNode),
              alias: {
                kind: Kind.NAME,
                value: `splitted_${skip}_${info.aliasName}`,
              },
              arguments: [
                ...info.argumentNodesToMantain,
                {
                  kind: Kind.ARGUMENT,
                  name: {
                    kind: Kind.NAME,
                    value: 'first',
                  },
                  value: {
                    kind: Kind.INT,
                    value: Math.min(
                      info.numberOfTotalRecords - skip + info.initialSkip,
                      100,
                    ).toString(),
                  },
                },
                {
                  kind: Kind.ARGUMENT,
                  name: {
                    kind: Kind.NAME,
                    value: 'skip',
                  },
                  value: {
                    kind: Kind.INT,
                    value: skip.toString(),
                  },
                },
              ],
            };
            newSelections.push(newSelectionNode);
          }
        }

        return {
          ...selectionSet,
          selections: newSelections,
        };
      },
    },
    OperationDefinition: {
      leave: (operationDefinition) => {
        return {
          ...operationDefinition,
          variableDefinitions: operationDefinition.variableDefinitions?.filter(
            (variableDefinition) => {
              return !variablesToExclude.includes(variableDefinition.variable.name.value);
            },
          ),
        };
      },
    },
  });

  const [result, response] = await rawCdaExecuteQuery(newQuery, {
    ...options,
    variables,
    excludeInvalid: true,
    token: DATOCMS_API_TOKEN,
  });

  return [mergeSplittedResults(result) as Result, response];
}

function parseCollectionSelectionSetThatNeedsToBeDuped(
  selectionNode: SelectionNode,
  variables: any,
) {
  const variablesToExclude: string[] = [];

  // ie. ignore _allXXXMeta
  if (selectionNode.kind !== Kind.FIELD || selectionNode.name.value.startsWith('_')) {
    return false;
  }

  const argumentNodesToMantain: ArgumentNode[] = [];

  let firstArg: ArgumentNode | undefined;
  let skipArg: ArgumentNode | undefined;

  for (const existingArg of selectionNode.arguments ?? []) {
    if (existingArg.name.value === 'first') {
      firstArg = existingArg;
    } else if (existingArg.name.value === 'skip') {
      skipArg = existingArg;
    } else {
      argumentNodesToMantain.push(existingArg);
    }
  }

  // ignore if it does not have `first:` argument
  if (!firstArg) {
    return false;
  }

  let numberOfTotalRecords: number | undefined;

  if (firstArg.value.kind === Kind.INT) {
    numberOfTotalRecords = Number.parseInt(firstArg.value.value);
  } else if (firstArg.value.kind === Kind.VARIABLE) {
    numberOfTotalRecords = variables[firstArg.value.name.value] as number;
    variablesToExclude.push(firstArg.value.name.value);
  }

  // ignore if first < 100
  if (!numberOfTotalRecords || numberOfTotalRecords <= 100) {
    return false;
  }

  const fieldName = selectionNode.name.value;
  const aliasName = selectionNode.alias?.value || fieldName;

  let initialSkip = 0;

  if (skipArg?.value?.kind === Kind.INT) {
    initialSkip = Number.parseInt(skipArg.value.value);
  } else if (skipArg?.value?.kind === Kind.VARIABLE) {
    initialSkip = variables[skipArg.value.name.value];
    variablesToExclude.push(skipArg.value.name.value);
  }

  return {
    fieldName,
    aliasName,
    initialSkip,
    numberOfTotalRecords,
    variablesToExclude,
    argumentNodesToMantain,
  };
}

function mergeSplittedResults(originalData: unknown): any {
  if (!originalData || typeof originalData !== 'object') {
    return originalData;
  }

  if (Array.isArray(originalData)) {
    return originalData.map((record) => mergeSplittedResults(record));
  }

  const finalData: Record<string, unknown> = {};

  for (const fullAliasName in originalData) {
    if (fullAliasName.startsWith('splitted_')) {
      const [, , ...rest] = fullAliasName.split('_');
      const aliasName = rest.join('_');

      const completeList = (finalData[aliasName] as unknown[]) || [];

      for (const record of (originalData as Record<string, unknown[]>)[fullAliasName]!) {
        completeList.push(mergeSplittedResults(record));
      }

      finalData[aliasName] = completeList;
    } else {
      finalData[fullAliasName] = mergeSplittedResults(
        (originalData as Record<string, unknown>)[fullAliasName],
      );
    }
  }

  return finalData;
}
