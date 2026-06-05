import { Client } from 'datocms/lib/cma-client-node';

async function appendBlock(client: Client, fieldId: string, blockId: string) {
  const field = await client.fields.find(fieldId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = field.validators as any;
  const existing: string[] = v?.structured_text_blocks?.item_types ?? [];
  await client.fields.update(fieldId, {
    validators: {
      ...field.validators,
      structured_text_blocks: { item_types: [...existing, blockId] },
    } as any,
  });
}

export default async function (client: Client): Promise<void> {
  const block = await client.itemTypes.create({
    name: '💬 Copy Prompt Button',
    api_key: 'copy_prompt_button_block',
    modular_block: true,
  });

  await client.fields.create(block, {
    label: 'Prompt',
    api_key: 'prompt',
    field_type: 'text',
    appearance: {
      editor: 'markdown',
      parameters: {},
      addons: [],
    },
    validators: {
      required: {},
    },
  });

  // doc_page.content
  await appendBlock(client, '3805570', block.id);
  // changelog_entry.content
  await appendBlock(client, '3805484', block.id);
  // blog_post.content
  await appendBlock(client, '3805490', block.id);
}
