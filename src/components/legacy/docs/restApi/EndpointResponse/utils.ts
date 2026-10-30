import type { JSONSchema } from '../types';

function toArray<T>(t: T | T[]) {
  return Array.isArray(t) ? t : [t];
}

export type Analysis = {
  returnsAnArray: false | JSONSchema | JSONSchema[] | undefined;
  returnsResultInAsyncJob: boolean;
  resourceJsonApiType: string;
};

export function analyzeResponse(
  targetSchema: JSONSchema | undefined,
  jobSchema: JSONSchema | undefined,
): Analysis | undefined {
  if (!jobSchema && !targetSchema) {
    return undefined;
  }

  const schema = (jobSchema || targetSchema)!;
  const data = schema.properties!.data!;
  const returnsAnArray = toArray(data.type).includes('array') && data.items;
  const singleReturnSchema = returnsAnArray ? toArray(data.items)[0]! : data;

  if (!singleReturnSchema.properties) {
    return undefined;
  }

  const resourceJsonApiType = singleReturnSchema.properties!.type!.example as string;
  const returnsResultInAsyncJob = Boolean(jobSchema);

  return {
    returnsAnArray,
    returnsResultInAsyncJob,
    resourceJsonApiType,
  };
}
