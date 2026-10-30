import type { Scheme } from '../types/scheme';

const SEARCH_ALIASES: Record<string, string[]> = {
  agriculture: ['farmer', 'farmers', 'kisan', 'ਕਿਸਾਨ', 'ਕਿਸਾਨਾਂ', 'ਖੇਤੀ', 'किसान', 'कृषि', 'खेती'],
  health: ['medical', 'hospital', 'sehat', 'ਸਿਹਤ', 'ਇਲਾਜ', 'ਬੀਮਾ', 'स्वास्थ्य', 'इलाज', 'बीमा'],
  education: ['student', 'scholarship', 'ਵਿਦਿਆਰਥੀ', 'ਵਜ਼ੀਫਾ', 'ਸਿੱਖਿਆ', 'छात्र', 'छात्रवृत्ति', 'शिक्षा'],
  finance: ['loan', 'credit', 'pension', 'subsidy', 'finance', 'ਪੈਨਸ਼ਨ', 'ਕਰਜ਼ਾ', 'ਵਿੱਤੀ', 'पेंशन', 'ऋण', 'वित्त'],
};

function normalizeText(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase().trim();
}

export function matchesSchemeSearch(scheme: Scheme, query: string): boolean {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const searchableText = normalizeText([
    scheme.titleEn,
    scheme.titlePa,
    scheme.titleHi,
    scheme.descriptionEn,
    scheme.descriptionPa,
    scheme.descriptionHi,
    scheme.benefitAmountText,
    scheme.benefitType,
    scheme.departmentEn,
    ...scheme.categoryTags,
    ...(scheme.eligibleOccupations ?? []),
  ].join(' '));

  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  return queryTerms.every((term) => {
    if (searchableText.includes(term)) return true;
    const aliases = Object.values(SEARCH_ALIASES).flatMap((terms) =>
      terms.some((alias) => normalizeText(alias) === term) ? terms : []
    );
    return aliases.some((alias) => searchableText.includes(normalizeText(alias)));
  });
}
