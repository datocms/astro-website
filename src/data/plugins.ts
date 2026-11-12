/*
 * The plugins pages: the index, the list of all plugins (with its search
 * results) and the page of one plugin. The plugins come from the CMS.
 */

export const hero = {
  headline: 'Plugins',
  intro:
    'New fields, sidebars, pages, and integrations for DatoCMS. Every plugin in the directory is free. Some are ours, many come from the people who use DatoCMS.',
};

export const browse = {
  headline: 'All plugins',
  intro: 'Every plugin in the directory, free to install. Or build your own with the Plugin SDK.',
  /**
   * The list with a filter of the query string: the official plugins only
   * (?official=true), or the newest first (?sort=latest). The headlines are
   * the titles of the same groups on the index.
   */
  views: {
    official: {
      headline: 'DatoCMS Official Plugins',
      intro: 'The plugins that we publish. Free, like every plugin in the directory.',
    },
    latest: {
      headline: 'Just released',
      intro: 'The newest plugins in the directory, the most recent first.',
    },
  },
  /** The headline of a search: the number of results, these words, then the search text in “ ”. */
  searchHeadline: { none: 'No plugins for', one: 'plugin for', other: 'plugins for' },
  /** The text in the search box. The hint shows the key that moves the focus to the box. */
  searchPlaceholder: 'Search plugins…',
  searchShortcut: '/',
  /** The label of the button that empties the search box. */
  searchClear: 'Clear the search',
  /**
   * The text when a search finds no plugin, then the most popular plugins.
   * The SDK link goes to the docs of the Plugin SDK.
   */
  noResults: {
    title: 'No plugin does that yet.',
    face: 'thinking' as const,
    before: 'Try a shorter word, or build the first one: with the ',
    link: 'Plugin SDK',
    href: '/docs/plugin-sdk/introduction',
    after: ', or with your AI agent.',
    /**
     * The prompt of the copy button: the search text follows the first
     * words. The commands come from /docs/agent-skills.
     */
    prompt: (searchText: string) =>
      `Build me a DatoCMS plugin that does this: ${searchText}

First, make sure the DatoCMS Agent Skills are installed. They know the
Plugin SDK. If they are not, install them, or tell me what to run:
- Claude Code: /plugin marketplace add datocms/agent-skills
  then /plugin install datocms@datocms-skills
- Codex: codex plugin marketplace add datocms/agent-skills
  then /plugins → DatoCMS → Install plugin
- Other agents: npx skills add datocms/agent-skills --skill '*'
Full instructions: https://www.datocms.com/docs/agent-skills.md

Then scaffold the plugin, ask me which fields or screens it needs, and
tell me how to add it to my project as a private plugin.`,
    popular: 'Popular in the meantime',
    viewAll: { label: 'Browse them all', href: '/plugins/browse' },
  },
};

export const groups = {
  highlighted: "Editors' Choice",
  popular: 'Most popular',
  official: 'DatoCMS Official Plugins',
  latest: 'Just released',
  /** The link to the full list of a group. The count follows, in brackets. */
  viewAll: 'View all',
};

export const detail = {
  install: 'Install plugin',
  officialBadge: 'DatoCMS Official Plugin',
  /** The card next to the facts: the same for each plugin. */
  noteTitle: 'Want a plugin that isn’t here?',
  noteBody: 'Learn how to create your own plugin, or copy and remix one, in our documentation.',
  noteHref: '/docs/plugin-sdk/introduction',
  noteLink: 'Build a plugin',
  /** The README: the author of the plugin writes it, not us. */
  readme: {
    /** The author follows. */
    writtenBy: 'Written by',
    notUs: 'not by DatoCMS',
    official: 'Written by DatoCMS',
    empty: 'This plugin has no README yet.',
    emptyLinks: 'See the package on npm',
    tocTitle: 'In the README',
  },
  /** The labels of the facts, and the text of their links. */
  facts: {
    publisher: 'Publisher',
    homepage: 'Homepage',
    homepageLink: 'Visit homepage',
    package: 'Package',
    packageLink: 'Visit npm',
    type: 'Type',
    fieldTypes: 'Works on',
    version: 'Current version',
    installs: 'Install count',
    lastUpdate: 'Last update',
  },
};
