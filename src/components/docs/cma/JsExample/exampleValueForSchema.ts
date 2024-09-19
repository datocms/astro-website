import type { JSONSchema } from '../types';

export default function exampleValueForSchema(schema: JSONSchema | undefined): unknown {
  if (!schema) {
    return null;
  }

  if (Array.isArray(schema)) {
    return exampleValueForSchema(schema[0]);
  }

  if ('deprecated' in schema || 'hideFromDocs' in schema || 'hideFromExample' in schema) {
    return undefined;
  }

  if ('example' in schema) {
    return schema.example;
  }

  if (schema.anyOf) {
    return exampleValueForSchema(schema.anyOf[0]);
  }

  const type = Array.isArray(schema.type)
    ? schema.type.find((t) => t !== 'null') || schema.type[0]
    : schema.type;

  if (type === 'object') {
    if (schema.oneOf) {
      return exampleValueForSchema(schema.oneOf[0]);
    }

    if (!schema.properties) {
      return {};
    }

    const propertiesToGenerate = schema.required ? (schema.required as string[]) : [];

    return Object.fromEntries(
      propertiesToGenerate
        .map<[string, unknown] | undefined>((property) => {
          const propertySchema = schema.properties![property]!;

          if (
            'deprecated' in propertySchema ||
            'hideFromDocs' in propertySchema ||
            'hideFromExample' in propertySchema
          ) {
            return undefined;
          }

          return [property, exampleValueForSchema(propertySchema)];
        })
        .filter((x): x is [string, unknown] => x !== undefined),
    );
  }

  if (type === 'array') {
    if (!schema.items) {
      return [];
    }

    const items = Array.isArray(schema.items) ? schema.items[0]! : schema.items!;

    if (items.oneOf) {
      return items.oneOf.map(exampleValueForSchema);
    }

    return [exampleValueForSchema(items)];
  }

  if (type === 'string') {
    if (schema.format === 'date-time') {
      return '2020-04-21T07:57:11.124Z';
    }
    if (schema.enum) {
      return schema.enum[0];
    }
    return '';
  }

  if (type === 'boolean') {
    return true;
  }

  if (type === 'integer') {
    return 20;
  }

  if (type === 'number') {
    return 0.5;
  }

  if (type === 'null') {
    return null;
  }

  throw new Error(`Don't know how to manage ${type} type!`);
}
