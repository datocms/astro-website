import { AssetDetail } from '@datocms/product-scenes';
import { type FragmentSceneProps, Scene } from '../Scene';
import { LANGUAGE, PHOTO, VIDEO } from './story';

// The fragments of the chapter "AI in the media library" of /ai: the tags
// of the photo Loaded tourer on the Stelvio, and the dialog that generates
// the captions of the video Fitting a rolltop pannier. The frame is not a
// screen: it is in Pipeline.astro. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is
// the same on each render.

const THEME = 'green';

/**
 * The sidebar of the photo Loaded tourer on the Stelvio, alone: the asset
 * info with only the row of the smart tags, and the tags of the editor in
 * the categorization
 */
export function MediaAiTagsScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The sidebar of the photo “${PHOTO.title}” in DatoCMS. In the asset info, the smart tags ${PHOTO.smartTags.join(', ')}, which the photo got on upload. In the categorization, the tags ${PHOTO.tags.join(' and ')}, which the editor typed.`}
      width={width}
      height={height}
    >
      <AssetDetail.Info
        filename={PHOTO.filename}
        id={PHOTO.id}
        url={PHOTO.url}
        collection="📸 Journal"
        createdAt={PHOTO.createdAt}
        updatedAt={PHOTO.updatedAt}
        createdBy={{ name: PHOTO.createdBy }}
        smartTags={PHOTO.smartTags}
        rows={['smartTags']}
      />
      <AssetDetail.Categorization tags={PHOTO.tags} />
    </Scene>
  );
}

/**
 * The dialog that generates the subtitles of the video Fitting a rolltop
 * pannier, alone, on English
 */
export function MediaAiCaptionsScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The dialog “Generate subtitles from audio” of the video “${VIDEO.title}” in DatoCMS, on ${LANGUAGE.name}. The new track is “${LANGUAGE.name} (generated)”.`}
      width={width}
      height={height}
    >
      <AssetDetail.GenerateSubtitles over={false} language={LANGUAGE} />
    </Scene>
  );
}
