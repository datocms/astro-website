import type { Language } from './LanguagePicker/utils';
import type { JSONSchema } from './types';

export type MoreInfo = {
  title: string;
  properties: JsonSchemaObjectAnalysis;
};

export type JsonSchemaPropertyAnalysis = {
  prefix?: string;
  suffix?: string;
  property: string;
  deprecated?: string;
  required?: boolean;
  types: string[];
  examples: unknown[];
  description: string;
  moreInfo?: MoreInfo;
};

export type JsonSchemaObjectAnalysis = {
  regular: JsonSchemaPropertyAnalysis[];
  deprecated: JsonSchemaPropertyAnalysis[];
};

function splitPropertiesByType(
  schema: JSONSchema,
  forceAllOptional: boolean,
  considerDeprecatedAndRequiredAsRequired: boolean,
) {
  // In endpoint schemas, it is important to show deprecated properties
  // that are required. In entities, it is not, they can be hidden.
  // In any case, we want to sort properties by `required` first.

  const required = forceAllOptional ? [] : (schema.required as string[]) || [];

  const allProperties = schema.properties
    ? Object.entries(schema.properties)
        .filter(([_property, propertySchema]) => !propertySchema.hideFromDocs)
        .map(([property]) => property)
    : [];

  const requiredProperties = required.filter((property) => {
    const propertySchema = schema.properties![property]!;

    if (propertySchema.hideFromDocs) {
      return false;
    }

    if (considerDeprecatedAndRequiredAsRequired) {
      return true;
    }

    return !propertySchema.deprecated;
  });

  const optionalProperties = [];
  const deprecatedProperties = [];

  for (const property of allProperties) {
    if (!requiredProperties.includes(property)) {
      const propertySchema = schema.properties![property]!;

      if (propertySchema.deprecated) {
        deprecatedProperties.push(property);
      } else {
        optionalProperties.push(property);
      }
    }
  }

  return {
    requiredProperties,
    optionalProperties,
    deprecatedProperties,
  };
}

const toArray = <T>(t: T | T[]) => (Array.isArray(t) ? t : [t]);

function buildTypes(schema: JSONSchema) {
  return toArray(schema.type).map((type) => {
    if (type === 'string' && schema.format) {
      return `${schema.format}`;
    }

    if (type === 'string' && schema.enum) {
      return 'enum';
    }

    if (type === 'string' && schema.const) {
      return `"${schema.const}"`;
    }

    if (type === 'array') {
      if (!schema.items || Array.isArray(schema.items)) {
        return 'Array';
      }

      return `Array\\<${toArray(schema.items.type).join(' | ')}\\>`;
    }

    return `${type}`;
  });
}

function buildRelationshipTypes(schema: JSONSchema) {
  const dataSchema = schema.properties!.data!;
  const returnsAnArray = toArray(dataSchema.type).includes('array') && dataSchema.items;
  const singleReturnSchema = returnsAnArray ? toArray(dataSchema.items)[0]! : dataSchema;

  const jsonApiTypes = singleReturnSchema.anyOf
    ? singleReturnSchema.anyOf.map((s) =>
        toArray(s.type).includes('null') ? 'null' : (s.properties!.type!.example as string),
      )
    : [singleReturnSchema.properties!.type!.example as string];

  const formattedTypes = jsonApiTypes.map((type) => {
    if (type === 'null') {
      return 'null';
    }

    return `[ResourceLinkage\\<"${type}"\\>](/docs/content-management-api/resources/${type})`;
  });

  return returnsAnArray ? [`Array<${formattedTypes.join(' | ')}>`] : formattedTypes;
}

function buildPropertyMoreInfo(
  schema: JSONSchema,
  language: Language,
  considerDeprecatedAndRequiredAsRequired: boolean,
): MoreInfo | undefined {
  const types = toArray(schema.type);

  if (types.includes('object') && schema.properties) {
    return buildMoreInfo('object format', schema, language, {
      considerDeprecatedAndRequiredAsRequired,
    });
  }

  if (schema.enum) {
    return {
      title: 'enum values',
      properties: {
        regular: schema.enum
          .filter((enumValue): enumValue is string => typeof enumValue === 'string')
          .map((enumValue) => ({
            property: enumValue,
            description: schema.enumDescription?.[enumValue] || '',
            types: [],
            examples: [],
          })),
        deprecated: [],
      },
    };
  }

  if (types.includes('array') && schema.items) {
    const items = toArray(schema.items);
    const objectType = items.find((items) => toArray(items.type).includes('object'));

    if (objectType && objectType.properties) {
      return buildMoreInfo('objects format inside array', objectType, language, {
        considerDeprecatedAndRequiredAsRequired,
      });
    }
  }
}

function buildJsonSchemaPropertyAnalysis(
  property: string,
  schema: JSONSchema,
  language: Language,
  options: {
    prefix?: string;
    parentSchema?: JSONSchema;
    additionalDescription?: string;
    forceOptional?: boolean;
    skipExamples?: boolean;
    inMoreInfoConsiderDeprecatedAndRequiredAsRequired?: boolean;
  },
): JsonSchemaPropertyAnalysis {
  const isRequired = options?.forceOptional
    ? false
    : ((options?.parentSchema?.required || []) as string[]).includes(property);

  const examples = (schema.examples || (schema.example ? [schema.example] : [])).filter(
    (exampleValue) => typeof exampleValue !== 'boolean',
  );

  return {
    prefix: options.prefix,
    property,
    deprecated: schema.deprecated,
    required: isRequired,
    types: buildTypes(schema),
    examples: options?.skipExamples ? [] : examples,
    description: [options?.additionalDescription, schema.description].filter(Boolean).join('\n'),
    moreInfo: buildPropertyMoreInfo(
      schema,
      language,
      Boolean(options?.inMoreInfoConsiderDeprecatedAndRequiredAsRequired),
    ),
  };
}

function buildMoreInfo(
  title: string,
  schema: JSONSchema,
  language: Language,
  options: {
    prefix?: string;
    propertiesToShow?: Array<'required' | 'optional' | 'deprecated'>;
    considerDeprecatedAndRequiredAsRequired?: boolean;
  } = {},
): MoreInfo {
  return {
    title,
    properties: analyzePropertiesOfGenericObject(schema, language, options),
  };
}

export function analyzePropertiesOfGenericObject(
  schema: JSONSchema,
  language: Language,
  options: {
    prefix?: string;
    forceAllOptional?: boolean;
    considerDeprecatedAndRequiredAsRequired?: boolean;
  } = {},
): JsonSchemaObjectAnalysis {
  const { requiredProperties, optionalProperties, deprecatedProperties } = splitPropertiesByType(
    schema,
    Boolean(options?.forceAllOptional),
    Boolean(options?.considerDeprecatedAndRequiredAsRequired),
  );

  const regularProperties = [...requiredProperties, ...optionalProperties];

  const build = (property: string) =>
    buildJsonSchemaPropertyAnalysis(property, schema.properties![property]!, language, {
      prefix: options?.prefix,
      forceOptional: Boolean(options?.forceAllOptional),
      parentSchema: schema,
      inMoreInfoConsiderDeprecatedAndRequiredAsRequired:
        options?.considerDeprecatedAndRequiredAsRequired,
    });

  return {
    regular: regularProperties.map(build),
    deprecated: deprecatedProperties.map(build),
  };
}

function analyzeRelationshipOfJsonApiEntity(
  property: string,
  schema: JSONSchema,
  language: Language,
  options: {
    prefix?: string;
    suffix?: string;
    parentSchema?: JSONSchema;
    additionalDescription?: string;
    forceOptional?: boolean;
    inMoreInfoConsiderDeprecatedAndRequiredAsRequired?: boolean;
  },
): JsonSchemaPropertyAnalysis {
  const isRequired = options?.forceOptional
    ? false
    : ((options?.parentSchema?.required || []) as string[]).includes(property);

  return {
    prefix: options.prefix,
    suffix: options.suffix,
    property,
    deprecated: schema.deprecated,
    required: isRequired,
    types: buildRelationshipTypes(schema),
    examples: [],
    description: [options?.additionalDescription, schema.description].filter(Boolean).join('\n'),
  };
}

export function analyzeRelationshipsOfJsonApiEntity(
  schema: JSONSchema,
  language: Language,
  options: {
    prefix?: string;
    suffix?: string;
    forceAllOptional?: boolean;
    considerDeprecatedAndRequiredAsRequired?: boolean;
  } = {},
): JsonSchemaObjectAnalysis {
  const { requiredProperties, optionalProperties, deprecatedProperties } = splitPropertiesByType(
    schema,
    Boolean(options?.forceAllOptional),
    Boolean(options?.considerDeprecatedAndRequiredAsRequired),
  );

  const regularProperties = [...requiredProperties, ...optionalProperties];

  const build = (property: string) =>
    analyzeRelationshipOfJsonApiEntity(property, schema.properties![property]!, language, {
      prefix: options?.prefix,
      suffix: options?.suffix,
      forceOptional: Boolean(options?.forceAllOptional),
      parentSchema: schema,
      inMoreInfoConsiderDeprecatedAndRequiredAsRequired:
        options?.considerDeprecatedAndRequiredAsRequired,
    });

  return {
    regular: regularProperties.map(build),
    deprecated: deprecatedProperties.map(build),
  };
}

export function analyzePropertiesOfJsonApiEntity(
  jsonApiEntitySchema: JSONSchema,
  type: 'entity' | 'endpointPayload',
  language: Language,
  options: { skipEntityId?: boolean } = {},
): JsonSchemaObjectAnalysis | undefined {
  if (!jsonApiEntitySchema.properties) {
    return undefined;
  }

  const required = (jsonApiEntitySchema.required || []) as string[];

  let regular: JsonSchemaPropertyAnalysis[] = [];
  let deprecated: JsonSchemaPropertyAnalysis[] = [];

  const merge = (properties: JsonSchemaObjectAnalysis) => {
    regular = [...regular, ...properties.regular];
    deprecated = [...deprecated, ...properties.deprecated];
  };

  if (jsonApiEntitySchema.properties.id && !options?.skipEntityId) {
    regular.push(
      buildJsonSchemaPropertyAnalysis('id', jsonApiEntitySchema.properties.id, language, {
        parentSchema: jsonApiEntitySchema,
      }),
    );
  }

  if (jsonApiEntitySchema.properties.type && (type === 'entity' || language === 'http')) {
    regular.push(
      buildJsonSchemaPropertyAnalysis('type', jsonApiEntitySchema.properties.type, language, {
        parentSchema: jsonApiEntitySchema,
        additionalDescription: `Must be exactly \`"${jsonApiEntitySchema.properties.type.example}"\`.`,
        skipExamples: true,
      }),
    );
  }

  if (jsonApiEntitySchema.properties.attributes) {
    merge(
      analyzePropertiesOfGenericObject(jsonApiEntitySchema.properties.attributes, language, {
        prefix: language === 'http' ? 'attributes.' : undefined,
        considerDeprecatedAndRequiredAsRequired: type === 'endpointPayload',
        forceAllOptional: !required.includes('attributes'),
      }),
    );
  }

  if (jsonApiEntitySchema.properties.meta) {
    merge(
      analyzePropertiesOfGenericObject(jsonApiEntitySchema.properties.meta, language, {
        prefix: 'meta.',
        forceAllOptional: !required.includes('attributes'),
      }),
    );
  }

  if (jsonApiEntitySchema.properties.relationships) {
    merge(
      analyzeRelationshipsOfJsonApiEntity(jsonApiEntitySchema.properties.relationships, language, {
        prefix: language === 'http' ? 'relationships.' : undefined,
        suffix: language === 'http' ? '.data' : undefined,
        forceAllOptional: !required.includes('relationships'),
      }),
    );
  }

  return { regular, deprecated };
}
