import {
  ContentSidebar,
  type ContentSidebarItem,
  InfoAside,
  type InfoAsideRecordInfoProps,
  NavigationBar,
  type NavigationBarPluginTab,
  RecordEditorLayout,
  type StageSequence,
} from '@datocms/product-scenes';
import type { ReactNode } from 'react';
import type { Theme } from '~/lib/theme';
import { Scene, type SceneAppearance } from './Scene';

/**
 * The cms around the record editor:
 * - `app`: the navigation bar at the top, and the menu of the models open.
 * - `editor`: no navigation bar, thus the screen starts at the toolbar of
 *   the record, and the menu of the models closed: only its rail shows.
 *   The editor, not the cms around it.
 */
export type EditorChrome = 'app' | 'editor';

export type EditorMenu = {
  /** The open folder, at the top. Its first model is the active one. */
  folder: string;
  models: readonly string[];
  closed: readonly string[];
  /** The closed folders above the open folder */
  closedAbove?: readonly string[];
};

export type EditorStory = {
  project: string;
  user: string;
  menu: EditorMenu;
  record: Omit<InfoAsideRecordInfoProps, 'createdBy'> & { createdBy: string };
};

export type EditorSceneOptions = {
  appearance?: SceneAppearance;
  chrome?: EditorChrome;
  /**
   * The height of the screen in px, before the zoom
   * @default 900
   */
  height?: number;
};

const closedFolder = (name: string): ContentSidebarItem => ({
  kind: 'folder',
  id: name.toLowerCase(),
  name,
});

export function sidebarMenu({
  folder,
  models,
  closed,
  closedAbove = [],
}: EditorMenu): ContentSidebarItem[] {
  const id = folder.toLowerCase();
  return [
    ...closedAbove.map(closedFolder),
    {
      kind: 'folder',
      id,
      name: folder,
      open: true,
      items: models.map((name, index) => ({
        kind: 'model' as const,
        id: `${id}-${index}`,
        name,
        active: index === 0,
      })),
    },
    ...closed.map(closedFolder),
  ];
}

/**
 * The record editor of a chapter: the navigation bar, the menu of the
 * models, the form (the children) and the aside with the record info. The
 * panels of the aside under the record info are the publishing schedule
 * and the links, or `panels`.
 */
export function EditorScene({
  theme,
  appearance,
  chrome = 'editor',
  height = 900,
  story,
  panels,
  description,
  sequence,
  minWidth,
  dialog,
  overlay,
  menuClosed = chrome === 'editor',
  pluginTabs,
  asideWidth,
  children,
}: EditorSceneOptions & {
  theme: Theme;
  story: EditorStory;
  panels?: ReactNode;
  description: string;
  sequence?: StageSequence;
  minWidth?: number;
  /** A dialog of the kit with `over`, open over the record editor */
  dialog?: ReactNode;
  /**
   * A layer of the website over all the screen, above the dialog, for
   * example the spotlight of the chapter Plugins
   */
  overlay?: ReactNode;
  /**
   * The menu of the models is closed: only its rail shows. Give it to an
   * `app` scene that needs the width for the form.
   * @default true for `editor`, false for `app`
   */
  menuClosed?: boolean;
  /** The tabs that plugins add to the navigation bar, for `app` */
  pluginTabs?: NavigationBarPluginTab[];
  /**
   * The width of the aside in px
   * @default 350, the width in the kit
   */
  asideWidth?: number;
  children: ReactNode;
}) {
  const { createdBy, ...record } = story.record;
  return (
    <Scene
      theme={theme}
      appearance={appearance}
      description={description}
      sequence={sequence}
      minWidth={minWidth}
      height={height}
    >
      <RecordEditorLayout
        navigationBar={
          chrome === 'app' && (
            <NavigationBar
              user={{ name: story.user }}
              project={{ name: story.project }}
              pluginTabs={pluginTabs}
            />
          )
        }
        sidebar={<ContentSidebar items={sidebarMenu(story.menu)} />}
        collapsed={menuClosed ? { sidebar: true } : undefined}
        asideWidth={asideWidth}
        aside={
          <InfoAside>
            <InfoAside.RecordInfo {...record} createdBy={{ name: createdBy }} />
            {panels ?? (
              <>
                <InfoAside.PublishingSchedule />
                <InfoAside.Links />
              </>
            )}
          </InfoAside>
        }
      >
        {children}
      </RecordEditorLayout>
      {dialog}
      {overlay}
    </Scene>
  );
}
