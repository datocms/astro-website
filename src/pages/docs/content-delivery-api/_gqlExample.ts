import { camelCase } from 'lodash-es';
import { invariant } from '~/lib/invariant';
import type { Input } from './_utils';

export function gqlExample(fieldName: string, filterName: string, input: Input) {
  const comment = commentForType(input);
  const filter = `${camelize(filterName)}: ${exampleForType(filterName, input)}`;

  if (filter.length > 30) {
    return `query {
  allProducts(
    filter: {
      ${nicerFieldName(fieldName)}: {
        ${[comment, filter].filter(Boolean).join('\n        ')}
      }
    }
  ) {
    title
  }
}`;
  }

  return `query {
  allProducts(filter: { ${nicerFieldName(fieldName)}: { ${filter} } }) {
    title
  }
}`;
}

export const camelize = (name: string) => {
  if (name.startsWith('_')) {
    return `_${camelCase(name)}`;
  }

  return camelCase(name);
};

const singleExampleForType = (filterName: string, input: Input) => {
  if (filterName === 'matches' || filterName === 'not_matches') {
    return '{ pattern: "bi(cycl|k)e", caseSensitive: false }';
  } else if (filterName === 'near') {
    return '{ latitude: 40.73, longitude: -73.93, radius: 10 }';
  }

  invariant(input.type === 'scalar');

  const type = input.input_type;

  if (type === 'item_id' || type === 'upload_id') {
    return '"123"';
  } else if (type === 'boolean') {
    return 'true';
  } else if (type === 'string') {
    return '"bike"';
  } else if (type === 'enum') {
    return input.values[0];
  } else if (type === 'float') {
    return '19.99';
  } else if (type === 'integer') {
    return '3';
  } else if (type === 'date_time') {
    return '"2018-02-13T14:30:13+00:00"';
  } else if (type === 'date') {
    return '"2018-02-13"';
  } else {
    return type;
  }
};

const exampleForType = (filterName: string, input: Input) => {
  const singleExample = singleExampleForType(filterName, input);

  if (input.array) {
    return `[${singleExample}]`;
  }

  return singleExample;
};

const commentForType = (input: Input) => {
  if (input.type !== 'scalar') {
    return null;
  }

  invariant(input.type === 'scalar');

  const type = input.input_type;

  if (type === 'date_time') {
    return '# Value is truncated to the minute: "2018-02-13T14:30:00+00:00"';
  } else {
    return null;
  }
};

const isMetaField = (fieldName: string) => {
  return fieldName.startsWith('_') || ['id', 'parent', 'position'].includes(fieldName);
};

const nicerFieldName = (fieldName: string) => {
  let nicerFieldName = `${camelize(fieldName)}`;
  if (!isMetaField(fieldName)) nicerFieldName += 'Field';
  return nicerFieldName;
};

export function exampleForUpload(fieldName: string, filterName: string, input: Input) {
  const filter = `${camelize(filterName)}: ${exampleForType(filterName, input)}`;

  if (filter.length > 30) {
    return `query {
  allUploads(
    filter: {
      ${camelize(fieldName)}: {
        ${filter}
      }
    }
  ) {
    blurUpThumb
    url(imgixParams: { auto: format, w: 100, h: 100, fit: crop })
  }
}`;
  }

  return `query {
  allUploads(filter: { ${camelize(fieldName)}: { ${filter} } }) {
    blurUpThumb
    url(imgixParams: { auto: format, w: 100, h: 100, fit: crop })
  }
}`;
}
