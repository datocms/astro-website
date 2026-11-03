/** The most avatars in a byline. The "+N" of the names counts all the other people. */
export const maxAvatars = 3;

/**
 * The byline of a card: the first name, and the number of the other people
 * ("Ada" and 2 others show as "Ada +2"). `spoken` is the text for screen
 * readers in place of "+N".
 */
export function shortByline(names: string[]) {
  const others = Math.max(0, names.length - 1);
  return {
    first: names[0] ?? '',
    others,
    spoken: others ? `and ${others} ${others === 1 ? 'other' : 'others'}` : '',
  };
}
