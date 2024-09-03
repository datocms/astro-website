import striptags from 'striptags';

type SeoAnalysis = {
  keyword: string;
  synonyms: string;
  relatedKeywords: Array<{ keyword: string; synonyms: string }>;
};

function isSeoAnalysis(value: unknown): value is SeoAnalysis {
  return Boolean(value && typeof value === 'object' && 'keyword' in value);
}

function containsKeyword(element: string, keyword: string) {
  const converted = striptags(element);

  return (
    element &&
    keyword &&
    keyword.split(' ').every((w) => converted.toLowerCase().includes(w.toLowerCase()))
  );
}

function allKeywords(seoAnalysis: SeoAnalysis) {
  const { keyword, synonyms, relatedKeywords } = seoAnalysis;

  let allKeywords: string[] = [];

  if (keyword) {
    allKeywords = [keyword];
  }

  if (synonyms) {
    allKeywords = [...allKeywords, ...synonyms.split(', ')];
  }

  if (relatedKeywords) {
    allKeywords = [...allKeywords, ...relatedKeywords.map((k) => k.keyword)];
  }

  return allKeywords;
}

export function containsKeywords(element: string, seoAnalysis: unknown) {
  return (
    isSeoAnalysis(seoAnalysis) &&
    element &&
    allKeywords(seoAnalysis).some((k) => containsKeyword(element, k))
  );
}
