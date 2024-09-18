import type { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import { invariant } from '~/lib/invariant';

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
    const firstAnyOf = schema.anyOf[0];
    isJsonSchema(firstAnyOf);

    return exampleValueForSchema(firstAnyOf);
  }

  const type = Array.isArray(schema.type)
    ? schema.type.find((t) => t !== 'null') || schema.type[0]
    : schema.type;

  if (type === 'object') {
    if (schema.oneOf) {
      const firstOneOf = schema.oneOf[0];
      isJsonSchema(firstOneOf);
      return exampleValueForSchema(firstOneOf);
    }

    if (!schema.properties) {
      return {};
    }

    const propertiesToGenerate = schema.required ? (schema.required as string[]) : [];

    return Object.fromEntries(
      propertiesToGenerate
        .map<[string, unknown] | undefined>((property) => {
          const propertySchema = schema.properties![property];

          isJsonSchema(propertySchema);

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

    isJsonSchema(schema.items);

    if (schema.items.oneOf) {
      return schema.items.oneOf.map((s) => {
        isJsonSchema(s);
        return exampleValueForSchema(s);
      });
    }

    return [exampleValueForSchema(schema.items)];
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

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}
