// The fake content of the chapter "SEO". The scenes show the event "Jazz on
// the pier at sunset" of Harbourfest, a summer festival by the sea, with
// its SEO field filled. Do not change a text here without a change to the
// copy and to the snippet (src/data/seo.ts).

export const PROJECT_NAME = 'Harbourfest';

export const USER_NAME = 'Demo User';

export const EVENT_ICON = '🎟️';

export const SIDEBAR_PROGRAMME_MODELS = ['🎟️ Events', '🎤 Artists', '📍 Venues'] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Pages', 'Tickets', 'Legal'] as const;

export const EVENT = {
  title: 'Jazz on the pier at sunset',
  slugPrefix: 'https://harbourfest.org/events/',
  slug: 'jazz-on-the-pier',
} as const;

export const RECORD_INFO = {
  id: 'Hf8Tz4kWQ6pRnC2vJ9sLa3',
  status: 'published',
  createdAt: '03/02/2026, 09:12',
  updatedAt: '03/04/2026, 16:47',
  createdBy: 'Lena Brandt',
} as const;

export const EVENT_URL = `${EVENT.slugPrefix}${EVENT.slug}`;

export const SITE = { name: 'Harbourfest', titleSuffix: ' - Harbourfest' } as const;

export const SEO = {
  title: EVENT.title,
  description:
    'Three bands, one stage on the water, and the last light over the harbour. Saturday 13 June, doors at 7 pm.',
  image: { width: 1200, height: 630 },
  imageAlt: 'The stage on the pier at sunset',
} as const;

export const POST = 'Our sunset jazz night is back on the pier this June. Tickets are out now:';

export const SHARE_IMAGE_URL =
  'https://www.datocms-assets.com/10571/1709546820-jazz-on-the-pier.png';

export const FAVICON_URL =
  'https://www.datocms-assets.com/10571/1709546702-harbourfest-icon.png?h=32&w=32';

/**
 * The previews of the SEO field, in the bar, in the order of the cms. The
 * scene shows Google; the stack of cards shows Slack, LinkedIn and X.
 */
export const PREVIEWS = ['google', 'twitter', 'linkedin', 'slack', 'whatsapp'] as const;
export const STACK_CARDS = ['slack', 'linkedin', 'twitter'] as const;

export const SHARED_AT = { time: '09:41', date: 'Mar 4' } as const;
