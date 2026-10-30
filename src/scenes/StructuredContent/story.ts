// The fake content of the feature page "Structured content". All the scenes,
// the copy and the code snippets of the page use these words, thus the
// visitor sees the same record in each picture. Do not change a text here
// without a change to the copy and to the snippets.

export const PROJECT_NAME = 'Terra Guides';

export const USER_NAME = 'Demo User';

export const GUIDE_ICON = '📍';

export const SIDEBAR_GUIDES_MODELS = ['📍 Guides', '☕ Places', '✍️ Authors'] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Magazine', 'Newsletter', 'About', 'Legal'] as const;

export const GUIDE_TITLE = 'Three days in Lisbon on foot';

export const GUIDE_SLUG = 'three-days-in-lisbon-on-foot';

export const GUIDE_SLUG_PREFIX = 'https://terraguides.com/guides/';

export const COVER_CAPTION = 'No metadata set';

export const RECORD_INFO = {
  id: 'Tg3dLsbNfT0oKq7WbYp2Xa',
  status: 'published',
  createdAt: '03/14/2026, 09:12',
  updatedAt: '03/15/2026, 16:40',
  createdBy: 'Ronak Ganatra',
} as const;

// The texts of the Body field, one constant for each part, in the order of
// the field.

export const HEADING_DAY_ONE = 'Day one: Alfama before the crowds';

export const TRAM_PARAGRAPH_BEFORE = 'Start at ';
export const TRAM_STRONG = 'Portas do Sol';
export const TRAM_PARAGRAPH_MIDDLE = ' while the light is still low, then follow ';
export const TRAM_LINK = 'the tram 28 route';
export const TRAM_PARAGRAPH_AFTER = ' downhill. The streets are empty ';
export const TRAM_EMPHASIS = 'until about ten';

export const GALLERY_BLOCK = { name: 'Gallery', icon: '🖼️' } as const;
export const GALLERY_CAPTION = 'Alfama at eight in the morning';

export const CAFE_PARAGRAPH_BEFORE = 'Stop for a bica at ';
/** The record that the paragraph links inline: a record of the model Places */
export const CAFE_RECORD = {
  icon: '☕',
  model: 'Places',
  title: 'Café A Brasileira',
  status: 'published',
} as const;
export const CAFE_PARAGRAPH_AFTER =
  ' before the queue forms. Order at the counter, it is half the price of a table.';

export const TIP_BLOCK = { name: 'Tip', icon: '💡' } as const;
export const TIP_TEXT =
  'Buy the 24-hour transport card at any metro station. It covers trams, funiculars and the Santa Justa lift.';

export type BodyMark = 'strong' | 'emphasis';

export type BodySpan =
  | { kind: 'text'; text: string; marks?: BodyMark[] }
  | { kind: 'link'; text: string }
  | { kind: 'inlineRecord'; icon: string; title: string; status: 'published' };

export type BodyNode =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; spans: BodySpan[] }
  | { kind: 'list'; items: BodySpan[][] }
  | { kind: 'quote'; spans: BodySpan[]; source?: string }
  | { kind: 'gallery'; name: string; icon: string; caption: string }
  | { kind: 'tip'; name: string; icon: string; text: string };

/**
 * The nodes of the Body field, in order. The page numbers them from 1:
 * BODY[0] is node 1.
 */
export const BODY: BodyNode[] = [
  { kind: 'heading', text: HEADING_DAY_ONE },
  {
    kind: 'paragraph',
    spans: [
      { kind: 'text', text: TRAM_PARAGRAPH_BEFORE },
      { kind: 'text', text: TRAM_STRONG, marks: ['strong'] },
      { kind: 'text', text: TRAM_PARAGRAPH_MIDDLE },
      { kind: 'link', text: TRAM_LINK },
      { kind: 'text', text: TRAM_PARAGRAPH_AFTER },
      { kind: 'text', text: TRAM_EMPHASIS, marks: ['emphasis'] },
      { kind: 'text', text: '.' },
    ],
  },
  { kind: 'gallery', ...GALLERY_BLOCK, caption: GALLERY_CAPTION },
  {
    kind: 'paragraph',
    spans: [
      { kind: 'text', text: CAFE_PARAGRAPH_BEFORE },
      {
        kind: 'inlineRecord',
        icon: CAFE_RECORD.icon,
        title: CAFE_RECORD.title,
        status: CAFE_RECORD.status,
      },
      { kind: 'text', text: CAFE_PARAGRAPH_AFTER },
    ],
  },
  { kind: 'tip', ...TIP_BLOCK, text: TIP_TEXT },
];

export type SlashMenuItem = { icon?: string; label: string; group: string };

/**
 * The slash menu of the Body field, as the cms lists it (SlashPanel of the
 * structured text editor): first the blocks of the field, then the models
 * of the inline records, then the formats. The labels are the English
 * texts of the cms, the groups are the kinds of the kit (it gives them the
 * titles of the cms). The Body field allows the headings 2 and 3.
 */
export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  { icon: GALLERY_BLOCK.icon, label: GALLERY_BLOCK.name, group: 'blocks' },
  { icon: TIP_BLOCK.icon, label: TIP_BLOCK.name, group: 'blocks' },
  { icon: CAFE_RECORD.icon, label: CAFE_RECORD.model, group: 'inlineItems' },
  { label: 'Paragraph', group: 'formatting' },
  { label: 'Heading 2', group: 'formatting' },
  { label: 'Heading 3', group: 'formatting' },
  { label: 'Numbered list', group: 'formatting' },
  { label: 'Bulleted list', group: 'formatting' },
  { label: 'Quote', group: 'formatting' },
  { label: 'Code block', group: 'formatting' },
  { label: 'Horizontal rule', group: 'formatting' },
];

// The fragments of the page. Each fragment has a short text of its own, thus
// one thing stands out: the slash menu, the collapsed block or the inline
// record. The frame and the DAST snippet keep the Lisbon guide. Each text
// reads as a real guide: one heading, paragraphs of different lengths, one
// bold word and one italic phrase. The box of a fragment shows the part of
// the text around the one thing (the focus in src/data/structured-content.ts).

const plain = (text: string): BodyNode => ({ kind: 'paragraph', spans: [{ kind: 'text', text }] });

/**
 * The fragment of the slash menu: a heading, then the first paragraph,
 * where the editor typed "Breakfast at /" to add a café (a Places
 * record), then more paragraphs under the menu. The field is taller than
 * the box, thus the menu is on the text and the text goes past the bottom
 * edge.
 */
export const SLASH_STORY: { above: BodyNode[]; slashBefore: string; below: BodyNode[] } = {
  above: [{ kind: 'heading', text: 'A weekend in Porto' }],
  slashBefore: 'Breakfast at ',
  below: [
    {
      kind: 'paragraph',
      spans: [
        {
          kind: 'text',
          text: 'Porto fits in two days if you skip the museums and walk the river on ',
        },
        { kind: 'text', text: 'both banks', marks: ['strong'] },
        {
          kind: 'text',
          text: '. The old town climbs from the Ribeira in stairs and alleys, and the port lodges of Gaia look back at it from the other side. Wear flat shoes: the hills are short, but there are many of them.',
        },
      ],
    },
    plain('On Sunday, take the tram to Foz and eat grilled sardines by the sea.'),
    plain('No cruises.'),
    {
      kind: 'paragraph',
      spans: [
        {
          kind: 'text',
          text: 'The six-bridges boat tour is an hour of the same view. Walk across the upper deck of the Dom Luís I bridge instead, ',
        },
        { kind: 'text', text: 'just before sunset', marks: ['emphasis'] },
        { kind: 'text', text: ', and you get the river, the roofs and the lodges for free.' },
      ],
    },
    plain('São Bento station is on the way back. Look at the tiles in the hall.'),
    plain(
      'Dinner starts late. Few tables fill before nine, so there is time for a last walk along the old walls.',
    ),
    plain('Bring cash for the bakeries.'),
  ],
};

/**
 * The fragment of the collapsed block: a heading and a paragraph, the
 * Gallery block, then paragraphs and a quote. No chip and no link.
 */
export const GALLERY_STORY: BodyNode[] = [
  { kind: 'heading', text: 'Sintra in the fog' },
  {
    kind: 'paragraph',
    spans: [
      {
        kind: 'text',
        text: 'Sintra is best on a grey day. The fog sits on the hill, the palace disappears in it, and comes back ',
      },
      { kind: 'text', text: 'one yellow tower at a time', marks: ['emphasis'] },
      { kind: 'text', text: ' as you climb through the park.' },
    ],
  },
  { kind: 'gallery', ...GALLERY_BLOCK, caption: 'Pena Palace from the garden' },
  plain('Take the bus up and walk down. The path is the best part.'),
  {
    kind: 'quote',
    spans: [{ kind: 'text', text: 'Go up by bus, come down on foot. Nobody walks up twice.' }],
    source: 'A driver of the 434 bus',
  },
  plain('Start early.'),
  {
    kind: 'paragraph',
    spans: [
      {
        kind: 'text',
        text: 'The first bus leaves the station at nine, and by eleven the queue at the gate runs down the hill. The Moorish Castle is on the same ridge and ',
      },
      { kind: 'text', text: 'one ticket', marks: ['strong'] },
      {
        kind: 'text',
        text: ' covers both, but give each a full morning: the walls of the castle are long, and the view from them is the reason to come.',
      },
    ],
  },
  plain('For lunch, order travesseiros at Piriquita, by the station.'),
];

/**
 * The record of the fragment of the inline record: a record of the model
 * Places, thus the chip shows the emoji of Places
 */
export const RAMIRO_RECORD = {
  icon: CAFE_RECORD.icon,
  title: 'Cervejaria Ramiro',
  status: 'published',
} as const;

/**
 * The fragment of the inline record: one record in the running text, a list
 * of three dishes, plain paragraphs. No block.
 */
export const RECORD_STORY: BodyNode[] = [
  { kind: 'heading', text: 'Seafood in Intendente' },
  plain(
    'Ten years ago Intendente was the rough end of the avenue. Now it has good coffee, a square full of children at six, and the oldest seafood hall in Lisbon.',
  ),
  {
    kind: 'paragraph',
    spans: [
      { kind: 'text', text: 'Dinner is at ' },
      { kind: 'inlineRecord', ...RAMIRO_RECORD },
      { kind: 'text', text: ', where the queue on the pavement is part of the evening.' },
    ],
  },
  {
    kind: 'list',
    items: [
      [{ kind: 'text', text: 'The garlic prawns' }],
      [
        { kind: 'text', text: 'Clams ' },
        { kind: 'text', text: 'à Bulhão Pato', marks: ['emphasis'] },
      ],
      [{ kind: 'text', text: 'A prego, the steak sandwich, for dessert' }],
    ],
  },
  plain('No reservations.'),
  {
    kind: 'paragraph',
    spans: [
      {
        kind: 'text',
        text: 'Arrive before eight and the wait is short; after nine it can be an hour. Tables are shared and the waiters are fast, so point at the board if you do not speak Portuguese. The prawns are priced ',
      },
      { kind: 'text', text: 'by weight', marks: ['strong'] },
      { kind: 'text', text: ': a plate for two is about three hundred grams.' },
    ],
  },
  plain('On Monday it is closed. Keep that night for fado in Alfama.'),
];
