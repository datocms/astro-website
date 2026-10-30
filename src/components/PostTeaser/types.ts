import type { FragmentOf } from '~/lib/datocms/graphql';
import type { ChatTeaserFragment, PostTeaserFragment } from './graphql';

export type PostTeaserItem =
  | { post: FragmentOf<typeof PostTeaserFragment>; chat?: never }
  | { chat: FragmentOf<typeof ChatTeaserFragment>; post?: never };
