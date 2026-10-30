import {
  InfoAside,
  RecordForm,
  RolePermissions,
  STAGE_MENU_SEQUENCE,
} from '@datocms/product-scenes';
import { EditorScene, type EditorSceneOptions, type EditorStory } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import {
  MEDIA_KIT_ICON,
  PRESS_RELEASE,
  PRESS_RELEASE_ICON,
  PRESS_RELEASE_STAGE,
  PROJECT_NAME,
  RECORD_INFO,
  SCHEDULE,
  SIDEBAR_NEWSROOM_MODELS,
  SIDEBAR_OTHER_FOLDERS,
  USER_NAME,
  WRITER_MEDIA_KIT_RULES,
  WRITER_RULES,
} from './story';

// The scenes of the chapter "Workflows": the press release "Kestrel opens
// its first factory in Portugal" in the record editor, in legal review, and
// the settings and the permissions around its workflow. Read the scene rules in the README of
// @datocms/product-scenes. All the values are fixed, thus the markup is the
// same on each render.

const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Newsroom', models: SIDEBAR_NEWSROOM_MODELS, closed: SIDEBAR_OTHER_FOLDERS },
  record: { ...RECORD_INFO, stage: PRESS_RELEASE_STAGE },
};

/**
 * The record editor with the press release in legal review. In the record
 * info of the aside, the stage opens: the reviewer can send the press
 * release back to an earlier stage, or move it on. The pointer goes on
 * Approved, and its tooltip shows its description. The scene plays
 * STAGE_MENU_SEQUENCE. The aside is 80px wider than in the kit (430px),
 * thus the frame does not cut the stage and its menu.
 */
export function WorkflowsScene(options: EditorSceneOptions) {
  return (
    <EditorScene
      {...options}
      theme="orange"
      story={STORY}
      description={`The record editor of DatoCMS with the press release “${PRESS_RELEASE.title}”: its title, slug, embargo, summary and body. In the record info on the right, the stage of the press release is “${PRESS_RELEASE_STAGE.name}”, and its menu is open with the stages to move it to: ${PRESS_RELEASE_STAGE.moves.map((move) => move.name).join(', ')}. The pointer is on ${PRESS_RELEASE_STAGE.moves[PRESS_RELEASE_STAGE.menu.hovered]!.name}, and a tooltip says “${PRESS_RELEASE_STAGE.moves[PRESS_RELEASE_STAGE.menu.hovered]!.description}”.`}
      sequence={STAGE_MENU_SEQUENCE}
      asideWidth={430}
    >
      <RecordForm title={PRESS_RELEASE.title} icon={PRESS_RELEASE_ICON}>
        <RecordForm.Field label="Title" required>
          <RecordForm.StringInput value={PRESS_RELEASE.title} large />
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required>
          <RecordForm.SlugInput prefix={PRESS_RELEASE.slugPrefix} value={PRESS_RELEASE.slug} />
        </RecordForm.Field>
        <RecordForm.Field label="Embargo until">
          <RecordForm.StringInput value={PRESS_RELEASE.embargo} />
        </RecordForm.Field>
        <RecordForm.Field label="Summary">
          <RecordForm.TextareaInput value={PRESS_RELEASE.summary} rows={2} />
        </RecordForm.Field>
        <RecordForm.Field label="Body" required>
          <RecordForm.TextareaInput value={PRESS_RELEASE.body} rows={4} />
        </RecordForm.Field>
      </RecordForm>
    </EditorScene>
  );
}

/**
 * The record permissions of the role Comms team on the press releases: they
 * edit drafts, send them to the fact check, and cannot approve them
 */
export function WorkflowsRoleScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="orange"
      appearance={appearance}
      description={`The record permissions of a role in DatoCMS, on the model Press releases: can edit if the record is in stage ${WRITER_RULES[0].inStage}, can change stage to ${WRITER_RULES[1].toStage} if the record is in stage ${WRITER_RULES[1].inStage}, cannot change stage to ${WRITER_RULES[2].toStage}. On the model Media kits: can edit, cannot delete.`}
      width={width}
      height={height}
    >
      <RolePermissions>
        <RolePermissions.RuleSet
          emoji={PRESS_RELEASE_ICON}
          title="Press releases"
          apiKey="press_release"
        >
          {WRITER_RULES.map((rule) => (
            <RolePermissions.Rule
              key={`${rule.action}-${'toStage' in rule ? rule.toStage : ''}`}
              {...rule}
            />
          ))}
        </RolePermissions.RuleSet>
        <RolePermissions.RuleSet emoji={MEDIA_KIT_ICON} title="Media kits" apiKey="media_kit">
          {WRITER_MEDIA_KIT_RULES.map((rule) => (
            <RolePermissions.Rule key={`${rule.action}`} {...rule} />
          ))}
        </RolePermissions.RuleSet>
      </RolePermissions>
    </Scene>
  );
}

/**
 * The panel "Publishing schedule" of the press release, open: its
 * publication at the embargo, Monday at nine, for the whole record. The
 * panel "Record info" above it and the panel "Links" under it are closed.
 */
export function WorkflowsScheduleScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="orange"
      appearance={appearance}
      description={`The panel “Publishing schedule” of a record in DatoCMS, under the closed panel “Record info”: a future publication, when ${SCHEDULE.date}, what the whole record. Under it, the button “Add new schedule”.`}
      width={width}
      height={height}
    >
      <InfoAside>
        <InfoAside.Panel title={{ id: 'recordInfo.title' }} closed>
          {null}
        </InfoAside.Panel>
        <InfoAside.PublishingSchedule schedule={SCHEDULE} />
        <InfoAside.Links closed />
      </InfoAside>
    </Scene>
  );
}
