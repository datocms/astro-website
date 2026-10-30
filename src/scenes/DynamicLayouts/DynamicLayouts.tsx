import {
  ADD_BLOCK_SEQUENCE,
  DRAG_BLOCK_SEQUENCE,
  ModularContentField,
  RecordForm,
} from '@datocms/product-scenes';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import heroImage from './hero.jpg';
// The preview image of the Feature grid model, from its settings in the
// schema: the block as it shows on the website, three features in a row.
// The SVG has the colours of the dark version of the website in a query
// for the dark scheme. An image follows the scheme of its element, thus the
// image follows the screen, also on a page that changes its scheme.
import featureGridImage from './feature-grid.svg';
import {
  CALL_TO_ACTION,
  CALL_TO_ACTION_FIELDS,
  DRAG_OFFSET,
  FEATURE_GRID,
  FEATURE_GRID_DESCRIPTION,
  HERO,
  LOGO_WALL,
  PAGE_ICON,
  PAGE_SLUG,
  PAGE_SLUG_PREFIX,
  PAGE_TITLE,
  PROJECT_NAME,
  RECORD_INFO,
  TESTIMONIAL,
  SECTION_MODELS,
  SECTIONS,
  SECTIONS_LABEL,
  SIDEBAR_CAMPAIGN_MODELS,
  SIDEBAR_OTHER_FOLDERS,
  USER_NAME,
} from './story';

// The scenes of the chapter "Dynamic layouts": the marketing landing page
// "Plover for agencies" in the record editor, with its Sections field, and a
// fragment of the field with a block in a drag. Read the scene rules in the
// README of @datocms/product-scenes. All the values are fixed, thus the
// markup is the same on each render.

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: {
    folder: 'Campaigns',
    models: SIDEBAR_CAMPAIGN_MODELS,
    closedAbove: SIDEBAR_OTHER_FOLDERS.slice(0, 1),
    closed: SIDEBAR_OTHER_FOLDERS.slice(1),
  },
  record: RECORD_INFO,
};

/**
 * The menu of the open gap: the block models, and the pointer on the
 * Feature grid, thus its card shows the preview and the description that
 * the developer gave it in the schema. The card is centered on the option.
 */
function addMenu() {
  return {
    models: SECTION_MODELS.map(({ name, emoji }) =>
      name === FEATURE_GRID.name
        ? {
            name,
            emoji,
            preview: {
              image: featureGridImage.src,
              description: FEATURE_GRID_DESCRIPTION,
            },
          }
        : { name, emoji },
    ),
    hovered: { index: SECTION_MODELS.indexOf(FEATURE_GRID) },
  };
}

/**
 * The Sections field with its five blocks: the Hero, the Feature grid, the
 * Logo wall and the Testimonial closed, the Call to action open, with its
 * title, its button label and its link. The gap after the third block,
 * between the Logo wall and the Testimonial, is open: its menu lists the
 * five block models, and the pointer is on the Feature grid, with its card.
 */
function SectionsField() {
  return (
    <ModularContentField label={SECTIONS_LABEL} required>
      {SECTIONS.map(({ model, summary }) =>
        model === CALL_TO_ACTION ? (
          <ModularContentField.Block key={model.name} name={model.name} icon={model.emoji}>
            <RecordForm.Field label="Title" required>
              <RecordForm.StringInput value={CALL_TO_ACTION_FIELDS.title} />
            </RecordForm.Field>
            <RecordForm.Field label="Button label" required>
              <RecordForm.StringInput value={CALL_TO_ACTION_FIELDS.button} />
            </RecordForm.Field>
            <RecordForm.Field label="Button link">
              <RecordForm.StringInput value={CALL_TO_ACTION_FIELDS.url} />
            </RecordForm.Field>
          </ModularContentField.Block>
        ) : (
          <ModularContentField.Block
            key={model.name}
            name={model.name}
            icon={model.emoji}
            open={false}
            summary={summary}
            summaryImage={model === HERO ? heroImage.src : undefined}
            addAbove={model === TESTIMONIAL ? addMenu() : undefined}
          />
        ),
      )}
    </ModularContentField>
  );
}

/**
 * The record editor with the landing page: the menu of the models, the
 * title, the slug and the Sections field, and the record info. With
 * `fields="sections"`, the form has only the Sections field: it starts under
 * the header of the record, thus a frame that crops the bottom shows the
 * editor around the field.
 */
export function DynamicLayoutsScene({
  fields = 'all',
  ...options
}: EditorSceneOptions & {
  /**
   * `all`: the title, the slug and the Sections field.
   * `sections`: the Sections field alone.
   * @default 'all'
   */
  fields?: 'all' | 'sections';
}) {
  return (
    <EditorScene
      {...options}
      theme="purple"
      story={STORY}
      description={`The record editor of DatoCMS with the landing page “${PAGE_TITLE}”. Its Sections field holds five blocks, one under the other: Hero, Feature grid, Logo wall and Testimonial, closed, each with its title, and Call to action, open, with its title, button label and link. The editor clicked the space under the Logo wall, and a menu opens there with the five kinds of block that the field accepts. The pointer is on Feature grid: a card shows a picture of the block, three features in a row, and the note “${FEATURE_GRID_DESCRIPTION}”.`}
      sequence={ADD_BLOCK_SEQUENCE}
    >
      <RecordForm title={PAGE_TITLE} icon={PAGE_ICON}>
        {fields === 'all' && (
          <>
            <RecordForm.Field label="Title" required>
              <RecordForm.StringInput value={PAGE_TITLE} large />
            </RecordForm.Field>
            <RecordForm.Field label="Slug" required>
              <RecordForm.SlugInput prefix={PAGE_SLUG_PREFIX} value={PAGE_SLUG} />
            </RecordForm.Field>
          </>
        )}
        <SectionsField />
      </RecordForm>
    </EditorScene>
  );
}

/**
 * The Sections field alone, with the five blocks closed, in a drag: the
 * editor drags the Feature grid block below the Logo wall block. The
 * Feature grid is dim in its place, and its picture is under the pointer,
 * on the top half of the Testimonial block. Thus the cms shows the drop
 * line at the top edge of the Testimonial block, between it and the Logo
 * wall block. The sequence (DRAG_BLOCK_SEQUENCE) drops the block there:
 * the Logo wall goes up, and the Feature grid takes its new place, with
 * the highlight of the cms. Then the editor drags the Logo wall below the
 * Feature grid, thus the blocks come back to their first order and the
 * loop starts again. The still is the first drag.
 */
export function DynamicLayoutsDragScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="purple"
      appearance={appearance}
      description="The Sections field of a landing page in DatoCMS, with five closed blocks: Hero, Feature grid, Logo wall, Testimonial and Call to action. The editor drags the Feature grid block: the block is dim in its place, its picture follows the pointer, and a line between the Logo wall and the Testimonial blocks shows where it goes. In a loop, the editor drops it there, then drags the Logo wall back below it."
      width={width}
      height={height}
      sequence={DRAG_BLOCK_SEQUENCE}
    >
      <RecordForm.Body>
        <ModularContentField label={SECTIONS_LABEL} required>
          {SECTIONS.map(({ model, summary }, index) => (
            <ModularContentField.Block
              key={model.name}
              name={model.name}
              icon={model.emoji}
              open={false}
              summary={summary}
              summaryImage={model === HERO ? heroImage.src : undefined}
              dragged={model === FEATURE_GRID ? DRAG_OFFSET : undefined}
              // The second drag takes the Logo wall back below the Feature grid
              dragBack={model === LOGO_WALL ? DRAG_OFFSET : undefined}
              // The drop line is on the block after the Logo wall
              dropLine={SECTIONS[index - 1]?.model === LOGO_WALL ? 'top' : undefined}
            />
          ))}
        </ModularContentField>
      </RecordForm.Body>
    </Scene>
  );
}

/**
 * The drag of DynamicLayoutsDragScene in a portrait box: the title of the
 * page above the Sections field, and the Call to action open at the end,
 * with its title, its button label and its link. Thus the form fills a
 * box that is higher than it is wide.
 */
export function DynamicLayoutsDragPortraitScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="purple"
      appearance={appearance}
      description={`The landing page “${PAGE_TITLE}” in DatoCMS: its title and its slug, then its Sections field with five blocks. The editor drags the Feature grid block: the block is dim in its place, its picture follows the pointer, and a line between the Logo wall and the Testimonial blocks shows where it goes. In a loop, the editor drops it there, then drags the Logo wall back below it. The last block, Call to action, is open, with its title, button label and link.`}
      width={width}
      height={height}
    >
      <RecordForm.Body>
        <RecordForm.Field label="Title" required>
          <RecordForm.StringInput value={PAGE_TITLE} large />
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required>
          <RecordForm.SlugInput prefix={PAGE_SLUG_PREFIX} value={PAGE_SLUG} />
        </RecordForm.Field>
        <ModularContentField label={SECTIONS_LABEL} required>
          {SECTIONS.map(({ model, summary }, index) =>
            model === CALL_TO_ACTION ? (
              <ModularContentField.Block key={model.name} name={model.name} icon={model.emoji}>
                <RecordForm.Field label="Title" required>
                  <RecordForm.StringInput value={CALL_TO_ACTION_FIELDS.title} />
                </RecordForm.Field>
                <RecordForm.Field label="Button label" required>
                  <RecordForm.StringInput value={CALL_TO_ACTION_FIELDS.button} />
                </RecordForm.Field>
                <RecordForm.Field label="Button link">
                  <RecordForm.StringInput value={CALL_TO_ACTION_FIELDS.url} />
                </RecordForm.Field>
              </ModularContentField.Block>
            ) : (
              <ModularContentField.Block
                key={model.name}
                name={model.name}
                icon={model.emoji}
                open={false}
                summary={summary}
                summaryImage={model === HERO ? heroImage.src : undefined}
                dragged={model === FEATURE_GRID ? DRAG_OFFSET : undefined}
                // The second drag takes the Logo wall back below the Feature grid
                dragBack={model === LOGO_WALL ? DRAG_OFFSET : undefined}
                // The drop line is on the block after the Logo wall
                dropLine={SECTIONS[index - 1]?.model === LOGO_WALL ? 'top' : undefined}
              />
            ),
          )}
        </ModularContentField>
      </RecordForm.Body>
    </Scene>
  );
}
