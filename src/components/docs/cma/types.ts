import type { JSONSchema } from '@apidevtools/json-schema-ref-parser';

export type CmaEndpointHttpExample = {
  id: string;
  title: string;
  description: string;
  request: {
    description?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url?: string;
    headers?: Record<string, string>;
    body?: string;
  };
  response: {
    description?: string;
    statusCode?: number;
    statusText?: string;
    body?: string;
  };
};

export type CmaEndpointJsExample = {
  id: string;
  title: string;
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

export type CmaEndpoint = {
  private?: boolean;
  rel: string;
  title: string;
  description?: string;

  documentation?: {
    javascript?: {
      description?: string;
      examples: CmaEndpointJsExample[];
    };
    http?: {
      description?: string;
      examples: CmaEndpointHttpExample[];
    };
  };

  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schema?: JSONSchema;
  targetSchema?: JSONSchema;
  hrefSchema?: JSONSchema;
  jobSchema?: JSONSchema;
};

export type CmaEntity = JSONSchema & {
  links?: CmaEndpoint[];
};

export type CmaHyperSchema = JSONSchema & {
  groups: Array<{
    title: string;
    resources: string[];
  }>;
};
