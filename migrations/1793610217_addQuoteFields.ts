import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

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
    image: {
      type: 'file';
    };
  }
>;
export const PartnerTestimonial = {
  ID: 'PTojBPaHTryBkxOuSi49mA',
  REF: { type: 'item_type', id: 'PTojBPaHTryBkxOuSi49mA' },
} as const;

export type Review = ItemTypeDefinition<
  EnvironmentSettings,
  '810911',
  {
    image: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    role: {
      type: 'string';
    };
    quote: {
      type: 'structured_text';
    };
    website: {
      type: 'string';
    };
    use_in_dashboard: {
      type: 'boolean';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Review = {
  ID: '810911',
  REF: { type: 'item_type', id: '810911' },
} as const;

/*
 * The quotes of the site show the role and the company as two values. Before
 * this migration, the company of a review was in the role ("CEO @ Vercel").
 * This list gives the two values for each review. The role of a partner
 * testimonial does not contain the company: the company is the partner.
 */
const REVIEW_ROLES: { id: string; role: string; company: string }[] = [
  { id: '42406722', role: 'CEO', company: 'Vercel' }, // Guillermo Rauch
  { id: '39832296', role: 'Co-founder and CPO', company: 'Stackbit' }, // Dan Barak
  { id: '39832258', role: 'Senior Manager of Marketing Technology', company: 'HashiCorp' }, // Jeff Escalante
  { id: '39832292', role: 'CTO', company: 'Coolstuff' }, // Johan Frick
  { id: '39832291', role: 'Technical Lead', company: 'Signifly' }, // Tore Heimann
  { id: '39832295', role: 'Owner', company: 'Callum Flack Design' }, // Callum Flack
  { id: '39832293', role: 'Senior Engineer', company: 'G2.com' }, // Lachlan Priest
  { id: '39832298', role: 'Founder', company: 'Weishi Solutions' }, // Magnus Pedersen
  { id: '39832290', role: 'Freelance', company: '' }, // Dave Harrison
  { id: '39832294', role: 'Freelance Creative', company: '' }, // Emil Olsson
  { id: '39832264', role: 'Growth Engineer', company: 'Livestorm' }, // Thibaut Davoult
  { id: '39832257', role: 'Senior Dev', company: 'Camp Jefferson' }, // Anthony Sapp
  { id: '39832260', role: 'Frontend designer', company: 'Bauhem' }, // Guillaume Gosselin
  { id: '39832263', role: 'Creative Director', company: 'Convincible Media' }, // Virgil Ierubino
  { id: '39832259', role: 'Marketing', company: 'Stone Ward' }, // Chris Earls
  { id: '39832261', role: 'CEO', company: 'CommerceLayer' }, // Filippo Conforti
  { id: '39832256', role: 'Partner', company: 'DeVoorhoede' }, // Jasper Moelker
  { id: '39832300', role: 'CEO', company: 'Matter Supply Co.' }, // Marc Ammann
  { id: '39832301', role: 'CEO', company: 'Matter Supply Co.' }, // Marc Ammann
  { id: '39832302', role: 'Senior Manager of Marketing Technology', company: 'HashiCorp' }, // Jeff Escalante
  { id: '39832303', role: 'CEO', company: 'Matter Supply Co.' }, // Marc Ammann
  { id: '39832305', role: 'Head of Web Marketing', company: 'Chatelaine Magazine' }, // Grace Guzman
  { id: '39832306', role: 'Architect for web', company: 'Little Caesars Pizza' }, // Andrew Smith
  { id: '39832307', role: 'Technical Project Manager', company: 'Cantiere Creativo' }, // Matteo Manzo
  { id: '39832308', role: 'Head of Web Marketing', company: 'Magnit' }, // Russell Gardner
  { id: '39832536', role: 'Lead frontend developer', company: 'Atoms' }, // Martijn Theuwissen
  { id: '47253817', role: 'Developer', company: 'Snipcart' }, // Dominic Blain
  { id: '121466909', role: 'Director of Marketing', company: 'VS Marketing' }, // Jason Polancich
  { id: 'YC9AlGltQByJxtlZD-u-Nw', role: 'Director', company: 'Curious Ways' }, // David Flindall
  { id: 'nvbRMENcQtK8HRjNdwQ5pg', role: 'Staff Web Engineer', company: 'Hatch' }, // Jimmy Merritello
  { id: 'DHFVxU5qQKaFXa5yjZIMqQ', role: 'Senior Software Engineer', company: 'Dohop' }, // Siggi Njalsson
  { id: 'UT6slX-UTi-yM6irj1ETWQ', role: 'Creative Developer', company: 'Wonderland.' }, // Maarten Vleugels
  { id: 'DypA3O3dTlKGSrDx3QIW2Q', role: 'Head of Connectors', company: 'Locale' }, // Joseph Heider
  { id: 'JP-yqKV-QYGwlBfjTBqSZQ', role: 'Head of Marketing', company: 'imgix' }, // Craig McDonogh
  { id: 'HS9E9PYbR8ire8XgT3eI7g', role: 'Dir. of Marketing Ops', company: 'SafetyChain' }, // Derrick Threatt
  { id: 'fT4Qn9KQSJCnKqPvVcYoIw', role: 'Founder', company: 'Elliott Systems' }, // Caleb Wise
  {
    id: 'IcdguI91QDOyM_KZs1izcw',
    role: 'Technical Director and Managing Partner',
    company: 'DEPT®',
  }, // Severin Klaus
  { id: 'adDu814QTBifhlLWVmRAeQ', role: 'Director of Architecture', company: 'November Five' }, // Stijn Symons
];

/* Two partner roles also contain the name of the partner. The partner shows it already. */
const PARTNER_ROLES: { id: string; role: string }[] = [
  { id: 'InLGcpVsTzWS9FxbeQ8jYg', role: 'Client partner and new business leader' }, // Steve Peters, Code Computerlove
  { id: 'FBykMWIOQOO7JfWu5Y7uMg', role: 'CTO' }, // Francesco Ronchi, Synesthesia
];

/*
 * The excerpts of the quotes that close a chapter. Each excerpt is word for
 * word from the quote, with "…" where text is cut. A quote of 120 characters
 * or less needs no excerpt: the site shows the full quote.
 */
const EXCERPTS: { model: 'review' | 'partner_testimonial'; id: string; excerpt: string }[] = [
  {
    // Grace Guzman, Chatelaine Magazine: /media
    model: 'review',
    id: '39832305',
    excerpt:
      'Thanks to DatoCMS we are able to serve massive spikes of terabytes of optimized images per day with zero operations…',
  },
  {
    // Guillermo Rauch, Vercel: /cms/nextjs-cms
    model: 'review',
    id: '42406722',
    excerpt:
      'It gives you both a great content management experience, and crucially, a great developer experience as well.',
  },
  {
    // Caleb Wise, Elliott Systems: /cms/astro-cms
    model: 'review',
    id: 'fT4Qn9KQSJCnKqPvVcYoIw',
    excerpt:
      '…equally enjoyed by both developers and digital marketers. A rare combo that really helps make a team work well.',
  },
  {
    // Matteo Manzo, Cantiere Creativo: /cms/sveltekit-cms
    model: 'review',
    id: '39832307',
    excerpt:
      '…gives you the peace of mind of being able to use the right solution for each project.',
  },
  {
    // Severin Klaus, DEPT®: /enterprise-headless-cms
    model: 'review',
    id: 'IcdguI91QDOyM_KZs1izcw',
    excerpt:
      'A fantastic (and super responsive) team that continuously drives the development forward.',
  },
  {
    // Jeff Escalante, HashiCorp: /philosophy
    model: 'review',
    id: '39832302',
    excerpt:
      "…listen to everybody's feedback, not just ours, and act on it while still being such a small, bootstrapped company.",
  },
  {
    // Tim Chesney, Make: /case-studies
    model: 'partner_testimonial',
    id: 'EsPEhRwGSTOLU19hEPLVhg',
    excerpt:
      'DatoCMS is fast, flexible and a pleasure to use — for both our clients and our developers.',
  },
];

/*
 * The featured quotes: the first row of /wall. The featured partner
 * testimonials are also the quotes of /partner-program.
 */
const FEATURED: { model: 'review' | 'partner_testimonial'; id: string }[] = [
  { model: 'review', id: '42406722' }, // Guillermo Rauch, Vercel
  { model: 'review', id: 'adDu814QTBifhlLWVmRAeQ' }, // Stijn Symons, November Five
  { model: 'review', id: '47253817' }, // Dominic Blain, Snipcart
  { model: 'review', id: 'DHFVxU5qQKaFXa5yjZIMqQ' }, // Siggi Njalsson, Dohop
  { model: 'review', id: '39832536' }, // Martijn Theuwissen, Atoms
  { model: 'review', id: '39832259' }, // Chris Earls, Stone Ward
  { model: 'partner_testimonial', id: 'AtvRB1D5Rf-Y_sJ9lMdPKQ' }, // Joe Taylor, 12 Studio
  { model: 'partner_testimonial', id: 'ZmqdqrOrS9uNj-lM01RJeA' }, // Matty Collins, Southpaw
  { model: 'partner_testimonial', id: 'PCm3oMWNTMqTIOzjqZ55rg' }, // Tibor Haller, Sitewerk AG
];

const EXCERPT_HINT =
  'Up to 120 characters, word for word from the quote. Write "…" where you cut text. The big quote that closes a chapter shows it. A quote of 120 characters or less needs no excerpt.';

const FEATURED_HINT = 'The first row of /wall shows the featured quotes.';

async function addField(
  client: Client,
  model: { type: 'item_type'; id: string },
  field: Parameters<Client['fields']['create']>[1],
) {
  const fields = await client.fields.list(model);
  if (fields.some((existing) => existing.api_key === field.api_key)) {
    console.log(`⏭️  ${field.api_key} already exists, skipping`);
    return;
  }
  await client.fields.create(model, field);
}

/* Update a record. A record that was published before the update is published again. */
async function updateRecord(client: Client, id: string, data: Record<string, unknown>) {
  const before = await client.items.find(id);
  await client.items.update(id, data);
  if (before.meta.status === 'published') {
    await client.items.publish(id);
  }
}

export default async function (client: Client): Promise<void> {
  await addField(client, Review.REF, {
    label: 'Company',
    api_key: 'company',
    field_type: 'string',
    hint: 'The name of the company, without the role. The link of the company is the website.',
    position: 3,
  });

  for (const model of [Review.REF, PartnerTestimonial.REF]) {
    await addField(client, model, {
      label: 'Excerpt',
      api_key: 'excerpt',
      field_type: 'string',
      hint: EXCERPT_HINT,
      validators: { length: { max: 120 } },
    });
    await addField(client, model, {
      label: 'Featured',
      api_key: 'featured',
      field_type: 'boolean',
      hint: FEATURED_HINT,
      default_value: false,
    });
  }

  for (const { id, role, company } of REVIEW_ROLES) {
    await updateRecord(client, id, { role, company: company || null });
  }

  for (const { id, role } of PARTNER_ROLES) {
    await updateRecord(client, id, { role });
  }

  for (const { id, excerpt } of EXCERPTS) {
    await updateRecord(client, id, { excerpt });
  }

  for (const { id } of FEATURED) {
    await updateRecord(client, id, { featured: true });
  }
}
