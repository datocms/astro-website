import { ogCardUrl, type OgCardData } from '../ogCardUrl';

type SeoMetaTag = {
  tag: string;
  attributes: Record<string, string> | null;
  content: string | null;
};

type Operation = (tags: SeoMetaTag[]) => SeoMetaTag[];

export function overrideSeo(tags: SeoMetaTag[], ...operations: Array<Operation | Operation[]>) {
  return operations.flat().reduce((acc, operation) => operation(acc), tags);
}

function editTagContent(tagName: string, newContent: string) {
  return (tags: SeoMetaTag[]) =>
    tags.map((tag) => (tag.tag === tagName ? { ...tag, content: newContent } : tag));
}

function editMetaValue(propertyOrName: string, newValue: string) {
  return (tags: SeoMetaTag[]) =>
    tags.map((tag) => {
      if (tag.attributes?.property === propertyOrName || tag.attributes?.name === propertyOrName) {
        return { ...tag, attributes: { ...tag.attributes, content: newValue } };
      }

      return tag;
    });
}

export function replacePageTitle(newTitle: string) {
  return editTagContent('title', newTitle);
}

export function replaceShareTitle(newTitle: string) {
  return [editMetaValue('og:title', newTitle), editMetaValue('twitter:title', newTitle)];
}

export const ogCardWidth = 1200;
export const ogCardHeight = 700;

export function generateCard(baseUrl: URL, data: OgCardData) {
  const url = ogCardUrl(data, baseUrl);

  return [
    editMetaValue('og:image', url),
    editMetaValue('og:image:width', ogCardWidth.toString()),
    editMetaValue('og:image:height', ogCardHeight.toString()),
    editMetaValue('twitter:image', url),
    editMetaValue('twitter:image:width', ogCardWidth.toString()),
    editMetaValue('twitter:image:height', ogCardHeight.toString()),
  ];
}

export function replaceDescription(newDescription: string) {
  return [
    editMetaValue('description', newDescription),
    editMetaValue('twitter:description', newDescription),
    editMetaValue('og:description', newDescription),
  ];
}
