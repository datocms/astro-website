import {
  RecordForm,
  RolePermissions,
  StructuredTextInput,
  VersionCompare,
} from '@datocms/product-scenes';
import { type FragmentSceneProps, Scene, type SceneAppearance } from '../Scene';
import {
  COLLABORATOR,
  COMPARED_METHOD,
  COMPARED_TITLE,
  COMPARED_VERSIONS,
  COOK_RULES,
  RECIPE,
  RECIPE_ICON,
  RECORD_INFO,
  NEXT_SENTENCE,
  SAVED_SENTENCE,
  VIEWER,
} from './story';
import inesImage from './ines.jpg';
import styles from './style.module.css';
import tomImage from './tom.jpg';

// The scenes of the chapter "Collaboration and versions": the recipe
// "Lemon risotto with peas" of Simmer, open on two screens at the same
// time (Pair.astro). Inès Moreau edits it on her screen, and Tom Okafor
// looks at it on his. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is the
// same on each render.

const INES = { ...COLLABORATOR, imageUrl: inesImage.src };
const TOM = { ...VIEWER, imageUrl: tomImage.src };

/** The size of each of the two screens of Pair.astro, in px before the zoom */
export const PAIR_SCREEN = { width: 520, height: 340 } as const;

/**
 * A sentence that a person types, one character in each span. The CSS of
 * style.module.css shows the characters one after the other in the beat
 * `beat` of Pair.astro (`--i` is the index of the character): "type" for
 * Inès, "write" for Tom. Each character keeps its place when it is hidden,
 * thus the text does not move.
 */
function TypedSentence({ text, beat }: { text: string; beat: 'type' | 'write' }) {
  return (
    <span className={styles.typed} data-typed={beat}>
      {Array.from(text).map((character, i) => (
        <span key={i} className={styles.character} style={{ '--i': i } as React.CSSProperties}>
          {character}
        </span>
      ))}
    </span>
  );
}

/**
 * The text of the method, in a box of four lines: the field keeps its
 * height when a sentence comes or goes
 */
function MethodText({ children }: { children: React.ReactNode }) {
  return <span className={styles.method}>{children}</span>;
}

/**
 * The screen of Inès: the form of the recipe, with no sidebar and no
 * aside. She types a sentence at the end of the method and clicks Save.
 * The form has no pointer of the kit: the cursor of Inès is in Pair.astro,
 * in her colour. Thus the form uses `dirty="after-translations"`, the
 * changes with no pointer: the step "rest" shows the saved record, and
 * each other step (the script of Pair.astro sets "dirty") shows the
 * unsaved changes and the button Save. The model has no draft/publish
 * (`draftMode={false}`): her save publishes the record. Tom looks at the
 * record too: his avatar is in her toolbar (`viewers`).
 */
export function CollaborationEditorScene({ appearance }: { appearance?: SceneAppearance }) {
  return (
    <Scene
      theme="green"
      appearance={appearance}
      description={`The record editor of ${COLLABORATOR.name} with the recipe “${RECIPE.title}”. She types “${SAVED_SENTENCE}” at the end of the method and clicks Save.`}
      width={PAIR_SCREEN.width}
      height={PAIR_SCREEN.height}
      fit
    >
      <RecordForm
        title={RECIPE.title}
        icon={RECIPE_ICON}
        status={RECORD_INFO.status}
        draftMode={false}
        dirty="after-translations"
        viewers={[TOM]}
      >
        <RecordForm.Field label="Title" required>
          <RecordForm.StringInput value={RECIPE.title} large />
        </RecordForm.Field>
        <RecordForm.Field label="Method" required>
          <StructuredTextInput>
            <StructuredTextInput.Paragraph>
              <MethodText>
                {RECIPE.method} <TypedSentence text={SAVED_SENTENCE} beat="type" />
              </MethodText>
            </StructuredTextInput.Paragraph>
          </StructuredTextInput>
        </RecordForm.Field>
      </RecordForm>
    </Scene>
  );
}

/**
 * The screen of Tom: the same form, while Inès edits it. The script of
 * Pair.astro sets the steps of COLLABORATION_SEQUENCE of the kit on it:
 * the record is free; Inès opens it, and her avatar says
 * she is looking; she edits, and the lock comes with the fields read only;
 * Tom's click on the title does nothing; she saves, and her sentence
 * shows in the method with a highlight; Tom types a sentence after hers
 * (`TypedSentence`, beat "write"). The fields have no pointer of the
 * kit: the cursor of Tom is in Pair.astro, in his colour.
 */
export function CollaborationViewerScene({ appearance }: { appearance?: SceneAppearance }) {
  return (
    <Scene
      theme="green"
      appearance={appearance}
      description={`The record editor of ${VIEWER.name} with the same recipe. ${COLLABORATOR.name} opens it: her avatar shows in the toolbar. She starts to edit: the note “${COLLABORATOR.name} is editing” shows, and the fields are read only. ${VIEWER.name} clicks the title, and nothing happens. She saves: her sentence shows at the end of the method, and ${VIEWER.name} can edit again: he clicks the end of the method and types “${NEXT_SENTENCE}”.`}
      width={PAIR_SCREEN.width}
      height={PAIR_SCREEN.height}
      fit
    >
      <RecordForm
        title={RECIPE.title}
        icon={RECIPE_ICON}
        status={RECORD_INFO.status}
        draftMode={false}
        collaborator={INES}
      >
        <RecordForm.Field label="Title" required>
          <RecordForm.StringInput value={RECIPE.title} large />
        </RecordForm.Field>
        <RecordForm.Field
          label="Method"
          required
          saved={
            <StructuredTextInput>
              <StructuredTextInput.Paragraph>
                <MethodText>
                  {RECIPE.method} {SAVED_SENTENCE}{' '}
                  <TypedSentence text={NEXT_SENTENCE} beat="write" />
                </MethodText>
              </StructuredTextInput.Paragraph>
            </StructuredTextInput>
          }
        >
          <StructuredTextInput>
            <StructuredTextInput.Paragraph>
              <MethodText>{RECIPE.method}</MethodText>
            </StructuredTextInput.Paragraph>
          </StructuredTextInput>
        </RecordForm.Field>
      </RecordForm>
    </Scene>
  );
}

/**
 * The record permissions of the role Cooks on the recipes: they create in
 * English, edit only their own recipes, move a recipe to In review, and
 * cannot delete
 */
export function CollaborationRoleScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="green"
      appearance={appearance}
      description="The record permissions of a role in DatoCMS, on the model Recipes: can create content in English; can edit if the record was created by the user themself; can move to stage In review; cannot delete."
      width={width}
      height={height}
    >
      <RolePermissions>
        <RolePermissions.RuleSet emoji={RECIPE_ICON} title="Recipes" apiKey="recipe">
          {COOK_RULES.map((rule) => (
            <RolePermissions.Rule key={rule.action} {...rule} />
          ))}
        </RolePermissions.RuleSet>
      </RolePermissions>
    </Scene>
  );
}

/**
 * The page of Tom's version of the recipe, compared with the version
 * before it: only the differences show, the word that he took out of the
 * title and the end of the sentence that he finished in the method
 */
export function CollaborationVersionsScene({
  width,
  height,
  appearance,
  fit,
}: FragmentSceneProps & {
  /** The kit zooms the screen down to its box when the box is narrower (see Stage) */
  fit?: boolean;
}) {
  const { older, newer } = COMPARED_VERSIONS;

  return (
    <Scene
      theme="green"
      appearance={appearance}
      description={`The page of a version of a record in DatoCMS: the version of ${newer.editor}, ${newer.date}, published, beside the version before it, of ${older.editor}, ${older.date}. Only the differences show. Title: “Lemon risotto with fresh peas” becomes “${RECIPE.title}”, the word “fresh” struck through in red. Method: the last sentence ends with “soft.” in the older version, and with “soft and clear, about five minutes.” in the newer, marked in green.`}
      width={width}
      fit={fit}
      height={height}
    >
      <VersionCompare older={{ ...older }} newer={{ ...newer }} onlyDifferences>
        <VersionCompare.TextField
          label="Title"
          large
          older={COMPARED_TITLE.older.map((run) => ({ ...run }))}
          newer={COMPARED_TITLE.newer.map((run) => ({ ...run }))}
        />
        <VersionCompare.StructuredTextField label="Method">
          <VersionCompare.Paragraph
            older={COMPARED_METHOD.older.map((run) => ({ ...run }))}
            newer={COMPARED_METHOD.newer.map((run) => ({ ...run }))}
          />
        </VersionCompare.StructuredTextField>
      </VersionCompare>
    </Scene>
  );
}
