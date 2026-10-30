// The fake content of the chapter "Visual editing". The scenes show the
// page of the article "Night trains are back" of Field Notes, a travel
// magazine, on the draft site of the magazine, with the article and its
// author in the cms. Do not change a text here without a change to the
// copy (src/data/visual-editing-chapter.ts).

export const PROJECT_NAME = 'Field Notes';

export const USER_NAME = 'Demo User';

export const ARTICLE_ICON = '📝';

export const MAGAZINE_MODELS = ['📝 Articles', '🧭 Destinations', '✍️ Authors'] as const;

export const ARTICLE = {
  title: 'Night trains are back',
  slugPrefix: 'https://fieldnotes.travel/stories/',
  slug: 'night-trains-are-back',
  destination: 'Vienna to Rome',
  excerpt:
    'Twelve hours, one bunk, and a sunrise over the Apennines. Why sleeper trains came back to Europe, and how to book one.',
} as const;

/**
 * The body of the article, a Markdown field: its blocks in the order of the
 * page. The site shows the first paragraph with a drop cap.
 */
export const BODY = [
  {
    kind: 'paragraph',
    text: 'At nine in the evening the platform in Vienna is full of backpacks, bikes and a few suits. The Nightjet to Rome leaves on time, and the conductor checks the tickets at the door of each sleeping car.',
  },
  {
    kind: 'paragraph',
    text: 'The cabin is small but clever. Three bunks fold down from the wall, a washbasin hides under the table, and a breakfast box waits on each pillow. Somewhere after Villach the lights go off, and the train climbs into the Alps.',
  },
  {
    kind: 'quote',
    text: 'You fall asleep in one country and wake up in another, with the sea on your left.',
  },
  {
    kind: 'paragraph',
    text: 'Ten years ago this trip took two changes and a long night in a seat. Today a dozen countries run sleeper routes again, and the best cabins sell out weeks ahead.',
  },
  { kind: 'heading', text: 'How to book' },
  {
    kind: 'paragraph',
    text: 'Tickets open six months before the date. A couchette costs about the same as a budget flight. A private cabin with a shower costs twice as much, and is worth it once.',
  },
] as const;

export const BODY_MARKDOWN = BODY.map(({ kind, text }) =>
  kind === 'quote' ? `> ${text}` : kind === 'heading' ? `## ${text}` : text,
).join('\n\n');

export const COVER_CAPTION = 'The Nightjet leaves Vienna';

/**
 * The new version of the article, in the fragment of the save: another
 * title, another excerpt and another cover, all about the morning on the
 * coast, thus the reload of the page shows a clear change
 */
export const SAVED_TITLE = 'Wake up to the sea';
export const SAVED_EXCERPT =
  'Board in Vienna after dinner, open the blind on the coast at breakfast. One night on the Nightjet, and the morning is in Italy.';
export const SAVED_COVER_CAPTION = 'Morning on the coast before Rome';

/**
 * The preview link of the article, as the plugin Web Previews shows it in
 * its select: the name that the developer gives to the link, then the URL
 * of the page on the draft site
 */
export const PREVIEW_LINK = {
  label: 'Draft version',
  url: `${ARTICLE.slugPrefix}${ARTICLE.slug}`,
} as const;

export const SITE = {
  name: 'Field Notes',
  nav: ['Stories', 'Destinations', 'Newsletter'],
  /** The link that turns off the draft mode of the site */
  exitDraft: 'Exit draft mode',
  /** The link at the end of the header, before the draft mode */
  subscribe: 'Subscribe',
} as const;

/**
 * The author of the article: a record of the model Authors, that the
 * article links. The site shows the name in the byline. The form has the
 * portrait above the name, thus the cms scrolls to the name as it scrolls
 * to the cover of the article.
 */
export const AUTHOR = {
  name: 'Maya Lindqvist',
  icon: '✍️',
  portraitCaption: 'Maya on the platform in Vienna',
  role: 'Rail correspondent',
  bio: 'Maya writes about slow travel from Vienna. She has slept on eleven night trains this year.',
} as const;

export const BYLINE = { before: 'By ', after: ' – 6 min read' } as const;

/**
 * The status of the article: a draft. After a save, the cms shows the
 * publish button again.
 */
export const ARTICLE_STATUS = 'draft';

/**
 * The records of the page, in the sidebar of the tab Visual before a
 * click: the article, its destination and its author, in the order of the
 * page. The model names are the ones of the sidebar of the cms.
 */
export const PAGE_RECORDS = [
  { title: ARTICLE.destination, model: MAGAZINE_MODELS[1], status: 'published' },
  { title: ARTICLE.title, model: MAGAZINE_MODELS[0], status: ARTICLE_STATUS },
  { title: AUTHOR.name, model: MAGAZINE_MODELS[2], status: 'published' },
] as const;
