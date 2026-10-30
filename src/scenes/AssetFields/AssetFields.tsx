import { RecordForm } from '@datocms/product-scenes';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import camels from './camels.jpg';
import camp from './camp.jpg';
import cover from './cover.jpg';
import dunes from './dunes.jpg';
import rock from './rock.jpg';
import stars from './stars.jpg';
import tea from './tea.jpg';
import trailer from './trailer.jpg';
import {
  COVER,
  GALLERY,
  PROJECT_NAME,
  RECORD_INFO,
  SIDEBAR_OTHER_FOLDERS,
  SIDEBAR_TRIP_MODELS,
  TRAILER,
  TRIP,
  TRIP_ICON,
  USER_NAME,
} from './story';

// The scenes of the chapter "Asset fields" of /media: the trip "Wadi Rum
// on foot" in the record editor, with a single asset field, a gallery and
// an external video field. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is
// the same on each render.

const THEME = 'orange';

const PHOTOS = { camels, camp, dunes, rock, stars, tea };

const COVER_IMAGE = { src: cover.src, width: 900, height: 600 };

const GALLERY_IMAGES = GALLERY.map(({ photo, alt }) => ({
  src: PHOTOS[photo].src,
  width: 600,
  height: 400,
  alt,
}));

// YouTube gives a thumbnail of 1280 × 720
const TRAILER_THUMBNAIL = { src: trailer.src, width: 800, height: 450 };

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Trips', models: SIDEBAR_TRIP_MODELS, closed: SIDEBAR_OTHER_FOLDERS },
  record: RECORD_INFO,
};

const GALLERY_LIST = GALLERY.map((image) => image.alt).join(', ');

// With `hovered`, the pointer is on the card: its actions show.
function TrailerField({ hovered = false }: { hovered?: boolean }) {
  return (
    <RecordForm.Field label="Trailer" hint={TRAILER.hint}>
      <RecordForm.VideoInput
        thumbnail={TRAILER_THUMBNAIL}
        title={TRAILER.title}
        hovered={hovered}
      />
    </RecordForm.Field>
  );
}

function TripForm() {
  return (
    <RecordForm title={TRIP.title} icon={TRIP_ICON}>
      <RecordForm.Field label="Title" required>
        <RecordForm.StringInput value={TRIP.title} large />
      </RecordForm.Field>
      <RecordForm.Field label="Cover" required>
        <RecordForm.FileInput image={COVER_IMAGE} caption={COVER.alt} />
      </RecordForm.Field>
      <RecordForm.Field label="Gallery">
        <RecordForm.GalleryInput images={GALLERY_IMAGES} />
      </RecordForm.Field>
      <TrailerField />
    </RecordForm>
  );
}

export function AssetFieldsScene(options: EditorSceneOptions) {
  return (
    <EditorScene
      {...options}
      theme={THEME}
      story={STORY}
      asideWidth={430}
      description={`The record editor of DatoCMS with the trip “${TRIP.title}”. The field Cover holds one photo: ${COVER.alt}. The field Gallery holds six photos in two rows: ${GALLERY_LIST}. The field Trailer holds a YouTube video, with its thumbnail and its title, “${TRAILER.title}”.`}
    >
      <TripForm />
    </EditorScene>
  );
}

export function AssetFieldsTrailerScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The external video field Trailer in DatoCMS: the thumbnail of a YouTube video of the trip, with the buttons Play video, Open video and Remove video on it, its title under it, “${TRAILER.title}”, and the hint of the field: “${TRAILER.hint}”`}
      width={width}
      height={height}
    >
      <RecordForm.Body>
        <TrailerField hovered />
      </RecordForm.Body>
    </Scene>
  );
}
