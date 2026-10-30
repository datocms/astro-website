/*
 * The fake data of the Plugins chapter of /developers: the project Alpine
 * Trails (a site of hikes, alpinetrails.app), the trail "Lac Blanc loop"
 * in its record editor, and the private plugin Trail tools of the
 * project. Each part of the plugin has the name of its hook in
 * datocms-plugin-sdk on a tag. The copy of the chapter is in
 * src/data/developers-pillar.ts.
 */

import type { EditorStory } from '../editor';

export const PROJECT_NAME = 'Alpine Trails';

export const USER_NAME = 'Demo User';

export const PLUGIN_NAME = 'Trail tools';

export const MODEL = '🥾 Trails';
export const RECORD_TITLE = 'Lac Blanc loop';

export const TRAIL = {
  name: RECORD_TITLE,
  distance: '10.4 km',
  description: [
    'A loop from La Flégère to the lake under the Aiguilles Rouges, with the Mont Blanc in front of you all the way up.',
    'The path is wide to the Lac de la Flégère, then it climbs on rock steps and two short ladders. In June the last part can have snow: check the conditions before you go.',
  ],
} as const;

/**
 * The field Difficulty: the editor of the plugin (renderFieldExtension),
 * five boot marks. The value is 3 of 5.
 */
export const DIFFICULTY = { value: 3, of: 5, label: 'Moderate' } as const;

/** The outlet above the fields (renderItemFormOutlet): the live page and two stats */
export const OUTLET = {
  live: 'Live at',
  url: 'alpinetrails.app/lac-blanc',
  stats: [
    { value: '1,284', label: 'views, 7 days' },
    { value: '312', label: 'GPX downloads' },
  ],
  open: 'Open',
} as const;

/** The panel in the aside (renderItemFormSidebarPanel) */
export const CONDITIONS = {
  title: 'Trail conditions',
  rows: [
    { title: 'Status', value: 'Open' },
    { title: 'Snow', value: 'Above 2,300 m' },
    { title: 'Updated', value: '06:40' },
  ],
} as const;

/** The page of the plugin in the navigation bar (mainNavigationTabs), after Media */
export const TAB = {
  key: 'reports',
  label: 'Reports',
  icon: 'chart-column',
  after: 'media',
} as const;

/**
 * The hooks, in the order of the steps. Each step moves the spotlight to
 * the part of its hook; the rest step shows no tag and no spotlight. On
 * phones only the tags of `phone` show.
 */
export const HOOKS = {
  tab: { name: 'mainNavigationTabs', phone: true },
  publish: { name: 'onBeforeItemsPublish', phone: true },
  outlet: { name: 'renderItemFormOutlet', phone: false },
  field: { name: 'renderFieldExtension', phone: true },
  panel: { name: 'renderItemFormSidebarPanel', phone: false },
} as const;

export type Hook = keyof typeof HOOKS;

/**
 * The sequence: first the rest (the editor with no tag, as at load), then
 * one step for each hook. The rest is the last step too, thus it is the
 * still.
 */
export const SEQUENCE = {
  steps: [
    { name: 'rest', ms: 1600 },
    ...(Object.keys(HOOKS) as Hook[]).map((name) => ({ name, ms: 1600 })),
    { name: 'rest', ms: 800 },
  ],
} as const;

/** The plugins of the project in the tab Configuration (the second fragment). The list sorts them by name, as the cms. */
export const INSTALLED = [
  { name: PLUGIN_NAME, private: true },
  { name: 'Web Previews' },
  { name: 'AI Translations' },
  { name: 'SEO/Readability Analysis' },
] as const;

/** The models of the project, in the menu of the models (closed in the frame: only its rail shows) */
const MENU_MODELS = [MODEL, '📍 Huts', '🗺️ Regions'] as const;

export const STORY: EditorStory = {
  project: PROJECT_NAME,
  user: USER_NAME,
  menu: { folder: 'Content', models: MENU_MODELS, closed: ['Pages'] },
  record: {
    id: 'Tq81LbWnK2vHe6RxZa3sPc',
    status: 'published',
    createdAt: '05/12/2026, 09:20',
    updatedAt: '06/18/2026, 06:42',
    createdBy: USER_NAME,
  },
};

export const DESCRIPTION = `The record editor of DatoCMS on the trail “${RECORD_TITLE}” of the project ${PROJECT_NAME}, with the parts of the private plugin ${PLUGIN_NAME}, each with the name of its hook: the tab ${TAB.label} in the navigation bar (mainNavigationTabs); the button Publish (onBeforeItemsPublish); a strip above the fields, “${OUTLET.live} ${OUTLET.url}”, ${OUTLET.stats.map((stat) => `${stat.value} ${stat.label}`).join(', ')} and a button ${OUTLET.open} (renderItemFormOutlet); the field Difficulty with ${DIFFICULTY.value} boot marks of ${DIFFICULTY.of}, “${DIFFICULTY.label}” (renderFieldExtension); and the panel ${CONDITIONS.title} in the aside, ${CONDITIONS.rows.map((row) => `${row.title} ${row.value}`).join(', ')} (renderItemFormSidebarPanel). One part after the other gets the spotlight: the rest of the screen goes dark, and the part has a ring and the name of its hook.`;

export const LIST_DESCRIPTION = `The tab Configuration of DatoCMS for the project ${PROJECT_NAME}: the menu of the environment configuration with Plugins open, and the plugins of the project: AI Translations, SEO/Readability Analysis, ${PLUGIN_NAME} with the pill Private, and Web Previews, with the button Browse plugins.`;
