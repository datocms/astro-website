/*
 * The plugins pages: the index, the list of all plugins (with its search
 * results) and the page of one plugin. The plugins come from the CMS.
 */

export const hero = {
  headline: 'Community Plugins',
  subheadline:
    'Easily expand and customize the capabilities of DatoCMS. Public plugins are free and maintained by us or the community.',
};

export const browse = {
  headline: 'Community Plugins',
  subheadline: 'Easily expand and customize the capabilities of DatoCMS with community plugins',
  /** The headline of a search: the search text follows. */
  searchHeadline: 'Find Plugins:',
  noResults: 'Sorry, no results found!',
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
  communityNote: 'This is a Community Plugin!',
  noteBody:
    'Learn how create your own plugin, or copy and remix existing ones in our documentation',
  noteHref: '/docs/plugin-sdk/introduction',
};
