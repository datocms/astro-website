type SeoAnalysis = {
  keyword: string;
  synonyms: string;
  relatedKeywords: Array<{ keyword: string; synonyms: string }>;
};

function isSeoAnalysis(value: unknown): value is SeoAnalysis {
  return Boolean(value && typeof value === 'object' && 'keyword' in value);
}

function containsKeyword(text: string | undefined, keyword: string) {
  return (
    text && keyword && keyword.split(' ').every((w) => text.toLowerCase().includes(w.toLowerCase()))
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

export function containsKeywords(text: string | undefined, seoAnalysis: unknown) {
  return (
    isSeoAnalysis(seoAnalysis) &&
    text &&
    allKeywords(seoAnalysis).some((k) => containsKeyword(text, k))
  );
}
