// The fake content of the chapter "Collaboration and versions". The frame
// shows the recipe "Lemon risotto with peas" of Simmer, a recipe site, on
// two screens. Inès Moreau, a cook of Simmer, opens the recipe and types a
// sentence at the end of the method. Tom Okafor, an editor of Simmer, has
// it open too: he sees her avatar and the lock, his click on the title
// does nothing, then her save brings her sentence to his screen. In the
// fragment of the versions, Tom's version is the one that he published
// before. Do not change a text here without a change to the copy
// (src/data/collaboration.ts).

export const VIEWER = { name: 'Tom Okafor' } as const;

export const RECIPE_ICON = '🍲';

export const RECIPE = {
  title: 'Lemon risotto with peas',
  method:
    'Warm the stock in a small pan. Melt the butter in a wide pan, add the shallot and cook it slowly until it is soft and clear, about five minutes.',
} as const;

/**
 * The user that edits the recipe: her screen is at the left of the frame.
 * She has the lock since 10:42. The pill and the toolbar of Tom give her
 * her picture (ines.jpg).
 */
export const COLLABORATOR = {
  name: 'Inès Moreau',
  email: 'ines@simmer.kitchen',
  since: '10:42',
} as const;

export const SAVED_SENTENCE =
  'Stir in the rice and toast it for a minute before the first ladle of stock.';

/**
 * The start of the sentence that Tom types after her save, when the record
 * is free again: only the characters that he types before the end of the
 * fade out (54 characters at 45ms, from 1.1s of the beat "write" to the end
 * of the reset). Thus the hidden characters do not make the field taller.
 */
export const NEXT_SENTENCE = 'Add the peas with the last ladle, and a knob of butter';

/**
 * The record info of the recipe. Its model has no draft/publish: a save
 * publishes the record, thus it is always published. The toolbars show its
 * status.
 */
export const RECORD_INFO = {
  id: 'Rc7Lm2pQX4tNvB8sK1wE9a',
  status: 'published',
  createdAt: '03/02/2026, 09:12',
  updatedAt: 'Today, 09:20',
  createdBy: 'Inès Moreau',
} as const;

/**
 * The record permissions of the role Cooks, a role of the project, in the
 * fragment of the roles. The cooks write the recipes in English, and they
 * edit only the recipes that they created. They move a recipe to review,
 * and they cannot delete a recipe. Inès is a cook.
 */
export const COOK_RULES = [
  { action: 'create', locale: 'English' },
  { action: 'update', createdBy: 'self' },
  { action: 'moveToStage', toStage: 'In review' },
  { positive: false, action: 'delete' },
] as const;

/**
 * The versions that the fragment of the versions compares: Inès's first
 * draft, and Tom's version, which he published. Tom shortened the title and
 * finished the last sentence of the method. The newer texts are the texts
 * of RECIPE.
 */
export const COMPARED_VERSIONS = {
  older: { date: '03/02/2026, 09:12', editor: 'Inès Moreau' },
  newer: { date: '03/04/2026, 16:47', editor: VIEWER.name, published: true },
} as const;

export const COMPARED_TITLE = {
  older: [
    { kind: 'same', value: 'Lemon risotto with ' },
    { kind: 'remove', value: 'fresh ' },
    { kind: 'same', value: 'peas' },
  ],
  newer: [{ kind: 'same', value: 'Lemon risotto with peas' }],
} as const;

export const COMPARED_METHOD = {
  older: [
    {
      kind: 'same',
      value:
        'Warm the stock in a small pan. Melt the butter in a wide pan, add the shallot and cook it slowly until it is ',
    },
    { kind: 'remove', value: 'soft.' },
  ],
  newer: [
    {
      kind: 'same',
      value:
        'Warm the stock in a small pan. Melt the butter in a wide pan, add the shallot and cook it slowly until it is ',
    },
    { kind: 'add', value: 'soft and clear, about five minutes.' },
  ],
} as const;
