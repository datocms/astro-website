import { type Client } from 'datocms/lib/cma-client-node';

/*
 * The departments of the team. Before, the code had the IDs of the people
 * of each contact point (Support, Sales, Partner Program) and a rule for the
 * researcher. Now each team member links to the departments that answer
 * with them, and each support topic links to the departments that answer
 * its form. The code finds a department by its slug.
 *
 * The migration is idempotent: it finds the model, the fields and the
 * records before it creates them, and it sets the same links again.
 */

// The IDs of the models, from the schema of the environment.
const TEAM_MEMBER = '810917';
const SUPPORT_TOPIC = '810919';

interface DepartmentSeed {
  name: string;
  slug: string;
  formTitle?: string;
  formText?: string;
  /** The IDs of the TeamMember records. */
  people: string[];
  /** The slugs of the support topics. A subtopic gets the departments of its parent. */
  topics: string[];
}

const KASIMIR_BERGER = '39830738';
const MATTEO_PAPADOPOULOS = '142812727';
const MARCELO_FINAMOR = '79766956';
const ROGER_TUAN = 'V_7KMMRtTCGmue1QqTZZ_Q';
const MATTEO_BALOCCO = '164598660';
const MATTEO_GIACCONE = '39830610';
const STEFANO_VERNA = '39830606';

const DEPARTMENTS: DepartmentSeed[] = [
  {
    name: 'Support',
    slug: 'support',
    people: [MARCELO_FINAMOR, ROGER_TUAN],
    topics: [
      'technical-support',
      'account-access',
      'billing',
      'legal-and-privacy-questions',
      'ideas-and-feedback',
    ],
  },
  {
    name: 'Sales',
    slug: 'sales',
    people: [KASIMIR_BERGER, MATTEO_PAPADOPOULOS],
    topics: ['business-partnerships'],
  },
  {
    name: 'Partner Program',
    slug: 'partners',
    people: [MATTEO_PAPADOPOULOS],
    topics: ['business-partnerships'],
  },
  {
    name: 'Research',
    slug: 'research',
    formTitle: 'Tell us what you think.',
    formText: 'Our research team reads every message.',
    people: [MATTEO_BALOCCO, MATTEO_GIACCONE, STEFANO_VERNA],
    topics: ['spontaneous-feedback'],
  },
];

async function findField(client: Client, id: string) {
  try {
    return await client.fields.find(id);
  } catch {
    return undefined;
  }
}

export default async function (client: Client): Promise<void> {
  // 1. The model.
  let department = (await client.itemTypes.list()).find((m) => m.api_key === 'department');
  if (!department) {
    department = await client.itemTypes.create({
      name: 'Department',
      api_key: 'department',
      draft_mode_active: true,
      hint: 'A team that answers a form or a contact button. Its people are the team members that link to it.',
    });
    console.log('Model department: created');
  }

  // 2. The fields of the model.
  let nameField = await findField(client, 'department::name');
  if (!nameField) {
    nameField = await client.fields.create(department.id, {
      label: 'Name',
      api_key: 'name',
      field_type: 'string',
      hint: 'The line below the faces, for example "Support".',
      validators: { required: {} },
      appearance: { editor: 'single_line', parameters: { heading: true }, addons: [] },
    });
    await client.itemTypes.update(department.id, {
      title_field: { type: 'field', id: nameField.id },
    });
  }

  if (!(await findField(client, 'department::slug'))) {
    await client.fields.create(department.id, {
      label: 'Slug',
      api_key: 'slug',
      field_type: 'slug',
      hint: 'The code finds the department with it (contact: "sales"). Do not change it.',
      validators: {
        required: {},
        unique: {},
        slug_format: { predefined_pattern: 'webpage_slug' },
        slug_title_field: { title_field_id: nameField.id },
      },
      appearance: { editor: 'slug', parameters: { url_prefix: null }, addons: [] },
    });
  }

  if (!(await findField(client, 'department::form_title'))) {
    await client.fields.create(department.id, {
      label: 'Form title',
      api_key: 'form_title',
      field_type: 'string',
      hint: 'The title above the support form of the topics of this department. Empty: the default title.',
    });
  }

  if (!(await findField(client, 'department::form_text'))) {
    await client.fields.create(department.id, {
      label: 'Form text',
      api_key: 'form_text',
      field_type: 'string',
      hint: 'The text below the faces, above the support form. Empty: the default text.',
    });
  }

  // 3. The links to the departments.
  const linksTo = { items_item_type: { item_types: [department.id] } };

  if (!(await findField(client, 'team_member::departments'))) {
    await client.fields.create(TEAM_MEMBER, {
      label: 'Departments',
      api_key: 'departments',
      field_type: 'links',
      hint: 'The contact buttons and the forms of these departments show this person.',
      validators: linksTo,
      appearance: { editor: 'links_select', parameters: {}, addons: [] },
    });
  }

  if (!(await findField(client, 'support_topic::departments'))) {
    await client.fields.create(SUPPORT_TOPIC, {
      label: 'Departments',
      api_key: 'departments',
      field_type: 'links',
      hint: 'The people next to the form. Empty: the departments of the parent topic.',
      validators: linksTo,
      appearance: { editor: 'links_select', parameters: {}, addons: [] },
    });
  }

  // 4. The records.
  const existing = await client.items.list({ filter: { type: 'department' } });
  const idBySlug = new Map<string, string>();
  for (const seed of DEPARTMENTS) {
    let record = existing.find((r) => r.slug === seed.slug);
    if (!record) {
      record = await client.items.create({
        item_type: { type: 'item_type', id: department.id },
        name: seed.name,
        slug: seed.slug,
        form_title: seed.formTitle ?? null,
        form_text: seed.formText ?? null,
      });
      console.log(`Department ${seed.slug}: created`);
    }
    idBySlug.set(seed.slug, record.id);
  }

  // 5. The links of the people and of the topics.
  const departmentsOf = (key: 'people' | 'topics', value: string) =>
    DEPARTMENTS.filter((seed) => seed[key].includes(value)).map((seed) => idBySlug.get(seed.slug)!);

  const people = new Set(DEPARTMENTS.flatMap((seed) => seed.people));
  for (const id of people) {
    await client.items.update(id, { departments: departmentsOf('people', id) });
  }

  const topics = await client.items.list({ filter: { type: 'support_topic' } });
  for (const slug of new Set(DEPARTMENTS.flatMap((seed) => seed.topics))) {
    const topic = topics.find((t) => t.slug === slug);
    if (!topic) {
      console.log(`Skip topic ${slug}: it does not exist`);
      continue;
    }
    await client.items.update(topic.id, { departments: departmentsOf('topics', slug) });
  }
  console.log(`Links: ${people.size} people, ${topics.length} topics read`);
}
