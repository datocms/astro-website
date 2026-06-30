import {
  ApiError,
  type ApiTypes,
  type Client,
  type FileFieldValue,
  mapNormalizedFieldValuesAsync,
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
 * legacy `thumb_time_seconds` field on every `user_guides_episode` record.
 *
 * `user_guides_episode` (model)
 * ├─ video: file                 → references the video upload
 * └─ thumb_time_seconds: integer → seconds used as the player thumbnail time
 *
 * Unlike `internal_video`, the video lives in a *direct* file field on the
 * record (no block traversal), but `poster_time` is resolved the same way:
 *
 *   1. ASSET DEFAULT — the first thumb_time_seconds seen for a given upload is
 *      written to that upload's `default_field_metadata.poster_time`. This is
 *      the non-localized, per-asset default that travels with the asset.
 *
 *   2. RECORD OVERRIDE — when the same upload is reused by other records with a
 *      *different* thumb_time_seconds, that value can't fit the single asset
 *      default, so it is written as a per-record override on the record's
 *      `video` field value (`{ upload_id, …, poster_time }`), exactly like an
 *      alt/title/focal_point override. No record loses its intended frame.
 *
 * Because "first wins" is decided by traversal order, a single in-order pass is
 * enough: the first record to reference an upload sets the default; any later
 * record with a different value is flagged for an override there and then.
 * Writes are collected and flushed at the end.
 */

export default async function (client: Client): Promise<void> {
  const schemaRepository = new SchemaRepository(client);
  const model = await schemaRepository.getItemTypeById(Schema.UserGuidesEpisode.ID);
  const fields = await schemaRepository.getItemTypeFields(model);
  const videoField = fields.find((field) => field.api_key === 'video');
  if (!videoField) throw new Error('user_guides_episode has no `video` field');

  // Asset default = first thumb_time_seconds seen for each upload.
  const posterTimeByUpload = new Map<string, number>();
  // Records needing a per-record poster_time override, collected and flushed at the end.
  const recordUpdates: Array<{
    id: string;
    attributes: ApiTypes.ItemUpdateSchema;
  }> = [];

  // ── Single pass: decide asset defaults and collect record overrides at once.
  for await (const record of client.items.rawListPagedIterator<Schema.UserGuidesEpisode>({
    filter: { type: model.id },
    version: 'current',
  })) {
    // thumb_time_seconds was dropped from the schema by a later migration;
    // this historical script still reads it at runtime.
    const thumb = (record.attributes as { thumb_time_seconds?: number }).thumb_time_seconds;
    if (typeof thumb !== 'number') continue;

    let recordHasOverride = false;

    const updatedVideo = await mapNormalizedFieldValuesAsync<FileFieldValue, FileFieldValue>(
      record.attributes.video,
      videoField,
      async (_locale, video) => {
        const uploadId = video?.upload_id;
        if (!video || !uploadId) return video;

        const assetDefault = posterTimeByUpload.get(uploadId);

        if (assetDefault === undefined) {
          // First occurrence → becomes this asset's default.
          posterTimeByUpload.set(uploadId, thumb);
          return video;
        }

        if (assetDefault !== thumb) {
          // Differs from the asset default → per-record override.
          recordHasOverride = true;
          return { ...video, poster_time: thumb };
        }

        return video;
      },
    );

    if (recordHasOverride) {
      recordUpdates.push({ id: record.id, attributes: { video: updatedVideo } });
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

  console.log(`📌 Writing ${recordUpdates.length} record-level override(s)…`);
  for (const { id, attributes } of recordUpdates) {
    await client.items.update(id, attributes);
  }
}
