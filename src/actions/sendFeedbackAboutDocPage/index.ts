import { buildClient } from '@datocms/cma-client';
import { defineAction } from 'astro:actions';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import { z } from 'astro:schema';

export default defineAction({
  accept: 'form',
  input: z.object({
    namespace: z.literal('docs'),
    url: z.string(),
    reaction: z.enum(['positive', 'negative']),
    notes: z.string().optional(),
    email: z.string().email().optional(),
  }),
  handler: async ({ url, reaction, notes, email }) => {
    const client = buildClient({ apiToken: DATOCMS_API_TOKEN });

    await client.items.create({
      url,
      positive_reaction: reaction === 'positive',
      notes,
      email,
      item_type: { id: 'dAVknVWrSCuheQ6Da9v0kQ', type: 'item_type' },
    });

    return { success: true };
  },
});
