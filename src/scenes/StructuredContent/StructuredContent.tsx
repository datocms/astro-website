import {
  RECORD_TOOLTIP_SEQUENCE,
  RecordForm,
  SLASH_SEQUENCE,
  type StageSequence,
  StructuredTextInput,
} from '@datocms/product-scenes';
import type { ReactNode } from 'react';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import { Scene, type FragmentSceneProps } from '../Scene';
import {
  BODY,
  type BodyNode,
  type BodySpan,
  COVER_CAPTION,
  GUIDE_ICON,
  GUIDE_SLUG,
  GUIDE_SLUG_PREFIX,
  GUIDE_TITLE,
  PROJECT_NAME,
  GALLERY_STORY,
  RECORD_INFO,
  RECORD_STORY,
  SIDEBAR_GUIDES_MODELS,
  SLASH_MENU_ITEMS,
  SLASH_STORY,
  SIDEBAR_OTHER_FOLDERS,
  USER_NAME,
} from './story';
import coverImage from './cover.jpg';
import galleryImage1 from './gallery-1.jpg';
import galleryImage2 from './gallery-2.jpg';
import galleryImage3 from './gallery-3.jpg';

// The scenes of the feature page "Structured content": the guide "Three
// days in Lisbon on foot" in the record editor, and fragments of its Body
// field. Read the scene rules in the README of @datocms/product-scenes. All
// the values are fixed, thus the markup is the same on each render.

// The photos of Lisbon: the roofs of Alfama for the cover, then
// the sea with a tram, a wall of tiles and the river at dusk for the
// gallery. The kit fits each image in its card, as UploadPreview of the cms.
const COVER = { src: coverImage.src, width: 600, height: 360 };

// Two images have an alt and a title, the third has no metadata: thus the
// gallery shows both captions of the cms.
const GALLERY_IMAGES = [
  {
    image: galleryImage1,
    title: 'Tram 28 on Rua da Conceição',
    alt: 'A yellow tram in a street that goes down to the river',
  },
  {
    image: galleryImage2,
    title: 'Azulejos in Alfama',
    alt: 'A wall of blue tiles next to a green door',
  },
  { image: galleryImage3 },
].map(({ image, ...metadata }) => ({
  src: image.src,
  width: 600,
  height: 450,
  ...metadata,
}));

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Guides', models: SIDEBAR_GUIDES_MODELS, closed: SIDEBAR_OTHER_FOLDERS },
  record: RECORD_INFO,
};

type BodyOptions = {
  collapseBlocks?: boolean;
  hoverRecord?: boolean;
  selectGallery?: boolean;
};

function renderSpan(span: BodySpan, index: number, options: BodyOptions): ReactNode {
  switch (span.kind) {
    case 'text':
      // A text with marks is a leaf of the cms with a class for each mark
      if (span.marks?.length) {
        return (
          <StructuredTextInput.Mark key={index} type={span.marks}>
            {span.text}
          </StructuredTextInput.Mark>
        );
      }
      return span.text;
    case 'link':
      return <StructuredTextInput.Link key={index}>{span.text}</StructuredTextInput.Link>;
    case 'inlineRecord':
      return (
        <StructuredTextInput.InlineRecord
          key={index}
          icon={span.icon}
          status={span.status}
          hovered={options.hoverRecord}
        >
          {span.title}
        </StructuredTextInput.InlineRecord>
      );
  }
}

/**
 * One node of the Body field. A dim node gives the attention to another
 * node: the kit dims it without an element around it, thus the field keeps
 * the margins of the cms.
 */
function renderNode(
  node: BodyNode,
  index: number,
  options: BodyOptions,
  dimmed = false,
): ReactNode {
  switch (node.kind) {
    case 'heading':
      return (
        <StructuredTextInput.Heading key={index} dimmed={dimmed}>
          {node.text}
        </StructuredTextInput.Heading>
      );
    case 'paragraph':
      return (
        <StructuredTextInput.Paragraph key={index} dimmed={dimmed}>
          {node.spans.map((span, spanIndex) => renderSpan(span, spanIndex, options))}
        </StructuredTextInput.Paragraph>
      );
    case 'list':
      return (
        <StructuredTextInput.List key={index} dimmed={dimmed}>
          {node.items.map((spans, itemIndex) => (
            <StructuredTextInput.ListItem key={`item-${itemIndex}`}>
              {spans.map((span, spanIndex) => renderSpan(span, spanIndex, options))}
            </StructuredTextInput.ListItem>
          ))}
        </StructuredTextInput.List>
      );
    case 'quote':
      return (
        <StructuredTextInput.Blockquote key={index} source={node.source} dimmed={dimmed}>
          <StructuredTextInput.Paragraph>
            {node.spans.map((span, spanIndex) => renderSpan(span, spanIndex, options))}
          </StructuredTextInput.Paragraph>
        </StructuredTextInput.Blockquote>
      );
    case 'gallery':
      if (options.collapseBlocks) {
        return (
          <StructuredTextInput.Block
            key={index}
            dimmed={dimmed}
            name={node.name}
            icon={node.icon}
            open={false}
            summary={node.caption}
            summaryImage={GALLERY_IMAGES[0]!.src}
            selected={options.selectGallery}
          />
        );
      }
      return (
        <StructuredTextInput.Block key={index} name={node.name} icon={node.icon} dimmed={dimmed}>
          <RecordForm.Field label="Images">
            <RecordForm.GalleryInput images={GALLERY_IMAGES} />
          </RecordForm.Field>
          <RecordForm.Field label="Caption">
            <RecordForm.StringInput value={node.caption} />
          </RecordForm.Field>
        </StructuredTextInput.Block>
      );
    case 'tip':
      if (options.collapseBlocks) {
        return (
          <StructuredTextInput.Block
            key={index}
            dimmed={dimmed}
            name={node.name}
            icon={node.icon}
            open={false}
            summary={node.text}
          />
        );
      }
      return (
        <StructuredTextInput.Block key={index} name={node.name} icon={node.icon} dimmed={dimmed}>
          <RecordForm.Field label="Text">
            <RecordForm.TextareaInput value={node.text} rows={3} />
          </RecordForm.Field>
        </StructuredTextInput.Block>
      );
  }
}

function BodyField({
  nodes,
  options = {},
  focused = false,
  dimAround,
  bare = false,
}: {
  nodes: BodyNode[];
  options?: BodyOptions;
  /**
   * The editor has the focus: the cms shows the focus border, and the
   * toolbar above the text. A bare input has no toolbar.
   */
  focused?: boolean;
  /**
   * The index of the only node that stays clear. The nodes above and below
   * it are dim.
   */
  dimAround?: number;
  bare?: boolean;
}) {
  const input = (
    <StructuredTextInput
      focused={focused}
      toolbar={focused && !bare ? <StructuredTextInput.Toolbar /> : undefined}
    >
      {nodes.map((node, index) =>
        renderNode(node, index, options, dimAround !== undefined && index !== dimAround),
      )}
    </StructuredTextInput>
  );
  if (bare) return input;
  return (
    <RecordForm.Field label="Body" required>
      {input}
    </RecordForm.Field>
  );
}

const SCENE_HEIGHT = 1520;

// The smallest width of the screen, in px: the toolbar of the Body field
// stays on one line. On a narrower box the kit makes the zoom smaller.
const SCENE_MIN_WIDTH = 1100;

/**
 * The record editor with the guide: the menu of the models, the cover, the
 * title, the slug and the Body field, and the record info. The page crops
 * the top, thus the Body field shows. With `fields="body"`, the form has
 * only the Body field: it starts under the header of the record, thus a
 * frame that crops the bottom shows the editor around the field.
 */
export function StructuredContentScene({
  height = SCENE_HEIGHT,
  fields = 'all',
  focused = false,
  ...options
}: EditorSceneOptions & {
  /**
   * The height of the screen in px. The Body field ends at about 1480px.
   * @default 1520
   */
  height?: number;
  /**
   * `all`: the cover, the title, the slug and the Body field.
   * `body`: the Body field alone.
   * @default 'all'
   */
  fields?: 'all' | 'body';
  focused?: boolean;
}) {
  return (
    <EditorScene
      {...options}
      theme="pink"
      story={STORY}
      description={`The record editor of DatoCMS with the guide “${GUIDE_TITLE}”. Its Body field holds headings, paragraphs with a link and a café record, a gallery block and a tip block.`}
      minWidth={SCENE_MIN_WIDTH}
      height={height}
    >
      <RecordForm title={GUIDE_TITLE} icon={GUIDE_ICON}>
        {fields === 'all' && (
          <>
            <RecordForm.Field label="Cover" required>
              <RecordForm.FileInput image={COVER} caption={COVER_CAPTION} />
            </RecordForm.Field>
            <RecordForm.Field label="Title" required>
              <RecordForm.StringInput value={GUIDE_TITLE} large />
            </RecordForm.Field>
            <RecordForm.Field label="Slug" required>
              <RecordForm.SlugInput prefix={GUIDE_SLUG_PREFIX} value={GUIDE_SLUG} />
            </RecordForm.Field>
          </>
        )}
        <BodyField nodes={BODY} focused={focused} />
      </RecordForm>
    </EditorScene>
  );
}

type StructuredContentFieldSceneProps = Omit<FragmentSceneProps, 'width'> &
  BodyOptions & {
    /**
     * The width of the screen in px. The frame must be at least this wide.
     * Without it, the stage takes the width of the frame (1025px at least,
     * then the kit zooms it) and the field is in the column of the form of
     * the cms, in the center.
     */
    width?: number;
    height: number;
    /**
     * The first node of the Body field to show, from 1 (see BODY in
     * story.ts)
     * @default 1
     */
    from?: number;
    to?: number;
    focused?: boolean;
  };

/**
 * The Body field alone, in the column of the form of the cms, without the
 * columns around it. `from` and `to` select the nodes, thus the page can
 * show one part of the text. With `focused`, the editor shows its toolbar.
 */
export function StructuredContentFieldScene({
  width,
  height,
  from = 1,
  to = BODY.length,
  collapseBlocks,
  hoverRecord,
  focused = false,
  appearance,
}: StructuredContentFieldSceneProps) {
  return (
    <Scene
      theme="pink"
      appearance={appearance}
      description={`The Body field of the guide “${GUIDE_TITLE}” in DatoCMS${focused ? ', with the cursor in it and the formatting toolbar above the text' : ''}: headings, paragraphs with a link and a café record, a gallery block and a tip block.`}
      width={width}
      height={height}
    >
      <RecordForm.Body>
        <BodyField
          nodes={BODY.slice(from - 1, to)}
          options={{ collapseBlocks, hoverRecord }}
          focused={focused}
        />
      </RecordForm.Body>
    </Scene>
  );
}

/**
 * The interaction that a fragment plays in a loop: the slash typed, the
 * pointer on the record. The picture at rest is the last step. The gallery
 * fragment is still.
 */
const FRAGMENT_SEQUENCES: Partial<Record<StructuredContentFragment, StageSequence>> = {
  slash: SLASH_SEQUENCE,
  record: RECORD_TOOLTIP_SEQUENCE,
};

const GALLERY_INDEX = GALLERY_STORY.findIndex((node) => node.kind === 'gallery');

const RECORD_INDEX = RECORD_STORY.findIndex(
  (node) => node.kind === 'paragraph' && node.spans.some((span) => span.kind === 'inlineRecord'),
);

export type StructuredContentFragment = 'slash' | 'gallery' | 'record';

const FRAGMENT_DESCRIPTIONS: Record<StructuredContentFragment, string> = {
  slash: `A Body field in DatoCMS: under the heading “A weekend in Porto”, the editor typed “${SLASH_STORY.slashBefore}/”, and a menu opens under the slash, over the text below. It lists what the editor can add: the Gallery and Tip blocks, a Places record, then paragraph, headings, lists, quote, code and horizontal rule.`,
  gallery:
    'A Body field in DatoCMS: a guide to Sintra with a collapsed Gallery block between two paragraphs. The block is selected and shows its name, the first image and the caption “Pena Palace from the garden”. A quote and more paragraphs follow.',
  record:
    'A Body field in DatoCMS: a guide to Intendente, with a paragraph that links the record “Cervejaria Ramiro” inside the sentence and the tooltip “Edit record” under it, then a list of three dishes.',
};

/**
 * The editor of the Body field alone, without its label, that shows one
 * thing: the slash menu over the text, a collapsed block between two
 * paragraphs, or an inline record with its tooltip. The text around that
 * thing is dim. The editor has the focus, without its toolbar. Each
 * fragment has its own short text (story.ts).
 */
export function StructuredContentFragmentScene({
  fragment,
  width,
  height,
  appearance,
}: FragmentSceneProps & {
  fragment: StructuredContentFragment;
}) {
  let field: ReactNode;
  if (fragment === 'slash') {
    // The slash menu opens only in an editor with the focus. The fragments show
    // no toolbar, thus the menu stands out.
    field = (
      <StructuredTextInput focused>
        {SLASH_STORY.above.map((node, index) => renderNode(node, index, {}, true))}
        <StructuredTextInput.SlashMenu
          before={SLASH_STORY.slashBefore}
          items={SLASH_MENU_ITEMS}
          caret
        />
        {SLASH_STORY.below.map((node, index) =>
          renderNode(node, SLASH_STORY.above.length + 1 + index, {}, true),
        )}
      </StructuredTextInput>
    );
  } else if (fragment === 'gallery') {
    field = (
      <BodyField
        focused
        nodes={GALLERY_STORY}
        options={{ collapseBlocks: true, selectGallery: true }}
        dimAround={GALLERY_INDEX}
        bare
      />
    );
  } else {
    field = (
      <BodyField
        focused
        nodes={RECORD_STORY}
        options={{ hoverRecord: true }}
        dimAround={RECORD_INDEX}
        bare
      />
    );
  }

  return (
    <Scene
      theme="pink"
      appearance={appearance}
      description={FRAGMENT_DESCRIPTIONS[fragment]}
      width={width}
      height={height}
      sequence={FRAGMENT_SEQUENCES[fragment]}
    >
      {field}
    </Scene>
  );
}
