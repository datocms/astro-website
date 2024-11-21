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

export function changeTitle(newTitle: string) {
  return editTagContent('title', newTitle);
}

export function changeOgCard(data: OgCardData) {
  const url = ogCardUrl(data);

  return [
    editMetaValue('og:image', url),
    editMetaValue('og:image:width', '1200'),
    editMetaValue('og:image:height', '675'),
    editMetaValue('twitter:image', url),
    editMetaValue('twitter:image:width', '1200'),
    editMetaValue('twitter:image:height', '675'),
  ];
}

export function changeDescription(newDescription: string) {
  return [
    editMetaValue('description', newDescription),
    editMetaValue('twitter:description', newDescription),
    editMetaValue('og:description', newDescription),
  ];
}
