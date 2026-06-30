import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions (frozen snapshot — kept inline so this migration does
// not depend on the mutable generated `src/lib/cma-schema.ts`).
type EnvironmentSettings = {
  locales: 'en';
};

export type InternalVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '810948',
  {
    video: {
      type: 'file';
    };
  }
>;
export const InternalVideo = {
  ID: '810948',
  REF: { type: 'item_type', id: '810948' },
} as const;

export type UserGuidesEpisode = ItemTypeDefinition<
  EnvironmentSettings,
  'bj_G4ihTRk-DvhI3fFazIw',
  {
    video: {
      type: 'file';
    };
  }
>;
export const UserGuidesEpisode = {
  ID: 'bj_G4ihTRk-DvhI3fFazIw',
  REF: { type: 'item_type', id: 'bj_G4ihTRk-DvhI3fFazIw' },
} as const;

/*
 * Drop the now-unused `thumb_time_seconds` field from every model that still
 * carries it. Its values were backfilled into the upload/record `poster_time`
 * by the earlier migrations (setInternalVideoPosterTimes /
 * setUserGuidesEpisodePosterTimes), and nothing in the codebase queries
 * `thumbTimeSeconds` anymore.
 *
 * This is a *destructive* migration (it deletes a field and its data) — there
 * is no automatic rollback if it fails partway through. The per-field lookup
 * makes it idempotent: re-running it after the field is gone is a no-op.
 */

const ITEM_TYPES = [InternalVideo, UserGuidesEpisode];

export default async function (client: Client): Promise<void> {
  for (const itemType of ITEM_TYPES) {
    const fields = await client.fields.list(itemType.REF);
    const field = fields.find((candidate) => candidate.api_key === 'thumb_time_seconds');

    if (!field) {
      console.log(`⏭️  ${itemType.ID}: no thumb_time_seconds field, skipping`);
      continue;
    }

    await client.fields.destroy(field.id);
    console.log(`🗑️  ${itemType.ID}: dropped thumb_time_seconds`);
  }
}
