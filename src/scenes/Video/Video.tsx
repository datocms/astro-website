import { AssetDetail, THUMBNAIL_MARKER_SEQUENCE } from '@datocms/product-scenes';
import { FRAME_GRID, GRID, Library } from '../MediaLibrary/MediaLibrary';
import { type FragmentSceneProps, type SceneAppearance, Scene } from '../Scene';
import { AUDIO_TRACK, COLLECTION, TRACKS, VIDEO } from './story';
// The frame of the thumbnail, at 1:30: hands that sew a fabric with a
// needle (16:9, a photo from Unsplash: scripts/unsplash-photos.mjs)
import frame from './restoring-tide-line.jpg';
// The frame of the player, at 2:40: the same hands smooth the linen and
// pull the thread (edited from the frame at 1:30, see `edited` in PHOTOS)
import laterFrame from './restoring-tide-line-later.jpg';

// The scenes of the chapter "Video API" of /media: the page of the video
// Restoring Tide Line, with the player, the marker of the thumbnail and
// the tracks. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is
// the same on each render.

const THEME = 'purple';

// The video of the player, paused at 2:40, with the marker of its
// thumbnail at 1:30. The card of the marker shows the frame of the
// thumbnail, not the frame of the player.
const PLAYER_VIDEO = {
  src: laterFrame.src,
  width: VIDEO.details.width,
  height: VIDEO.details.height,
  currentTime: VIDEO.playerTime,
  duration: VIDEO.duration,
};

const POSTER = { time: VIDEO.time, src: frame.src, open: true };

const TRACK_LIST = TRACKS.map(({ name }) => name).join(' and ');

// The grid of the media area behind the dialog: the video first, in the
// collection Light and Thread, then the assets of the chapter "Media
// library". The card shows the frame of the thumbnail.
const LIBRARY_GRID = [
  {
    filename: VIDEO.filename,
    src: frame.src,
    width: VIDEO.details.width,
    height: VIDEO.details.height,
  },
  ...GRID,
];

/**
 * The frame: the media area of the museum, and over it the dialog of the
 * video. The player is paused at 2:40; the pointer clicks the marker of
 * the thumbnail and its card opens on the frame at 1:30
 * (THUMBNAIL_MARKER_SEQUENCE). The picture at rest is the card open. The
 * sidebar has the panel of the tracks.
 */
export function VideoScene({
  appearance,
  height = 760,
}: {
  appearance?: SceneAppearance;
  height?: number;
}) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The media library of DatoCMS, and over it a dialog with the video “${VIDEO.title}” of the collection ${COLLECTION}. The player is paused at 2:40 of 4:12, on the hands of a weaver: one smooths the linen, the other pulls a thread. Above the marker at 1:30 on the seek bar, the card of the thumbnail: the hands that sew the linen with a needle, and “Thumbnail at 1:30.00”. In the sidebar, the subtitles ${TRACK_LIST}.`}
      minWidth={1180}
      sequence={THUMBNAIL_MARKER_SEQUENCE}
      height={height}
    >
      <Library assets={LIBRARY_GRID} grid={FRAME_GRID} />
      <AssetDetail
        over
        title={VIDEO.title}
        video={{ ...PLAYER_VIDEO, poster: POSTER }}
        sequence
        previewBox={{ width: 620, height: 460 }}
        details={VIDEO.details}
        asideWidth={340}
      >
        <AssetDetail.Info
          filename={VIDEO.filename}
          id={VIDEO.id}
          url={VIDEO.url}
          collection={COLLECTION}
          createdAt={VIDEO.createdAt}
          updatedAt={VIDEO.updatedAt}
          createdBy={{ name: VIDEO.createdBy }}
          closed
        />
        <AssetDetail.Categorization closed />
        <AssetDetail.Tracks tracks={TRACKS} />
      </AssetDetail>
    </Scene>
  );
}

/**
 * The sidebar of the dialog: the panels of the info and of the
 * categorization closed, as in the frame, and under them the panel of the
 * tracks, with the actions of each track (download and delete) and the
 * buttons that add a track and generate one
 */
export function VideoTracksScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The sidebar of the video “${VIDEO.title}” in DatoCMS: the panels of the info and of the categorization closed, then the subtitles ${TRACK_LIST}, each with its buttons to download and delete it. Under the tracks, the buttons to add a track and to generate subtitles from the audio.`}
      width={width}
      height={height}
    >
      <AssetDetail.Info
        filename={VIDEO.filename}
        id={VIDEO.id}
        url={VIDEO.url}
        collection={COLLECTION}
        createdAt={VIDEO.createdAt}
        updatedAt={VIDEO.updatedAt}
        createdBy={{ name: VIDEO.createdBy }}
        closed
      />
      <AssetDetail.Categorization closed />
      <AssetDetail.Tracks
        tracks={TRACKS.map((track) => ({ ...track, actionsOpen: true }))}
        actions
      />
    </Scene>
  );
}

// The card of the marker is above the marker, with a frame of 288px on
// its longer side. The padding moves the player down and right, to give
// room to a card that goes past the top or the left edge of the player.
// At 1:30 the card goes 46px past the top edge and is in the width of the
// player, thus the top of the card is at the top of the scene.
const CARD_OVERFLOW = { top: 46, left: 0 };

/**
 * The player and the tracks in a portrait box: the player paused at 2:40,
 * with the card of the thumbnail open on the frame at 1:30, and under it
 * the panel of the subtitles, with the buttons that add a track and
 * generate one
 */
export function VideoPortraitScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The player of the video “${VIDEO.title}” in DatoCMS, paused at 2:40. Above the marker at 1:30 on the seek bar, the card of the thumbnail: the hands of the weaver that sew the linen, and “Thumbnail at 1:30.00”. Under the player, the subtitles ${TRACK_LIST}, and the buttons to add a track and to generate subtitles from the audio.`}
      width={width}
      height={height}
    >
      <div style={{ paddingTop: CARD_OVERFLOW.top, paddingLeft: CARD_OVERFLOW.left }}>
        <AssetDetail.Player video={{ ...PLAYER_VIDEO, poster: POSTER }} width={width} />
      </div>
      <AssetDetail.Tracks tracks={TRACKS} actions />
    </Scene>
  );
}

/**
 * The dialog that adds a track, alone: the Italian voice-over as it
 * uploads
 */
export function VideoAudioTrackScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The dialog “Add new track” of the video “${VIDEO.title}” in DatoCMS. The file ${AUDIO_TRACK.file.filename} uploads, at ${AUDIO_TRACK.file.percent}%; the language is ${AUDIO_TRACK.language.name} and the name of the track “${AUDIO_TRACK.trackName}”.`}
      width={width}
      height={height}
    >
      <AssetDetail.AddTrack
        over={false}
        file={AUDIO_TRACK.file}
        language={AUDIO_TRACK.language}
        trackName={AUDIO_TRACK.trackName}
      />
    </Scene>
  );
}
