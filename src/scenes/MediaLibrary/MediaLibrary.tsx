import {
  AssetDetail,
  MediaArea,
  NavigationBar,
  OPEN_ASSET_FOCAL_POINT_SEQUENCE,
  RecordEditorLayout,
} from '@datocms/product-scenes';
import { type SceneAppearance, type FragmentSceneProps, Scene } from '../Scene';
import catalogueCover from './catalogue-cover.jpg';
import clayVessel from './clay-vessel.jpg';
import embroideryHoop from './embroidery-hoop.jpg';
import indigoVats from './indigo-vats.jpg';
import linenBolts from './linen-bolts.jpg';
import loomRoom from './loom-room.jpg';
import madderDye from './madder-dye.jpg';
import openingNight from './opening-night.jpg';
import {
  ASSET,
  ASSETS,
  COLLECTION,
  COLLECTIONS,
  LINKING_RECORDS,
  LOCALES,
  METADATA,
  PROJECT_NAME,
  SAVED_FILTERS,
  SOURCES,
  USER_NAME,
} from './story';
import textileGallery from './textile-gallery.jpg';
import threadSpools from './thread-spools.jpg';
import tideLine from './tide-line.jpg';
import weaverHands from './weaver-hands.jpg';

// The scenes of the chapter "Media library" of /media: the media area of
// Saltmarsh Museum, and its asset "Vessel with dry grasses". Read the scene
// rules in the README of @datocms/product-scenes. All the values are
// fixed, thus the markup is the same on each render.

const IMAGES = {
  catalogueCover,
  clayVessel,
  embroideryHoop,
  indigoVats,
  linenBolts,
  loomRoom,
  madderDye,
  openingNight,
  textileGallery,
  threadSpools,
  tideLine,
  weaverHands,
};

export const GRID = ASSETS.map(({ filename, image, width, height }) => ({
  filename,
  src: IMAGES[image].src,
  width,
  height,
}));

// The grid of the frame: the pointer clicks the first card, the asset that
// the dialog shows (OPEN_ASSET_FOCAL_POINT_SEQUENCE)
const GRID_CLICKED = GRID.map((asset, index) => ({ ...asset, clicked: index === 0 }));

const THEME = 'pink';

/**
 * The size of the grid in a scene, for the kit: `width` is the width of the
 * grid in the screen, in px (the cms measures it), and `cardWidth` the
 * target width of a card. The cards fill each row, as in the cms.
 */
type GridSize = { width: number; cardWidth: number };

// The grid of the frame, in a screen 1180px wide. The target is the size
// Medium of the cms (250px) on a window 1000px high (scale 0.9): four cards
// in a row.
export const FRAME_GRID: GridSize = { width: 945, cardWidth: 225 };

// The target width of a card in the fragments, in px. The cards are smaller
// than in the cms, thus the box shows more of the grid.
const FRAGMENT_CARD_WIDTH = 120;

/**
 * The media area with the collection Light and Thread, behind the dialog or
 * alone. Without `sources`, the upload button has no menu, thus the toolbar
 * is shorter. `assets` replaces the cards of the grid (the chapter "Video
 * API" puts its video in the collection).
 */
export function Library({
  savedFilters = false,
  navigationBar = true,
  sources = true,
  clicked = false,
  assets,
  grid,
}: {
  savedFilters?: boolean;
  navigationBar?: boolean;
  sources?: boolean;
  clicked?: boolean;
  assets?: { filename: string; src: string; width: number; height: number }[];
  grid: GridSize;
}) {
  return (
    <RecordEditorLayout
      navigationBar={
        navigationBar && (
          <NavigationBar
            activeTab="media"
            project={{ name: PROJECT_NAME }}
            user={{ name: USER_NAME }}
          />
        )
      }
      sidebar={<MediaArea.Sidebar collections={COLLECTIONS} />}
    >
      <MediaArea
        title={COLLECTION}
        count={(assets ?? GRID).length}
        assets={assets ?? (clicked ? GRID_CLICKED : GRID)}
        savedFilters={{
          ...SAVED_FILTERS,
          menu: savedFilters ? {} : undefined,
        }}
        sources={sources ? [...SOURCES] : undefined}
        gridWidth={grid.width}
        cardWidth={grid.cardWidth}
      />
    </RecordEditorLayout>
  );
}

/**
 * The toolbar and the grid of the media area, without the sidebar. The
 * toolbar has no menu of the saved filters, thus the upload button gets the
 * attention.
 */
function Grid({ uploadMenu = false, grid }: { uploadMenu?: boolean; grid: GridSize }) {
  return (
    <MediaArea
      title={COLLECTION}
      count={GRID.length}
      assets={GRID}
      sources={[...SOURCES]}
      uploadMenu={uploadMenu ? { hovered: 0 } : undefined}
      gridWidth={grid.width}
      cardWidth={grid.cardWidth}
    />
  );
}

function Detail({
  over,
  locale,
  localeMenu = false,
  sequence = false,
  previewBox,
}: {
  over: boolean;
  locale: (typeof LOCALES)[number];
  localeMenu?: boolean;
  sequence?: boolean;
  previewBox: { width: number; height: number };
}) {
  const metadata = METADATA[locale as keyof typeof METADATA];

  return (
    <AssetDetail
      over={over}
      title={ASSET.title}
      image={{ src: clayVessel.src, width: ASSET.details.width, height: ASSET.details.height }}
      focalPoint={ASSET.focalPoint}
      previewBox={previewBox}
      sequence={sequence}
      details={ASSET.details}
      asideWidth={440}
    >
      <AssetDetail.Info
        filename={ASSET.filename}
        id={ASSET.id}
        url={ASSET.url}
        collection={COLLECTION}
        createdAt={ASSET.createdAt}
        updatedAt={ASSET.updatedAt}
        createdBy={{ name: ASSET.createdBy }}
        smartTags={[...ASSET.smartTags]}
        closed
      />
      <AssetDetail.DefaultMetadata
        locales={LOCALES}
        locale={locale}
        menu={localeMenu}
        title={metadata.title}
        alt={metadata.alt}
      />
      <AssetDetail.Categorization
        author={ASSET.categorization.author}
        copyright={ASSET.categorization.copyright}
        tags={[...ASSET.categorization.tags]}
      />
    </AssetDetail>
  );
}

/**
 * The frame: the media area of the museum, the collection Light and Thread
 * in the grid. The pointer clicks the card of Vessel with dry grasses, and
 * its dialog opens over the grid. The asset has no focal point: the pointer
 * clicks the vase, and the previews of the crops go from the center to the
 * vase (OPEN_ASSET_FOCAL_POINT_SEQUENCE). The picture at rest is the
 * dialog: the focal point on the vase, the default metadata in English, the
 * tags.
 * With `detail={false}` the scene is the first step only: the grid, with
 * no dialog and no sequence (the home Features).
 */
export function MediaLibraryScene({
  appearance,
  height = 760,
  detail = true,
}: {
  appearance?: SceneAppearance;
  height?: number;
  detail?: boolean;
}) {
  const library = `The media library of DatoCMS for ${PROJECT_NAME}: the tree of the collections, with ${COLLECTION} open under Exhibitions › 2026, and its grid of ${GRID.length} assets.`;

  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={
        detail
          ? `${library} Over the grid, a dialog shows the asset “${ASSET.title}”: the image with its focal point on the vase, and the sidebar with its default title and alternate text in English, its author, its copyright and its tags.`
          : library
      }
      sequence={detail ? OPEN_ASSET_FOCAL_POINT_SEQUENCE : undefined}
      minWidth={1180}
      height={height}
    >
      <Library clicked={detail} grid={FRAME_GRID} />
      {detail && <Detail over sequence locale="English" previewBox={{ width: 620, height: 460 }} />}
    </Scene>
  );
}

/**
 * The panel Default metadata alone, with the menu of the language open and
 * Italian active: the default title and alternate text in Italian
 */
export function MediaLibraryLocaleScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The default metadata of the asset “${ASSET.title}” in DatoCMS. The menu of the language is open on Italian, with English above it. The title is “${METADATA.Italian.title}” and the alternate text “${METADATA.Italian.alt}”.`}
      width={width}
      height={height}
    >
      <AssetDetail.DefaultMetadata
        locales={LOCALES}
        locale="Italian"
        menu
        title={METADATA.Italian.title}
        alt={METADATA.Italian.alt}
      />
    </Scene>
  );
}

/**
 * The media area without the dialog: the tree of the collections, and the
 * menu of the saved filters open, with Press kit 2026 active
 */
export function MediaLibraryCollectionsScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The media library of DatoCMS. In the sidebar, the collections Exhibitions › 2025, 2026 › ${COLLECTION}, Press and Objects; ${COLLECTION} is active. In the toolbar the menu of the saved filters is open: no filter, the shared filters ${SAVED_FILTERS.shared.join(', ')}, with ${SAVED_FILTERS.active} active, and the personal filter ${SAVED_FILTERS.personal.join(', ')}.`}
      width={width}
      height={height}
    >
      <Library
        savedFilters
        navigationBar={false}
        sources={false}
        grid={{ width: 645, cardWidth: FRAGMENT_CARD_WIDTH }}
      />
    </Scene>
  );
}

/**
 * The panel Records using this asset alone: the records that link the
 * asset, each with its model, its image and its status
 */
export function MediaLibraryLinksScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The records that use the asset “${ASSET.title}” in DatoCMS: ${LINKING_RECORDS.map(({ title, model }) => `${title} (${model.slice(model.indexOf(' ') + 1)})`).join(', ')}.`}
      width={width}
      height={height}
    >
      <AssetDetail.LinksToItems
        records={LINKING_RECORDS.map((record) => ({ ...record, image: IMAGES[record.image].src }))}
      />
    </Scene>
  );
}

/**
 * The toolbar and the grid of the media area, with the menu of the upload
 * button open: the asset sources of the plugins, Museum archive under the
 * pointer
 */
export function MediaLibrarySourcesScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The media library of DatoCMS with the menu of the button “Upload new assets” open: the sources that plugins add, ${SOURCES.map(({ name }) => name).join(' and ')}. The pointer is on ${SOURCES[0].name}, the archive of the museum.`}
      width={width}
      height={height}
    >
      {/* The grid is 14px narrower than the screen. The cards are wider than in the other fragments, thus each card shows all its filename. */}
      <Grid uploadMenu grid={{ width: width - 14, cardWidth: 150 }} />
    </Scene>
  );
}
