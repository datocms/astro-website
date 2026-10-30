import {
  Button,
  ConfigurationMenu,
  InfoAside,
  InfoList,
  NavigationBar,
  PluginList,
  RecordEditorLayout,
  RecordForm,
  StructuredTextInput,
} from '@datocms/product-scenes';
import diagram from '../diagram/style.module.css';
import { EditorScene, type EditorSceneOptions } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import styles from './style.module.css';
import {
  CONDITIONS,
  DESCRIPTION,
  DIFFICULTY,
  type Hook,
  HOOKS,
  INSTALLED,
  LIST_DESCRIPTION,
  MODEL,
  OUTLET,
  PROJECT_NAME,
  RECORD_TITLE,
  SEQUENCE,
  STORY,
  TAB,
  TRAIL,
  USER_NAME,
} from './story';

// The frame of the chapter Plugins of /developers: the trail "Lac Blanc
// loop" in the record editor of Alpine Trails, with each part that the
// private plugin Trail tools adds to the cms. Read the scene rules in the
// README of @datocms/product-scenes. All the values are fixed, thus the
// markup is the same on each render.
//
// Each part of the plugin has a mark: a box around the part, which
// shows nothing, and a tag in the mono font with the name of its hook in
// datocms-plugin-sdk. The tags of the parts do not show (only with
// reduced motion, where the still shows all of them). At each step of SEQUENCE, the script of
// Chapter.astro moves the spotlight to the box of the step: the rest of
// the screen goes dark, as with the Spotlight of the cms, and the hole
// has the ring and the tint of `.change[data-changed]` of the diagrams.
// The tags of the parts go, and the tag of the spotlight tells the hook
// of the step.

/**
 * The smallest width of the screen: the toolbar keeps all its parts on
 * one line, thus the tag of the tab does not go on Publish. On a narrower
 * frame the kit makes the zoom smaller.
 */
const MIN_WIDTH = 1100;

type Place = 'belowStart' | 'belowCenter' | 'belowEnd' | 'aboveStart' | 'aboveEnd';

function Mark({ hook, place }: { hook: Hook; place: Place }) {
  return (
    <span className={styles.ring} data-hook={hook}>
      <span
        className={`${diagram.pill} ${styles.tag}`}
        data-place={place}
        data-phone={HOOKS[hook].phone || undefined}
      >
        {HOOKS[hook].name}
      </span>
    </span>
  );
}

/**
 * The spotlight, over all the screen: a hole with a ring, and a dark
 * layer around it. It shows only during a step of a hook. The script of
 * Chapter.astro gives the hole the box of the part, and the tag the place
 * and the name of the tag of the part.
 */
function Spotlight() {
  return (
    <div className={styles.spotlight} data-spotlight>
      <span className={`${diagram.change} ${styles.hole}`} data-spotlight-hole />
      <span className={`${diagram.pill} ${styles.tag}`} data-spotlight-tag />
    </div>
  );
}

function Boot({ filled }: { filled: boolean }) {
  return (
    <svg className={styles.boot} data-filled={filled || undefined} viewBox="0 0 20 20" aria-hidden>
      <path d="M5 2.5h5.5v6.2l4.6 2.1c1.5.7 2.4 2.1 2.4 3.7V16H2.5v-2.4L4 12V3.5a1 1 0 0 1 1-1Z" />
      <path d="M2.5 17.5h15" />
    </svg>
  );
}

export function PluginsScene(options: EditorSceneOptions) {
  return (
    <div className={styles.root}>
      <EditorScene
        {...options}
        chrome="app"
        menuClosed
        theme="green"
        story={STORY}
        sequence={SEQUENCE}
        minWidth={MIN_WIDTH}
        description={DESCRIPTION}
        overlay={<Spotlight />}
        pluginTabs={[{ ...TAB, mark: <Mark hook="tab" place="belowEnd" /> }]}
        panels={
          <InfoAside.Panel title={CONDITIONS.title}>
            <div className={styles.panel}>
              <InfoList>
                {CONDITIONS.rows.map((row) => (
                  <InfoList.Row key={row.title} title={row.title}>
                    {row.value}
                  </InfoList.Row>
                ))}
              </InfoList>
              <Mark hook="panel" place="belowEnd" />
            </div>
          </InfoAside.Panel>
        }
      >
        <RecordForm
          title={RECORD_TITLE}
          icon={MODEL.split(' ')[0]}
          publishMark={<Mark hook="publish" place="belowEnd" />}
        >
          <RecordForm.Outlet>
            <div className={styles.outlet}>
              <span className={styles.live}>
                {OUTLET.live} <strong>{OUTLET.url}</strong>
              </span>
              {OUTLET.stats.map((stat) => (
                <span key={stat.label} className={styles.stat}>
                  <strong>{stat.value}</strong> {stat.label}
                </span>
              ))}
              <Button label={OUTLET.open} size="milli" tone="ghost" />
            </div>
            <Mark hook="outlet" place="aboveStart" />
          </RecordForm.Outlet>
          <RecordForm.Field label="Name" required>
            <RecordForm.StringInput value={TRAIL.name} large />
          </RecordForm.Field>
          <RecordForm.Field label="Difficulty">
            <RecordForm.PluginInput>
              <div className={styles.difficulty}>
                {Array.from({ length: DIFFICULTY.of }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: the marks are fixed
                  <Boot key={index} filled={index < DIFFICULTY.value} />
                ))}
                <span className={styles.level}>{DIFFICULTY.label}</span>
              </div>
              <Mark hook="field" place="aboveEnd" />
            </RecordForm.PluginInput>
          </RecordForm.Field>
          <RecordForm.Field label="Distance">
            <RecordForm.StringInput value={TRAIL.distance} />
          </RecordForm.Field>
          <RecordForm.Field label="Description">
            <StructuredTextInput>
              {TRAIL.description.map((paragraph) => (
                <StructuredTextInput.Paragraph key={paragraph}>
                  {paragraph}
                </StructuredTextInput.Paragraph>
              ))}
            </StructuredTextInput>
          </RecordForm.Field>
        </RecordForm>
      </EditorScene>
    </div>
  );
}

export function PluginListScene({ appearance, width, height }: FragmentSceneProps) {
  return (
    <Scene
      theme="green"
      appearance={appearance}
      description={LIST_DESCRIPTION}
      width={width}
      height={height}
    >
      <RecordEditorLayout
        navigationBar={
          <NavigationBar
            activeTab="configuration"
            project={{ name: PROJECT_NAME }}
            user={{ name: USER_NAME }}
          />
        }
        sidebar={<ConfigurationMenu />}
        list={<PluginList plugins={INSTALLED.map((plugin) => ({ ...plugin }))} />}
        listWidth={300}
      />
    </Scene>
  );
}
