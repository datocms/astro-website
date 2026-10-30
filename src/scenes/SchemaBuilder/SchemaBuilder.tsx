import {
  FIELD_EDITOR_SEQUENCE,
  FieldSettings,
  ModelPage,
  NavigationBar,
  RecordEditorLayout,
  SchemaSidebar,
  type SchemaSidebarItem,
} from '@datocms/product-scenes';
import { type SceneAppearance, Scene } from '../Scene';
import {
  CARE_INSTRUCTIONS_FIELD,
  CARE_INSTRUCTIONS_HINT,
  PRODUCT_FIELDS,
  PRODUCTS_MODEL,
  PROJECT_NAME,
  SCHEMA_FOLDER,
  SCHEMA_MODELS,
  USER_NAME,
} from './story';

// The scenes of the chapter "Schema builder" of /developers: the schema of
// Northlight. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is the
// same on each render.

const SCHEMA_SIDEBAR: SchemaSidebarItem[] = [
  ...SCHEMA_MODELS.map((model): SchemaSidebarItem => ({
    kind: 'model',
    id: model.apiKey,
    ...model,
    active: model.apiKey === 'product',
  })),
  {
    kind: 'folder',
    id: 'shop',
    name: SCHEMA_FOLDER.name,
    open: true,
    items: SCHEMA_FOLDER.models.map((model) => ({ kind: 'model', id: model.apiKey, ...model })),
  },
];

const SCHEMA_DESCRIPTION = `The Schema tab of DatoCMS for the project ${PROJECT_NAME}: the models in the sidebar (${SCHEMA_MODELS.map((model) => model.name.replace(/^\p{Extended_Pictographic}\S* /u, '')).join(', ')}, and Pages in the folder ${SCHEMA_FOLDER.name}), and the fields of ${PRODUCTS_MODEL.name}: ${PRODUCT_FIELDS.map((field) => field.label).join(', ')}.`;

/**
 * The frame: the tab Schema of Northlight, the models in the sidebar and
 * the fields of Products. The pointer clicks Care instructions, a text
 * field: its dialog opens on Settings, the pointer clicks Presentation (the
 * help text, and the Markdown editor with its toolbar buttons), then the
 * button Change of the editor (FIELD_EDITOR_SEQUENCE).
 * The picture at rest is the menu of the editors, open: Markdown editor,
 * the current editor, HTML editor and Simple textarea.
 * With `settings={false}` the scene is the first step only: the fields of
 * Products, with no dialog and no sequence (the home Features).
 */
export function SchemaBuilderScene({
  appearance,
  height = 720,
  settings = true,
}: {
  appearance?: SceneAppearance;
  height?: number;
  /** The dialog of Care instructions and the sequence that opens it */
  settings?: boolean;
}) {
  return (
    <Scene
      theme="orange"
      appearance={appearance}
      description={
        settings
          ? `${SCHEMA_DESCRIPTION} The settings of the field ${CARE_INSTRUCTIONS_FIELD.label}, a text field, are open on the tab Presentation: the help text “${CARE_INSTRUCTIONS_HINT}”, then the field editor Markdown editor with its toolbar buttons, and its menu open on the three editors of a text field: Markdown editor, HTML editor and Simple textarea.`
          : SCHEMA_DESCRIPTION
      }
      sequence={settings ? FIELD_EDITOR_SEQUENCE : undefined}
      height={height}
    >
      <RecordEditorLayout
        navigationBar={
          <NavigationBar
            activeTab="schema"
            project={{ name: PROJECT_NAME }}
            user={{ name: USER_NAME }}
          />
        }
        sidebar={<SchemaSidebar items={SCHEMA_SIDEBAR} />}
        sidebarWidth={360}
      >
        <ModelPage
          model={PRODUCTS_MODEL.name}
          emoji={PRODUCTS_MODEL.emoji}
          fields={PRODUCT_FIELDS}
          clicked={settings ? CARE_INSTRUCTIONS_FIELD.apiKey : undefined}
        />
      </RecordEditorLayout>
      {settings && (
        <FieldSettings
          type="text"
          {...CARE_INSTRUCTIONS_FIELD}
          hint={CARE_INSTRUCTIONS_HINT}
          over
        />
      )}
    </Scene>
  );
}
