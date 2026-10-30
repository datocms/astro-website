import type { FragmentOf } from '~/lib/datocms/graphql';
import type { ChatCardFragment, PostCardFragment } from './graphql';

export type PostCardItem =
  | { post: FragmentOf<typeof PostCardFragment>; chat?: never }
  | { chat: FragmentOf<typeof ChatCardFragment>; post?: never };
