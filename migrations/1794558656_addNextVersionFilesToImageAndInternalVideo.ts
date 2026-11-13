import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type Image = ItemTypeDefinition<
  EnvironmentSettings,
  '810933',
  {
    image: {
      type: 'file';
    };
    frameless: {
      type: 'boolean';
    };
  }
>;
export const Image = {
  ID: '810933',
  REF: { type: 'item_type', id: '810933' },
} as const;

export type InternalVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '810948',
  {
    video: {
      type: 'file';
    };
  }
>;
export const InternalVideo = {
  ID: '810948',
  REF: { type: 'item_type', id: '810948' },
} as const;

export type AnyBlock = Image | InternalVideo;
export type AnyModel = never;
export type AnyBlockOrModel = AnyBlock | AnyModel;

type NewFileField = {
  blockId: string;
  apiKey: string;
  label: string;
  hint: string;
  predefinedList: 'image' | 'video';
  position: number;
};

const newFields: NewFileField[] = [
  {
    blockId: Image.ID,
    apiKey: 'image_next',
    label: 'Image (next version)',
    hint: 'Image of the new product UI. The new website shows this image. When this field is empty, the new website shows Image.',
    predefinedList: 'image',
    position: 1,
  },
  {
    blockId: InternalVideo.ID,
    apiKey: 'video_next',
    label: 'Video (next version)',
    hint: 'Video of the new product UI. The new website shows this video. When this field is empty, the new website shows Video.',
    predefinedList: 'video',
    position: 2,
  },
];

export default async function (client: Client): Promise<void> {
  for (const field of newFields) {
    // Skip a field that exists, thus a second run changes nothing.
    const existing = await client.fields.list(field.blockId);
    if (existing.some((f) => f.api_key === field.apiKey)) {
      console.log(`Skip ${field.apiKey}: the field exists`);
      continue;
    }

    await client.fields.create(field.blockId, {
      label: field.label,
      api_key: field.apiKey,
      field_type: 'file',
      hint: field.hint,
      validators: {
        extension: { predefined_list: field.predefinedList },
      },
      appearance: { addons: [], editor: 'file', parameters: {} },
      position: field.position,
    });
    console.log(`Created ${field.apiKey}`);
  }
}
