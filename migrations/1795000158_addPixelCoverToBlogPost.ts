import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type BlogPost = ItemTypeDefinition<
  EnvironmentSettings,
  '810907',
  {
    cover_image: {
      type: 'file';
    };
    seo_h1: {
      type: 'string';
    };
    seo_settings: {
      type: 'seo';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    yoast_analysis: {
      type: 'json';
    };
    canonical_url: {
      type: 'string';
    };
    excerpt: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
      blocks:
        | Demo
        | Image
        | QuestionAnswer
        | MultipleDemosBlock
        | InternalVideo
        | Video
        | CodesandboxEmbedBlock
        | CtaButton
        | TutorialVideo
        | ShowcaseProjectBlock
        | Table
        | ImageCarousel
        | TabsBlock
        | CopyPromptButtonBlock;
    };
    author: {
      type: 'links';
    };
    category: {
      type: 'link';
    };
  }
>;
export const BlogPost = {
  ID: '810907',
  REF: { type: 'item_type', id: '810907' },
} as const;

export type CodesandboxEmbedBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '1113148',
  {
    slug: {
      type: 'string';
    };
    preview: {
      type: 'file';
    };
  }
>;
export const CodesandboxEmbedBlock = {
  ID: '1113148',
  REF: { type: 'item_type', id: '1113148' },
} as const;

export type CopyPromptButtonBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'QHwi-9HiQ56AAymCe-1spg',
  {
    prompt: {
      type: 'text';
    };
  }
>;
export const CopyPromptButtonBlock = {
  ID: 'QHwi-9HiQ56AAymCe-1spg',
  REF: { type: 'item_type', id: 'QHwi-9HiQ56AAymCe-1spg' },
} as const;

export type CtaButton = ItemTypeDefinition<
  EnvironmentSettings,
  '1989011',
  {
    text: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    font_size: {
      type: 'string';
    };
    padding: {
      type: 'string';
    };
    style: {
      type: 'string';
    };
    alignment: {
      type: 'string';
    };
  }
>;
export const CtaButton = {
  ID: '1989011',
  REF: { type: 'item_type', id: '1989011' },
} as const;

export type Demo = ItemTypeDefinition<
  EnvironmentSettings,
  '810890',
  {
    demo: {
      type: 'link';
    };
  }
>;
export const Demo = {
  ID: '810890',
  REF: { type: 'item_type', id: '810890' },
} as const;

export type DocCallout = ItemTypeDefinition<
  EnvironmentSettings,
  '1437522',
  {
    callout_type: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    text: {
      type: 'structured_text';
    };
  }
>;
export const DocCallout = {
  ID: '1437522',
  REF: { type: 'item_type', id: '1437522' },
} as const;

export type Image = ItemTypeDefinition<
  EnvironmentSettings,
  '810933',
  {
    image: {
      type: 'file';
    };
    image_next: {
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

export type ImageCarousel = ItemTypeDefinition<
  EnvironmentSettings,
  'HX6gB2qVTHqjaHQL6EnJkw',
  {
    gallery: {
      type: 'gallery';
    };
    carousel_height: {
      type: 'integer';
    };
  }
>;
export const ImageCarousel = {
  ID: 'HX6gB2qVTHqjaHQL6EnJkw',
  REF: { type: 'item_type', id: 'HX6gB2qVTHqjaHQL6EnJkw' },
} as const;

export type InternalVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '810948',
  {
    video: {
      type: 'file';
    };
    video_next: {
      type: 'file';
    };
  }
>;
export const InternalVideo = {
  ID: '810948',
  REF: { type: 'item_type', id: '810948' },
} as const;

export type MultipleDemosBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '810947',
  {
    demos: {
      type: 'links';
    };
  }
>;
export const MultipleDemosBlock = {
  ID: '810947',
  REF: { type: 'item_type', id: '810947' },
} as const;

export type QuestionAnswer = ItemTypeDefinition<
  EnvironmentSettings,
  '810941',
  {
    question: {
      type: 'structured_text';
    };
    answer: {
      type: 'structured_text';
    };
  }
>;
export const QuestionAnswer = {
  ID: '810941',
  REF: { type: 'item_type', id: '810941' },
} as const;

export type ShowcaseProjectBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '2023385',
  {
    showcase_projects: {
      type: 'links';
    };
  }
>;
export const ShowcaseProjectBlock = {
  ID: '2023385',
  REF: { type: 'item_type', id: '2023385' },
} as const;

export type TabBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'GjLOu646QL6-cZv7-xrZOw',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
      blocks: Image | Video | DocCallout;
    };
  }
>;
export const TabBlock = {
  ID: 'GjLOu646QL6-cZv7-xrZOw',
  REF: { type: 'item_type', id: 'GjLOu646QL6-cZv7-xrZOw' },
} as const;

export type Table = ItemTypeDefinition<
  EnvironmentSettings,
  '2033750',
  {
    table: {
      type: 'json';
    };
  }
>;
export const Table = {
  ID: '2033750',
  REF: { type: 'item_type', id: '2033750' },
} as const;

export type TabsBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'Ofx0DBoZT4qi3lR538stGQ',
  {
    tabs: {
      type: 'rich_text';
      blocks: TabBlock;
    };
  }
>;
export const TabsBlock = {
  ID: 'Ofx0DBoZT4qi3lR538stGQ',
  REF: { type: 'item_type', id: 'Ofx0DBoZT4qi3lR538stGQ' },
} as const;

export type TutorialVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '1989853',
  {
    tutorials: {
      type: 'links';
    };
  }
>;
export const TutorialVideo = {
  ID: '1989853',
  REF: { type: 'item_type', id: '1989853' },
} as const;

export type Video = ItemTypeDefinition<
  EnvironmentSettings,
  '810949',
  {
    video: {
      type: 'video';
    };
  }
>;
export const Video = {
  ID: '810949',
  REF: { type: 'item_type', id: '810949' },
} as const;

export type AnyBlock =
  | CodesandboxEmbedBlock
  | CopyPromptButtonBlock
  | CtaButton
  | Demo
  | DocCallout
  | Image
  | ImageCarousel
  | InternalVideo
  | MultipleDemosBlock
  | QuestionAnswer
  | ShowcaseProjectBlock
  | TabBlock
  | Table
  | TabsBlock
  | TutorialVideo
  | Video;
export type AnyModel = BlogPost;
export type AnyBlockOrModel = AnyBlock | AnyModel;

/*
 * A blog post gets its cover and its theme from the CMS:
 *
 * - `pixel_cover` is the file of the cover: a PNG of 100 × 58 pixels, one
 *   pixel for each cell. The file has only tones (black, grey, white) on a
 *   transparent ground. The site gives the cells the colours of the theme.
 * - `theme` is the theme of the post: the colours of the cover and of the
 *   page of the post.
 *
 * The migration is idempotent: it does not make a field that exists.
 */
const THEMES = ['yellow', 'orange', 'green', 'purple', 'blue', 'pink'];

export default async function (client: Client): Promise<void> {
  const fields = await client.fields.list(BlogPost.ID);
  const has = (apiKey: string) => fields.some((field) => field.api_key === apiKey);

  if (!has('pixel_cover')) {
    await client.fields.create(BlogPost.ID, {
      label: 'Pixel cover',
      api_key: 'pixel_cover',
      field_type: 'file',
      hint: 'The cover of the post: a PNG of 100 × 58 pixels with only tones. Make it with scripts/blog-covers/gen.ts in the repository of the website.',
      validators: {
        extension: { extensions: ['png'] },
        image_dimensions: {
          width_min_value: 100,
          width_max_value: 100,
          height_min_value: 58,
          height_max_value: 58,
        },
      },
      position: 1,
    });
    console.log('blog_post::pixel_cover: made');
  }

  if (!has('theme')) {
    await client.fields.create(BlogPost.ID, {
      label: 'Theme',
      api_key: 'theme',
      field_type: 'string',
      hint: 'The colours of the cover and of the page of the post. The three posts of a featured row of the blog have three different themes. Empty: the website takes a theme from the slug of the post.',
      validators: { enum: { values: THEMES } },
      appearance: {
        editor: 'string_select',
        parameters: {
          options: THEMES.map((theme) => ({
            label: theme[0]!.toUpperCase() + theme.slice(1),
            value: theme,
            hint: '',
          })),
        },
        addons: [],
      },
      position: 2,
    });
    console.log('blog_post::theme: made');
  }
}
