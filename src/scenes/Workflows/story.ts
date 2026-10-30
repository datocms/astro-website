// The fake content of the chapter "Workflows". The scene shows one record:
// the press release "Kestrel opens its first factory in Portugal" of
// Kestrel, a maker of city e-bikes, in legal review. Its model has the
// workflow Press review, with five stages. Do not change a text here
// without a change to the copy (src/data/workflows.ts).

export const PROJECT_NAME = 'Kestrel Newsroom';

export const USER_NAME = 'Demo User';

export const PRESS_RELEASE_ICON = '📰';

export const SIDEBAR_NEWSROOM_MODELS = [
  '📰 Press releases',
  '🗂️ Media kits',
  '🎙️ Spokespeople',
] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Products', 'Support', 'Legal'] as const;

export const PRESS_RELEASE = {
  title: 'Kestrel opens its first factory in Portugal',
  slugPrefix: 'https://kestrel.bike/press/',
  slug: 'first-factory-in-portugal',
  embargo: '03/16/2026, 09:00',
  summary:
    'From May, the new site near Aveiro builds 40,000 e-bikes a year for riders in Europe, with 220 new jobs.',
  body: 'AVEIRO, 16 March 2026. Kestrel, the Dutch maker of city e-bikes, today opens its first factory outside the Netherlands. The site runs on solar power and ships to twelve countries by rail.',
} as const;

/**
 * The publication that the press release has scheduled, in the fragment of
 * the schedule: at its embargo, Monday 16 March 2026 at nine
 */
export const SCHEDULE = { date: PRESS_RELEASE.embargo } as const;

export const RECORD_INFO = {
  id: 'Kp3Rx7nVQ2sLmA9dE5tYw1',
  status: 'draft',
  createdAt: '03/02/2026, 09:12',
  updatedAt: '03/04/2026, 16:47',
  createdBy: 'Sofia Almeida',
} as const;

/**
 * The stages of the workflow Press review, in their order, as its settings
 * show them. The emoji at the start of each name makes the stage easy to
 * see in the record info and in the lists.
 */
export const STAGES = [
  { name: '✏️ Draft', apiKey: 'draft', description: 'The comms team writes it' },
  {
    name: '🔍 Fact check',
    apiKey: 'fact_check',
    description: 'The teams check the numbers and the names',
  },
  {
    name: '⚖️ Legal review',
    apiKey: 'legal_review',
    description: 'Legal clears the claims and the quotes',
  },
  { name: '🌍 Translation', apiKey: 'translation', description: 'Each market translates it' },
  { name: '✅ Approved', apiKey: 'approved', description: 'Ready to go out' },
] as const;

const [DRAFT, FACT_CHECK, LEGAL_REVIEW, TRANSLATION, APPROVED] = STAGES;

/**
 * The stage of the press release, and the stages that the reviewer can
 * move it to, in the order of the workflow. The menu is open, with the
 * pointer on Approved: its tooltip shows its description. The tooltip is
 * on the left of the menu, thus a short description keeps it clear of the
 * left edge of the frame on phones.
 */
export const PRESS_RELEASE_STAGE = {
  name: LEGAL_REVIEW.name,
  moves: [DRAFT, FACT_CHECK, TRANSLATION, APPROVED].map(({ name, description }) => ({
    name,
    description,
  })),
  menu: { hovered: 3 },
};

/**
 * The record permissions of the role Comms team on the press releases:
 * they edit drafts and send them to the fact check, and they cannot approve
 * them
 */
export const WRITER_RULES = [
  { action: 'update', inStage: DRAFT.name },
  { action: 'moveToStage', toStage: FACT_CHECK.name, inStage: DRAFT.name },
  { positive: false, action: 'moveToStage', toStage: APPROVED.name },
] as const;

export const MEDIA_KIT_ICON = '🗂️';

/**
 * The record permissions of the role Comms team on the media kits: the model
 * has no workflow, thus they edit the kits in each state, and they cannot
 * delete them
 */
export const WRITER_MEDIA_KIT_RULES = [
  { action: 'update' },
  { positive: false, action: 'delete' },
] as const;
