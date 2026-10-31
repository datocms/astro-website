/*
 * The state of the topic picker. The server uses it for the first render
 * and the browser script for each change, thus both show the same view.
 */

export type FormMode = 'none' | 'auto' | 'on-request';

export interface TopicMeta {
  slug: string;
  /** The slugs of the children that exist as topics. */
  childSlugs: string[];
  /** The form of the topic, when the topic is a leaf. */
  formMode: FormMode;
  formType: 'support' | 'sales';
  /** The auto-responder that the support action uses. */
  responder: string;
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

/** The slugs in `?topics=a/b`. */
export function parseTopicSlugs(search: string): string[] {
  const value = new URLSearchParams(search).get('topics');
  return value ? value.split('/') : [];
}

export function computeView(
  topics: TopicMeta[],
  slugs: string[],
  formRequested: boolean,
): PickerView {
  const bySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const rootSlug = slugs[0];
  const root = rootSlug ? bySlug.get(rootSlug) : undefined;
  const leaf = slugs.length > 0 ? bySlug.get(slugs[slugs.length - 1]!) : undefined;

  const showForm =
    leaf !== undefined &&
    (leaf.formMode === 'auto' || (leaf.formMode === 'on-request' && formRequested));

  return {
    rootSlug,
    subSlug: slugs[1],
    subtopicsOf: root && root.childSlugs.length > 0 ? root.slug : undefined,
    leafSlug: leaf?.slug,
    form: showForm ? leaf.formType : undefined,
  };
}
