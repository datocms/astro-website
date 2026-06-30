import {
  ApiError,
  type ApiTypes,
  type Client,
  buildBlockRecord,
  isItemWithOptionalMeta,
  mapBlocksInNonLocalizedFieldValue,
  mapNormalizedFieldValuesAsync,
  type RawApiTypes,
  SchemaRepository,
} from 'datocms/lib/cma-client-node';
import * as Schema from '../src/lib/cma-schema';

/**
 * True when the API rejected a write because a `poster_time` value exceeds the
 * video's duration. Some legacy `thumb_time_seconds` values point past the end
 * of their (since-replaced or shorter) video; those can't be stored verbatim.
 */
function isPosterTimeTooLargeError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    Boolean(
      error.findError(
        'INVALID_FIELD',
        (details) => typeof details.field === 'string' && details.field.endsWith('poster_time'),
      ),
    )
  );
}

/*
 * Backfill the new `poster_time` (the video analogue of `focal_point`) from the
 * legacy per-block `thumb_time_seconds` field on every `internal_video` block.
 *
 * `internal_video` (block)
 * ├─ video: file                 → references the video upload
 * └─ thumb_time_seconds: integer → seconds used as the player thumbnail time
 *
 * `poster_time` lives in two places, resolved in a single traversal:
 *
 *   1. ASSET DEFAULT — the first thumb_time_seconds seen for a given upload is
 *      written to that upload's `default_field_metadata.poster_time`. This is
 *      the non-localized, per-asset default that travels with the asset.
 *
 *   2. RECORD OVERRIDE — when the same upload is embedded by other blocks with
 *      a *different* thumb_time_seconds, that value can't fit the single asset
 *      default, so it is written as a per-record override on the block's
 *      `video` field value (`{ upload_id, …, poster_time }`), exactly like an
 *      alt/title/focal_point override. No block loses its intended frame.
 *
 * Because "first wins" is decided by traversal order, a single in-order pass is
 * enough: the first block to reference an upload sets the default; any later
 * block with a different value is flagged for an override there and then. Writes
 * are collected and flushed at the end.
 */

export default async function (client: Client): Promise<void> {
  const schemaRepository = new SchemaRepository(client);
  const internalVideoModel = await schemaRepository.getItemTypeById(Schema.InternalVideo.ID);

  // Only scan models that can (directly or transitively) embed the block.
  const modelsEmbedding = await schemaRepository.getModelsEmbeddingBlocks([internalVideoModel]);

  // Asset default = first thumb_time_seconds seen for each upload.
  const posterTimeByUpload = new Map<string, number>();
  // Records needing a per-block poster_time override, collected and flushed at the end.
  const recordUpdates: Array<{
    id: string;
    attributes: ApiTypes.ItemUpdateSchema;
  }> = [];
  let overriddenBlocks = 0;

  // ── Single pass: decide asset defaults and collect record overrides at once.
  for (const model of modelsEmbedding) {
    const fields = await schemaRepository.getItemTypeFields(model);

    for await (const record of client.items.rawListPagedIterator({
      filter: { type: model.id },
      version: 'current',
      nested: true,
    })) {
      const updatedAttributes: ApiTypes.ItemUpdateSchema = {};

      for (const field of fields) {
        const fieldValue = record.attributes[field.api_key];
        let fieldHasChanges = false;

        const updatedFieldValue = await mapNormalizedFieldValuesAsync(
          fieldValue,
          field,
          async (_locale, normalizedFieldValue) =>
            mapBlocksInNonLocalizedFieldValue(
              normalizedFieldValue,
              field.field_type,
              schemaRepository,
              (block) => {
                if (!isItemWithOptionalMeta(block)) return block;
                if (block.__itemTypeId !== Schema.InternalVideo.ID) {
                  return block.id;
                }

                const ivBlock = block as RawApiTypes.ItemInNestedResponse<Schema.InternalVideo>;
                // thumb_time_seconds was dropped from the schema by a later
                // migration; this historical script still reads it at runtime.
                const thumb = (ivBlock.attributes as { thumb_time_seconds?: number })
                  .thumb_time_seconds;
                const video = ivBlock.attributes.video;
                const uploadId = video?.upload_id;

                if (video && uploadId && typeof thumb === 'number') {
                  const assetDefault = posterTimeByUpload.get(uploadId);

                  if (assetDefault === undefined) {
                    // First occurrence → becomes this asset's default.
                    posterTimeByUpload.set(uploadId, thumb);
                  } else if (assetDefault !== thumb) {
                    // Differs from the asset default → per-record override.
                    fieldHasChanges = true;
                    overriddenBlocks++;
                    return buildBlockRecord<Schema.InternalVideo>({
                      id: ivBlock.id,
                      video: { ...video, poster_time: thumb },
                    });
                  }
                }

                return block.id;
              },
            ),
        );

        if (fieldHasChanges) {
          updatedAttributes[field.api_key] = updatedFieldValue;
        }
      }

      if (Object.keys(updatedAttributes).length > 0) {
        recordUpdates.push({ id: record.id, attributes: updatedAttributes });
      }
    }
  }

  // ── Flush writes.
  console.log(`🎬 Setting asset-level poster_time on ${posterTimeByUpload.size} upload(s)…`);
  for (const [uploadId, posterTime] of posterTimeByUpload) {
    try {
      await client.uploads.update(uploadId, {
        default_field_metadata: { poster_time: posterTime },
      });
    } catch (error) {
      if (!isPosterTimeTooLargeError(error)) throw error;

      // poster_time is past the end of the video → pin a near-final frame.
      // upload.duration is rounded to whole seconds, so back off by 1s to stay
      // safely within the real (sub-second) duration.
      const { duration } = await client.uploads.find(uploadId);
      if (typeof duration !== 'number') {
        console.warn(
          `⚠️  upload ${uploadId}: poster_time ${posterTime}s exceeds the video duration and no duration is available — leaving the player default`,
        );
        continue;
      }
      const clamped = Math.max(0, duration - 1);
      await client.uploads.update(uploadId, {
        default_field_metadata: { poster_time: clamped },
      });
      console.warn(
        `⚠️  upload ${uploadId}: poster_time ${posterTime}s exceeds duration ${duration}s — clamped to ${clamped}s`,
      );
    }
  }

  console.log(
    `📌 Writing ${overriddenBlocks} record-level override(s) across ${recordUpdates.length} record(s)…`,
  );
  for (const { id, attributes } of recordUpdates) {
    await client.items.update(id, attributes);
  }
}
