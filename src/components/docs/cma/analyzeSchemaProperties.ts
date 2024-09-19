import type { JSONSchema } from './types';

export type MoreInfo = {
  title: string;
  properties: PropertiesDoc;
};

export type PropertyDoc = {
  prefix?: string;
  property: string;
  deprecated?: string;
  required?: boolean;
  types: string[];
  examples: unknown[];
  description: string;
  moreInfo?: MoreInfo;
};

export type PropertiesDoc = {
  regular: PropertyDoc[];
  deprecated: PropertyDoc[];
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
      return schema.format;
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

      return `Array<${toArray(schema.items.type).join('/')}>`;
    }

    return type!;
  });
}

function buildPropertyMoreInfo(
  schema: JSONSchema,
  considerDeprecatedAndRequiredAsRequired: boolean,
): MoreInfo | undefined {
  const types = toArray(schema.type);

  if (types.includes('object') && schema.properties) {
    return buildMoreInfo('object format', schema, { considerDeprecatedAndRequiredAsRequired });
  }

  if (types.includes('array') && schema.items) {
    const items = toArray(schema.items);
    const objectType = items.find((items) => toArray(items.type).includes('object'));

    if (objectType && objectType.properties) {
      return buildMoreInfo('objects format inside array', objectType, {
        considerDeprecatedAndRequiredAsRequired,
      });
    }
  }
}

function buildPropertyDoc(
  property: string,
  schema: JSONSchema,
  options: {
    prefix?: string;
    parentSchema?: JSONSchema;
    additionalDescription?: string;
    forceOptional?: boolean;
    inMoreInfoConsiderDeprecatedAndRequiredAsRequired?: boolean;
  },
): PropertyDoc {
  const isRequired = options?.forceOptional
    ? false
    : ((options?.parentSchema?.required || []) as string[]).includes(property);

  return {
    prefix: options.prefix,
    property,
    deprecated: schema.deprecated,
    required: isRequired,
    types: buildTypes(schema),
    examples: schema.examples ? schema.examples : schema.example ? [schema.example] : [],
    description: [options?.additionalDescription, schema.description].filter(Boolean).join('\n'),
    moreInfo: buildPropertyMoreInfo(
      schema,
      Boolean(options?.inMoreInfoConsiderDeprecatedAndRequiredAsRequired),
    ),
  };
}

function buildMoreInfo(
  title: string,
  schema: JSONSchema,
  options: {
    prefix?: string;
    propertiesToShow?: Array<'required' | 'optional' | 'deprecated'>;
    considerDeprecatedAndRequiredAsRequired?: boolean;
  } = {},
): MoreInfo {
  return {
    title,
    properties: buildObjectPropertiesDoc(schema, options),
  };
}

export function buildObjectPropertiesDoc(
  schema: JSONSchema,
  options: {
    prefix?: string;
    forceAllOptional?: boolean;
    considerDeprecatedAndRequiredAsRequired?: boolean;
  } = {},
): PropertiesDoc {
  const { requiredProperties, optionalProperties, deprecatedProperties } = splitPropertiesByType(
    schema,
    Boolean(options?.forceAllOptional),
    Boolean(options?.considerDeprecatedAndRequiredAsRequired),
  );

  const regularProperties = [...requiredProperties, ...optionalProperties];

  const build = (property: string) =>
    buildPropertyDoc(property, schema.properties![property]!, {
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

export function jsonApiEntityDoc(
  jsonApiEntitySchema: JSONSchema,
  type: 'entity' | 'endpointPayload',
): PropertiesDoc | undefined {
  if (!jsonApiEntitySchema.properties) {
    return undefined;
  }

  const required = (jsonApiEntitySchema.required || []) as string[];

  let regular: PropertyDoc[] = [];
  let deprecated: PropertyDoc[] = [];

  const merge = (properties: PropertiesDoc) => {
    regular = [...regular, ...properties.regular];
    deprecated = [...deprecated, ...properties.deprecated];
  };

  if (jsonApiEntitySchema.properties.id) {
    regular.push(
      buildPropertyDoc('id', jsonApiEntitySchema.properties.id, {
        parentSchema: jsonApiEntitySchema,
      }),
    );
  }

  if (jsonApiEntitySchema.properties.type) {
    regular.push(
      buildPropertyDoc('type', jsonApiEntitySchema.properties.type, {
        parentSchema: jsonApiEntitySchema,
        additionalDescription: `Must be exactly \`"${jsonApiEntitySchema.properties.type.example}"\`.`,
      }),
    );
  }

  if (jsonApiEntitySchema.properties.attributes) {
    merge(
      buildObjectPropertiesDoc(jsonApiEntitySchema.properties.attributes, {
        prefix: 'attributes.',
        considerDeprecatedAndRequiredAsRequired: type === 'endpointPayload',
        forceAllOptional: !required.includes('attributes'),
      }),
    );
  }

  if (jsonApiEntitySchema.properties.meta) {
    merge(
      buildObjectPropertiesDoc(jsonApiEntitySchema.properties.meta, {
        prefix: 'meta.',
        forceAllOptional: !required.includes('attributes'),
      }),
    );
  }

  return { regular, deprecated };
}
