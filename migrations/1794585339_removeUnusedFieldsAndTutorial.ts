import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type Feature = ItemTypeDefinition<
  EnvironmentSettings,
  '1004242',
  {
    seo_h1: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    video: {
      type: 'file';
    };
    video2: {
      type: 'file';
    };
    video3: {
      type: 'file';
    };
    quote: {
      type: 'link';
    };
    quote2: {
      type: 'link';
    };
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
    github_url: {
      type: 'string';
    };
  }
>;
export const Feature = {
  ID: '1004242',
  REF: { type: 'item_type', id: '1004242' },
} as const;

export type OtherVideoResource = ItemTypeDefinition<
  EnvironmentSettings,
  '1989695',
  {
    cover_image: {
      type: 'file';
    };
    url: {
      type: 'string';
    };
  }
>;
export const OtherVideoResource = {
  ID: '1989695',
  REF: { type: 'item_type', id: '1989695' },
} as const;

export type PartnerTestimonial = ItemTypeDefinition<
  EnvironmentSettings,
  'PTojBPaHTryBkxOuSi49mA',
  {
    partner: {
      type: 'link';
    };
    quote: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    role: {
      type: 'string';
    };
    excerpt: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    featured: {
      type: 'boolean';
    };
  }
>;
export const PartnerTestimonial = {
  ID: 'PTojBPaHTryBkxOuSi49mA',
  REF: { type: 'item_type', id: 'PTojBPaHTryBkxOuSi49mA' },
} as const;

export type PluginCollection = ItemTypeDefinition<
  EnvironmentSettings,
  'dNFtu9DSSZSP4LY8yxmc3w',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    slug: {
      type: 'slug';
    };
    plugins: {
      type: 'links';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const PluginCollection = {
  ID: 'dNFtu9DSSZSP4LY8yxmc3w',
  REF: { type: 'item_type', id: 'dNFtu9DSSZSP4LY8yxmc3w' },
} as const;

export type PricingHint = ItemTypeDefinition<
  EnvironmentSettings,
  '810916',
  {
    name: {
      type: 'string';
    };
    api_id: {
      type: 'slug';
    };
    description: {
      type: 'string';
    };
    documentation_url: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const PricingHint = {
  ID: '810916',
  REF: { type: 'item_type', id: '810916' },
} as const;

export type TeamMember = ItemTypeDefinition<
  EnvironmentSettings,
  '810917',
  {
    legacy_avatar: {
      type: 'file';
    };
    avatar: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    role: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const TeamMember = {
  ID: '810917',
  REF: { type: 'item_type', id: '810917' },
} as const;

export type TechPartner = ItemTypeDefinition<
  EnvironmentSettings,
  'J2XQLT3VQ82Zxk7OMx7eFQ',
  {
    description: {
      type: 'structured_text';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    npm_user: {
      type: 'link';
    };
    public_contact_email: {
      type: 'string';
    };
    short_description: {
      type: 'structured_text';
    };
    logo: {
      type: 'file';
    };
    website_url: {
      type: 'string';
    };
    areas_of_expertise: {
      type: 'links';
    };
    technologies: {
      type: 'links';
    };
    locations: {
      type: 'links';
    };
  }
>;
export const TechPartner = {
  ID: 'J2XQLT3VQ82Zxk7OMx7eFQ',
  REF: { type: 'item_type', id: 'J2XQLT3VQ82Zxk7OMx7eFQ' },
} as const;

export type Tutorial = ItemTypeDefinition<
  EnvironmentSettings,
  '810923',
  {
    title: {
      type: 'string';
    };
    excerpt: {
      type: 'structured_text';
    };
    url: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Tutorial = {
  ID: '810923',
  REF: { type: 'item_type', id: '810923' },
} as const;

export type VideoTutorial = ItemTypeDefinition<
  EnvironmentSettings,
  '1989693',
  {
    title: {
      type: 'string';
    };
    video_tutorial_resource: {
      type: 'single_block';
      blocks: YoutubeVideoResource | OtherVideoResource;
    };
    show_in_docs_homepage: {
      type: 'boolean';
    };
  }
>;
export const VideoTutorial = {
  ID: '1989693',
  REF: { type: 'item_type', id: '1989693' },
} as const;

export type YoutubeVideoResource = ItemTypeDefinition<
  EnvironmentSettings,
  '1989694',
  {
    video: {
      type: 'video';
    };
  }
>;
export const YoutubeVideoResource = {
  ID: '1989694',
  REF: { type: 'item_type', id: '1989694' },
} as const;

export type AnyBlock = OtherVideoResource | YoutubeVideoResource;
export type AnyModel =
  | Feature
  | PartnerTestimonial
  | PluginCollection
  | PricingHint
  | TeamMember
  | TechPartner
  | Tutorial
  | VideoTutorial;
export type AnyBlockOrModel = AnyBlock | AnyModel;

/*
 * No page and no other app reads these fields. The migration deletes them.
 * A second run changes nothing.
 */
const fields = [
  'tech_partner::npm_user',
  'pricing_hint::documentation_url',
  'feature::github_url',
  'team_member::legacy_avatar',
  'video_tutorial::show_in_docs_homepage',
  'plugin_collection::description',
  'partner_testimonial::excerpt',
];

export default async function (client: Client): Promise<void> {
  for (const id of fields) {
    // Skip a field that does not exist, thus a second run changes nothing.
    let field;
    try {
      field = await client.fields.find(id);
    } catch {
      console.log(`Skip ${id}: the field does not exist`);
      continue;
    }
    await client.fields.destroy(field.id);
    console.log(`${id}: deleted`);
  }

  // The tutorial model holds 9 links to outside tutorials from 2021. No page
  // shows them, and no field links to the model.
  const models = await client.itemTypes.list();
  const tutorial = models.find((model) => model.api_key === 'tutorial');
  if (tutorial) {
    await client.itemTypes.destroy(tutorial.id);
    console.log('tutorial: deleted');
  } else {
    console.log('Skip tutorial: the model does not exist');
  }
}
