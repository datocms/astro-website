import ky from 'ky';
import { sortBy } from 'lodash-es';

type ScalarInput = {
  type: 'scalar';
  input_type:
    | 'boolean'
    | 'date'
    | 'date_time'
    | 'float'
    | 'integer'
    | 'string'
    | 'upload_id'
    | 'item_id';
  array?: boolean;
  required?: boolean;
};

type EnumInput = {
  type: 'scalar';
  input_type: 'enum';
  values: string[];
  array?: boolean;
  required?: boolean;
};

type ObjectInput = {
  type: 'object';
  arguments: Array<ScalarInput | EnumInput>;
  array?: boolean;
  required?: boolean;
};

export type Input = ScalarInput | EnumInput | ObjectInput;

type Operator = {
  description: string;
  input: Input;
  deprecated?: boolean;
};

export type Filters = Record<string, Operator>;

export async function fetchIntrospectionFieldFilters() {
  const { field_types, meta } = await ky<{
    meta: Record<string, Filters>;
    field_types: Record<string, Filters>;
  }>(`https://internal.datocms.com/introspection/field-filters`).json();

  return {
    field_types: Object.fromEntries(sortBy(Object.entries(field_types), '0')),
    meta: Object.fromEntries(sortBy(Object.entries(meta), '0')),
  };
}

export async function fetchIntrospectionUploadFilters() {
  const { filters } = await ky<{ filters: Record<string, Filters> }>(
    `https://internal.datocms.com/introspection/upload-filters`,
  ).json();

  return {
    filters: Object.fromEntries(sortBy(Object.entries(filters), '0')),
  };
}

export const fieldTypeName: Record<string, string> = {
  boolean: 'Boolean',
  color: 'Color',
  date: 'Date',
  date_time: 'DateTime',
  file: 'Single file',
  float: 'Floating-point number',
  gallery: 'Multiple files',
  image: 'Image',
  integer: 'Integer number',
  json: 'JSON',
  lat_lon: 'Geolocation',
  link: 'Single link',
  links: 'Multiple links',
  rich_text: 'Modular content',
  seo: 'SEO meta tags',
  slug: 'Slug',
  string: 'Single-line string',
  text: 'Multiple-paragraph text',
  structured_text: 'Structured text',
  video: 'Video',
};
