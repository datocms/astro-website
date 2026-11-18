import { type Client } from 'datocms/lib/cma-client-node';

/*
 * Each department gives the title and the text above its form, thus the
 * code has no default. The migration fills the empty fields, then makes
 * the two fields required. It is idempotent: it does not change a value
 * that is set, and it adds a validator only when it is missing.
 */
const COPY: Record<string, { form_title: string; form_text: string }> = {
  support: {
    form_title: 'Write to us.',
    form_text: 'Our support team reads every request. Expect a reply in less than 10 hours.',
  },
  sales: {
    form_title: 'Talk with us.',
    form_text: 'Tell us about your project. We read every message.',
  },
  partners: {
    form_title: 'Let’s talk.',
    form_text: 'Tell us about your agency. We read every message.',
  },
};

export default async function (client: Client): Promise<void> {
  const departments = await client.items.list({ filter: { type: 'department' } });
  for (const department of departments) {
    const copy = COPY[String(department.slug)];
    if (!copy) continue;
    const data: Partial<typeof copy> = {};
    if (!department.form_title) data.form_title = copy.form_title;
    if (!department.form_text) data.form_text = copy.form_text;
    if (Object.keys(data).length === 0) continue;
    await client.items.update(department.id, data);
    console.log(`Department ${String(department.slug)}: form copy set`);
  }

  for (const id of ['department::form_title', 'department::form_text']) {
    const field = await client.fields.find(id);
    if ('required' in field.validators) continue;
    await client.fields.update(field.id, {
      validators: { ...field.validators, required: {} },
      hint: field.hint?.replace(/ Empty: the default (title|text)\./, '') ?? null,
    });
    console.log(`${id}: required`);
  }
}
