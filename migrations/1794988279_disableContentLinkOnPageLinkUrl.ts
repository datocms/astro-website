import { type Client } from 'datocms/lib/cma-client-node';

/*
 * The URL of a page link (the guides of a support topic) is the href of a
 * link: data, not text that an editor clicks to change. With stega, the
 * invisible characters went into the href, and the link was broken in
 * draft mode. Without Content Link, the CDA sends the URL as it is. The
 * title of the link keeps Content Link: it is the visible text.
 */
const fields = ['page_link::url'];

export default async function (client: Client): Promise<void> {
  for (const id of fields) {
    // Skip a field that does not exist or that has Content Link off, thus a
    // second run changes nothing.
    let field;
    try {
      field = await client.fields.find(id);
    } catch {
      console.log(`Skip ${id}: the field does not exist`);
      continue;
    }
    if (!field.content_link_enabled) {
      console.log(`Skip ${id}: Content Link is off`);
      continue;
    }
    await client.fields.update(field.id, { content_link_enabled: false });
    console.log(`${id}: Content Link off`);
  }
}
