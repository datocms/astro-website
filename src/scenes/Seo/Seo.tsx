import {
  PREVIEW_STACK_SEQUENCE,
  RecordForm,
  SEO_EDIT_SEQUENCE,
  SeoDialog,
  type SeoInputPage,
  SeoPreviewStack,
} from '@datocms/product-scenes';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import favicon from './favicon.svg';
import shareImage from './share.jpg';
import {
  EVENT,
  EVENT_ICON,
  EVENT_URL,
  POST,
  PREVIEWS,
  PROJECT_NAME,
  RECORD_INFO,
  SEO,
  SHARED_AT,
  SIDEBAR_OTHER_FOLDERS,
  SIDEBAR_PROGRAMME_MODELS,
  SITE,
  STACK_CARDS,
  USER_NAME,
} from './story';

// The scenes of the chapter "SEO": the event "Jazz on the pier at sunset"
// in the record editor, with its SEO field filled, and the previews of its
// link on social networks and chat apps. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is the
// same on each render.

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Programme', models: SIDEBAR_PROGRAMME_MODELS, closed: SIDEBAR_OTHER_FOLDERS },
  record: RECORD_INFO,
};

const PAGE: SeoInputPage = {
  url: EVENT_URL,
  siteName: SITE.name,
  title: SEO.title,
  titleSuffix: SITE.titleSuffix,
  description: SEO.description,
  image: { src: shareImage.src, ...SEO.image, alt: SEO.imageAlt },
  favicon: { src: favicon.src, width: 32, height: 32 },
  post: POST,
  time: SHARED_AT.time,
  date: SHARED_AT.date,
};

/**
 * The record editor with the event and its SEO field, with the Google
 * result of the page. The pointer clicks Edit, and the dialog of the field
 * opens over the editor: the title, the description and the share image
 * that the editor writes (SEO_EDIT_SEQUENCE). Without JS and with reduced
 * motion, the dialog is open.
 */
export function SeoScene(options: EditorSceneOptions) {
  return (
    <EditorScene
      {...options}
      theme="purple"
      story={STORY}
      sequence={SEO_EDIT_SEQUENCE}
      description={`The record editor of DatoCMS with the event “${EVENT.title}”. Its SEO field shows the Google result of the page; the pointer clicks Edit, and the dialog “Edit SEO settings” opens over the editor. The dialog has the title “${SEO.title}”, the description “${SEO.description}”, and the share image of the event: the stage on the pier at sunset.`}
      dialog={<SeoDialog page={PAGE} over />}
    >
      <RecordForm title={EVENT.title} icon={EVENT_ICON}>
        <RecordForm.Field label="Title" required>
          <RecordForm.StringInput value={EVENT.title} large />
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required>
          <RecordForm.SlugInput prefix={EVENT.slugPrefix} value={EVENT.slug} />
        </RecordForm.Field>
        <RecordForm.Field label="SEO and social">
          <RecordForm.SeoInput previews={[...PREVIEWS]} current="google" page={PAGE} edit />
        </RecordForm.Field>
      </RecordForm>
    </EditorScene>
  );
}

/**
 * The SEO field of the event three times, in a stack of cards: the link
 * card of the event on Slack, LinkedIn and X. Each card comes to the front
 * in turn (PREVIEW_STACK_SEQUENCE).
 */
export function SeoPreviewsScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="purple"
      appearance={appearance}
      description={`The SEO field of DatoCMS three times, in a stack of cards: each card previews the link to the event “${EVENT.title}” in another place, with its title, description and image. In turn: a message of Slack, a post of LinkedIn, a post of X.`}
      sequence={PREVIEW_STACK_SEQUENCE}
      width={width}
      height={height}
    >
      <SeoPreviewStack previews={[...PREVIEWS]} cards={[...STACK_CARDS]} page={PAGE} />
    </Scene>
  );
}
