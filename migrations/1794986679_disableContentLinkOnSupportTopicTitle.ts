import { type Client } from 'datocms/lib/cma-client-node';

/*
 * The title of a support topic is the text of an <option> in the selects of
 * /support. Content Link cannot show an overlay on an <option>, thus an
 * editor cannot click the title there. With stega, each title had
 * approximately 480 invisible characters, and the overlay logged a warning
 * for each one. Without Content Link, the CDA sends the title as it is.
 */
const fields = ['support_topic::title'];

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
