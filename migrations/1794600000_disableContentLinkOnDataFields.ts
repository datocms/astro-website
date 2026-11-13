import { type Client } from 'datocms/lib/cma-client-node';

/*
 * These fields hold data, not text that an editor clicks to change: enum
 * values, URLs, keys, a package name, a prompt for the clipboard. Without
 * Content Link, the CDA sends the value without stega, thus the site can use
 * the value as it is. product_comparison.product is a short name that the
 * typewriter of the hero types. plugin.readme comes from npm.
 */
const fields = [
  'plugin::package_name',
  'plugin::readme',
  'template_demo::github_repo',
  'template_demo::starter_type',
  'doc_callout::callout_type',
  'docs_home_section_block::width',
  'docs_home_section_block::columns',
  'docs_home_doc_card_block::badge',
  'docs_home_external_card_block::badge',
  'docs_home_external_card_block::url',
  'support_topic::contact_form_type',
  'support_topic::auto_responder_type',
  'research_program_page::cta_url',
  'review::website',
  'plugin_sdk_hook_group::group_name',
  'feature_link::link_title',
  'feature_regular_card::emoji',
  'copy_prompt_button_block::prompt',
  'product_comparison::product',
];

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
