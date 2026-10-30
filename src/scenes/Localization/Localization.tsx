import { RecordForm, RolePermissions, SelectivePublishing } from '@datocms/product-scenes';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import productImage from './product.jpg';
import {
  ACTIVE_LOCALE,
  LOCALES,
  MISSING_LOCALES,
  PRODUCT_ICON,
  PRODUCT_IT,
  PRODUCT_SHARED,
  PROJECT_NAME,
  PUBLISH_NON_LOCALIZED,
  PUBLISH_OPTIONS,
  RECORD_INFO,
  SIDEBAR_OTHER_FOLDERS,
  SIDEBAR_SHOP_MODELS,
  TRANSLATOR_LOCALE,
  TRANSLATOR_RULESETS,
  USER_NAME,
} from './story';

// The scenes of the chapter "Localization": the product "Cast-iron skillet,
// 28 cm" in the record editor, in its Italian locale. Read the scene rules
// in the README of @datocms/product-scenes. All the values are fixed, thus
// the markup is the same on each render.

const PHOTO = { src: productImage.src, width: 600, height: 360 };

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Shop', models: SIDEBAR_SHOP_MODELS, closed: SIDEBAR_OTHER_FOLDERS },
  record: RECORD_INFO,
};

// The name, the slug, the description and the care text are localized: the
// care text is empty in Italian. The price, the SKU and the photo are not.
export function LocalizationScene(options: EditorSceneOptions) {
  return (
    <EditorScene
      {...options}
      theme="blue"
      story={STORY}
      description={`The record editor of DatoCMS with the product “${PRODUCT_IT.name}”, in Italian. Tabs under the title switch between English, Italian, German, French, Portuguese and Arabic, and the menu of the locales is open: it lists the six locales, and Spanish, to add. The name, the slug, the description and the care instructions have the locale icon and an Italian value; the care instructions are empty. The price, the SKU and the photo have no icon: one value for every locale.`}
    >
      <RecordForm
        title={PRODUCT_IT.name}
        icon={PRODUCT_ICON}
        locales={{
          tabs: [...LOCALES],
          active: ACTIVE_LOCALE,
          menu: { missing: [...MISSING_LOCALES] },
        }}
      >
        <RecordForm.Field label="Name" required localized>
          <RecordForm.StringInput value={PRODUCT_IT.name} large />
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required localized>
          <RecordForm.SlugInput prefix={PRODUCT_IT.slugPrefix} value={PRODUCT_IT.slug} />
        </RecordForm.Field>
        <RecordForm.Field label="Price (EUR)" required>
          <RecordForm.StringInput value={PRODUCT_SHARED.price} />
        </RecordForm.Field>
        <RecordForm.Field label="SKU" required>
          <RecordForm.StringInput value={PRODUCT_SHARED.sku} />
        </RecordForm.Field>
        <RecordForm.Field label="Description" localized>
          <RecordForm.TextareaInput value={PRODUCT_IT.description} rows={2} />
        </RecordForm.Field>
        <RecordForm.Field label="Care instructions" localized>
          <RecordForm.TextareaInput value={PRODUCT_IT.care} rows={2} />
        </RecordForm.Field>
        <RecordForm.Field label="Photo" required>
          <RecordForm.FileInput image={PHOTO} caption={PRODUCT_SHARED.photoCaption} />
        </RecordForm.Field>
      </RecordForm>
    </EditorScene>
  );
}

export function LocalizationRoleScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="blue"
      appearance={appearance}
      description={`The record permissions of a role in DatoCMS. On the models Products and Categories, two rules each: can view, and can edit content in ${TRANSLATOR_LOCALE}.`}
      width={width}
      height={height}
    >
      <RolePermissions>
        {TRANSLATOR_RULESETS.map((ruleset) => (
          <RolePermissions.RuleSet key={ruleset.apiKey} {...ruleset}>
            <RolePermissions.Rule action="read" />
            <RolePermissions.Rule action="update" locale={TRANSLATOR_LOCALE} />
          </RolePermissions.RuleSet>
        ))}
      </RolePermissions>
    </Scene>
  );
}

export function LocalizationPublishScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="blue"
      appearance={appearance}
      description="The dialog “Only publish specific content” of DatoCMS: 17 locales as buttons (English, Italian, German, French and more), with Italian, French and Greek selected, and the Publish button."
      width={width}
      height={height}
    >
      <SelectivePublishing options={[...PUBLISH_OPTIONS]} nonLocalized={PUBLISH_NON_LOCALIZED} />
    </Scene>
  );
}
