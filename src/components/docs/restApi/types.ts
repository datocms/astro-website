import type { JSONSchema4Type, JSONSchema4TypeName } from 'json-schema';

export type RestApiEndpointHttpExample = {
  id: string;
  title: string;
  description: string;
  request?: {
    description?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url?: string;
    headers?: Record<string, string>;
    body?: string;
  };
  response?: {
    description?: string;
    statusCode?: number;
    statusText?: string;
    headers?: Record<string, string>;
    body?: string;
  };
};

export type RestApiEndpointJsExample = {
  id: string;
  title?: string;
  description: string;
  request?: {
    description?: string;
    code?: string;
  };
  response?: {
    description?: string;
    code?: string;
  };
};

export type RestApiEndpoint = {
  private?: boolean;
  rel: string;
  title: string;
  description?: string;

  documentation?: {
    javascript?: {
      description?: string;
      examples: RestApiEndpointJsExample[];
    };
    http?: {
      description?: string;
      examples: RestApiEndpointHttpExample[];
    };
  };

  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schema?: JSONSchema;
  targetSchema?: JSONSchema;
  hrefSchema?: JSONSchema;
  jobSchema?: JSONSchema;
};

export type RestApiEntity = JSONSchema & {
  links?: RestApiEndpoint[];
};

export type CmaHyperSchema = JSONSchema & {
  groups: Array<{
    title: string;
    resources: string[];
  }>;
};

export interface JSONSchema {
  id?: string;
  $ref?: string;
  $schema?: string;
  title?: string;
  description?: string;
  default?: JSONSchema4Type;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | JSONSchema;
  items?: JSONSchema | JSONSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: boolean | string[];
  additionalProperties?: boolean | JSONSchema;
  definitions?: {
    [k: string]: JSONSchema;
  };
  properties?: {
    [k: string]: JSONSchema;
  };
  patternProperties?: {
    [k: string]: JSONSchema;
  };
  dependencies?: {
    [k: string]: JSONSchema | string[];
  };
  enum?: JSONSchema4Type[];
  enumDescription?: Record<string, string>;

  type?: JSONSchema4TypeName | JSONSchema4TypeName[];
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
  extends?: string | string[];
  format?: string;

  const?: JSONSchema4Type;

  hideFromDocs?: boolean;
  deprecated?: string;
  hideFromExample?: boolean;

  example?: unknown;
  examples?: unknown[];
}
