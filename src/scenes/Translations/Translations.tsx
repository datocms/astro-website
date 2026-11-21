import {
  AI_TRANSLATIONS_SEQUENCE,
  InfoAside,
  RecordForm,
  StructuredTextInput,
} from '@datocms/product-scenes';
import type { ReactNode } from 'react';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import styles from './style.module.css';
import {
  ACTIVE_LOCALE,
  DESCRIPTION,
  DONE_MESSAGE,
  FILLS_AT,
  JOBS,
  LOCALES,
  PRODUCT_EN,
  PRODUCT_ICON,
  PRODUCT_IT,
  PRODUCT_TITLE,
  PROJECT_NAME,
  RECORD_INFO,
  SIDEBAR_MODELS,
  SIDEBAR_OTHER_FOLDERS,
  SIZING_CHART,
  SLUG_PREFIX,
  SOURCE_LOCALE,
  TARGET_LOCALES,
  USER_NAME,
} from './story';

// The frame of the chapter "AI translations" of /ai: the product "Rolltop
// pannier 20 L" in the record editor, first on the English tab, then on
// the Italian tab, and the panel AI Translations of the plugin in the
// aside. Read the scene rules in the
// README of @datocms/product-scenes. All the values are fixed, thus the
// markup is the same on each render.
//
// The steps are the ones of AI_TRANSLATIONS_SEQUENCE of the kit (see
// story.ts). The panel is InfoAside.AiTranslations of the kit, and plays
// the steps in its CSS. In the form, an element with `data-from` shows
// from that step on, an element with `data-until` shows until that step:
// the script of Chapter.astro sets `data-on` and `data-off` on them. Without
// the sequence, the screen shows the last step: the still.

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Content', models: SIDEBAR_MODELS, closed: SIDEBAR_OTHER_FOLDERS },
  record: RECORD_INFO,
};

/**
 * A field in the three states of the run: filled in English (`source`)
 * until the click on the Italian tab, empty in Italian until its job ends
 * (`at`), then filled in Italian.
 */
function Translated({
  at,
  source,
  empty,
  children,
}: {
  at: string;
  source: ReactNode;
  empty: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div data-until="rest">{source}</div>
      <div data-from="rest" data-until={at}>
        {empty}
      </div>
      <div className={styles.filled} data-from={at}>
        {children}
      </div>
    </>
  );
}

/** The field Body, with the block Sizing chart between its two paragraphs */
function Body({ locale }: { locale: 'en' | 'it' }) {
  const product = locale === 'en' ? PRODUCT_EN : PRODUCT_IT;
  const chart = SIZING_CHART[locale];

  return (
    <StructuredTextInput>
      <StructuredTextInput.Paragraph>{product.intro}</StructuredTextInput.Paragraph>
      <StructuredTextInput.Block name={SIZING_CHART.name} icon={SIZING_CHART.icon}>
        <RecordForm.Field label="Dimensions" localized>
          <RecordForm.StringInput value={chart.dimensions} />
        </RecordForm.Field>
        <RecordForm.Field label="Care" localized>
          <RecordForm.StringInput value={chart.care} />
        </RecordForm.Field>
      </StructuredTextInput.Block>
      <StructuredTextInput.Paragraph>{product.body}</StructuredTextInput.Paragraph>
    </StructuredTextInput>
  );
}

/**
 * The record editor with the product, and the panel AI Translations after
 * the record info. The scene plays its own sequence
 * (AI_TRANSLATIONS_SEQUENCE): the English tab with its fields filled, the
 * click on the Italian tab, the click on "Translate all fields", the
 * jobs, a few at a time, and the Italian fields that fill when their jobs
 * end. From the first field that fills, the toolbar shows the unsaved
 * changes and the button Save. The still is the end of the run: the
 * fields filled, the message, the unsaved changes.
 */
export function TranslationsScene(options: EditorSceneOptions & { minWidth?: number }) {
  return (
    <EditorScene
      {...options}
      theme="orange"
      story={STORY}
      sequence={AI_TRANSLATIONS_SEQUENCE}
      description={DESCRIPTION}
      panels={
        <InfoAside.AiTranslations
          source={LOCALES[0].label}
          targets={TARGET_LOCALES.map((target) => target.label)}
          jobs={JOBS}
          message={DONE_MESSAGE}
          sequence
        />
      }
    >
      <RecordForm
        title={PRODUCT_TITLE}
        icon={PRODUCT_ICON}
        locales={{ tabs: [...LOCALES], active: ACTIVE_LOCALE, switchFrom: SOURCE_LOCALE }}
        status={RECORD_INFO.status}
        dirty="after-translations"
      >
        <RecordForm.Field label="Name" required localized>
          <Translated
            at={FILLS_AT.name}
            source={<RecordForm.StringInput value={PRODUCT_EN.name} large />}
            empty={<RecordForm.StringInput value="" large />}
          >
            <RecordForm.StringInput value={PRODUCT_IT.name} large />
          </Translated>
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required localized>
          <Translated
            at={FILLS_AT.slug}
            source={<RecordForm.SlugInput prefix={SLUG_PREFIX} value={PRODUCT_EN.slug} />}
            empty={<RecordForm.SlugInput prefix={SLUG_PREFIX} value="" />}
          >
            <RecordForm.SlugInput prefix={SLUG_PREFIX} value={PRODUCT_IT.slug} />
          </Translated>
        </RecordForm.Field>
        <RecordForm.Field label="Body" localized>
          <Translated
            at={FILLS_AT.body}
            source={<Body locale="en" />}
            empty={
              <StructuredTextInput>
                <StructuredTextInput.Paragraph>{''}</StructuredTextInput.Paragraph>
              </StructuredTextInput>
            }
          >
            <Body locale="it" />
          </Translated>
        </RecordForm.Field>
      </RecordForm>
    </EditorScene>
  );
}
