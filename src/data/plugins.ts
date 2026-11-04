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
  /** The headline of a search: the number of results, these words, then the search text. */
  searchHeadline: { none: 'No plugins for', one: 'plugin for', other: 'plugins for' },
  /** The text in the search box. The hint shows the key that moves the focus to the box. */
  searchPlaceholder: 'Search plugins...',
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

First, make sure the DatoCMS agent skills are installed. They know the
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
};

export const detail = {
  install: 'Install plugin',
  officialBadge: 'DatoCMS Official Plugin',
  officialNote: 'This is an Official DatoCMS Plugin!',
  communityNote: 'Built by the DatoCMS community.',
  noteBody: 'Learn how to create your own plugin, or copy and remix one, in our documentation.',
  noteHref: '/docs/plugin-sdk/introduction',
  noteLink: 'Build a plugin',
  /** The README: the author of the plugin writes it, not us. */
  readme: {
    file: 'README.md',
    /** The author follows. */
    writtenBy: 'Written by',
    notUs: 'not by DatoCMS',
    official: 'Written by DatoCMS',
    expand: 'Read the whole README',
    empty: 'This plugin has no README yet.',
    emptyLinks: 'See the package on npm',
    tocTitle: 'In the README',
    imageLabel: 'Open the image',
    close: 'Close',
  },
  /** The labels of the facts. */
  facts: {
    type: 'Type',
    fieldTypes: 'Works on',
  },
};
