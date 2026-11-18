/*
 * The state of the topic picker. The server uses it for the first render
 * and the browser script for each change, thus both show the same view.
 */

export type FormMode = 'none' | 'auto' | 'on-request';

export interface TopicMeta {
  slug: string;
  /** The title, with no stega: the status text of a screen reader. */
  title: string;
  /** The slug of the parent, when the topic is a subtopic. */
  parentSlug: string | undefined;
  /** The slugs of the children that exist as topics. */
  childSlugs: string[];
  /** The form of the topic, when the topic is a leaf. */
  formMode: FormMode;
  formType: 'support' | 'sales';
  /** The auto-responder that the support action uses. */
  responder: string;
  /** The intro above the form (data-intro): the form and its departments. */
  intro: string;
}

export interface PickerView {
  rootSlug: string | undefined;
  /** The slug of the second select. */
  subSlug: string | undefined;
  /** The root whose second select shows. */
  subtopicsOf: string | undefined;
  leafSlug: string | undefined;
  /** The form that shows, if any. */
  form: 'support' | 'sales' | undefined;
}

/**
 * The topic of a link from the dashboard that has an error ID and no
 * topic. An error ID usually means a bug.
 */
const ERROR_TOPIC = ['technical-support', 'ive-found-a-bug'];

/** True when the URL has an error ID (`?errorId=…`). */
export function hasErrorId(search: string): boolean {
  return Boolean(new URLSearchParams(search).get('errorId'));
}

/**
 * The slugs in `?topics=a/b`. With no topic and an error ID, the slugs of
 * ERROR_TOPIC. When a slug is not a topic, computeView shows no topic.
 */
export function parseTopicSlugs(search: string): string[] {
  const value = new URLSearchParams(search).get('topics');
  if (value) return value.split('/');
  return hasErrorId(search) ? ERROR_TOPIC : [];
}

export function computeView(
  topics: TopicMeta[],
  slugs: string[],
  formRequested: boolean,
): PickerView {
  const bySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const leaf = slugs.length > 0 ? bySlug.get(slugs[slugs.length - 1]!) : undefined;
  // The last slug decides, and its parent in the CMS is the root. Thus a
  // link to a topic that moved to a different group (?topics=old/b, or
  // ?topics=b when b was a root) shows the group that b is in now.
  const parent = leaf?.parentSlug ? bySlug.get(leaf.parentSlug) : undefined;
  const root = parent ?? leaf;
  const rootSlug = root?.slug;

  const showForm =
    leaf !== undefined &&
    (leaf.formMode === 'auto' || (leaf.formMode === 'on-request' && formRequested));

  return {
    rootSlug,
    subSlug: parent ? leaf?.slug : undefined,
    subtopicsOf: root && root.childSlugs.length > 0 ? root.slug : undefined,
    leafSlug: leaf?.slug,
    form: showForm ? leaf.formType : undefined,
  };
}
