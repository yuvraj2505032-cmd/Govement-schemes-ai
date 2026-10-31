import type { Scheme } from '../types/scheme';

const SEARCH_ALIASES: Record<string, string[]> = {
  agriculture: ['farmer', 'farmers', 'kisan', 'kisaan', 'ਕਿਸਾਨ', 'ਕਿਸਾਨਾਂ', 'ਖੇਤੀ', 'खेती', 'किसान', 'कृषि'],
  health: ['medical', 'hospital', 'sehat', 'ਸਿਹਤ', 'इलाज', 'स्वास्थ्य', 'बीमा', 'ਇਲਾਜ', 'ਬੀਮਾ'],
  education: ['student', 'scholarship', 'ਵਿਦਿਆਰਥੀ', 'ਵਜ਼ੀਫਾ', 'ਸਿੱਖਿਆ', 'छात्र', 'छात्रवृत्ति', 'शिक्षा'],
  finance: ['loan', 'credit', 'pension', 'subsidy', 'finance', 'ਪੈਨਸ਼ਨ', 'ਕਰਜ਼ਾ', 'ਵਿੱਤੀ', 'पेंशन', 'ऋण', 'वित्त'],
};

const SCHEME_NAME_ALIASES: Record<string, string[]> = {
  'pm-kisan': ['pmkisan', 'pm kisan', 'pradhan mantri kisan', 'kisan samman nidhi', 'kisaan samman nidhi'],
  'punjab-ashirwad': ['ashirwad', 'ashirvaad', 'shagun', 'punjab shagun'],
  'punjab-old-age-pension': ['old age pension', 'buzurg pension', 'ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ', 'वृद्धावस्था पेंशन'],
  'sarbat-sehat-bima': ['sarbat sehat', 'sehat bima', 'mukh mantri sehat'],
};

const SEARCH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'for', 'in', 'of', 'the', 'to', 'with',
  'about', 'find', 'give', 'me', 'show', 'tell', 'yojana', 'scheme', 'schemes',
  'ਦੀ', 'ਦਾ', 'ਦੇ', 'ਲਈ', 'ਨੂੰ', 'ਵਿੱਚ', 'ਹੈ', 'ਕੀ', 'ਮੈਨੂੰ',
  'का', 'की', 'के', 'लिए', 'में', 'है', 'को', 'योजना', 'योजनाएं', 'योजनाओं',
]);

function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[‐‑‒–—-]+/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value).split(/\s+/).filter(Boolean);
}

function editDistanceAtMostOne(left: string, right: string): boolean {
  if (Math.abs(left.length - right.length) > 1) return false;
  let leftIndex = 0;
  let rightIndex = 0;
  let differences = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    differences += 1;
    if (differences > 1) return false;
    if (left.length > right.length) leftIndex += 1;
    else if (right.length > left.length) rightIndex += 1;
    else {
      leftIndex += 1;
      rightIndex += 1;
    }
  }

  if (leftIndex < left.length || rightIndex < right.length) differences += 1;
  return differences <= 1;
}

export function matchesSchemeSearch(scheme: Scheme, query: string): boolean {
  const queryTerms = tokenize(query).filter(term => !SEARCH_STOP_WORDS.has(term));
  if (queryTerms.length === 0) return true;

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
    scheme.departmentPa,
    scheme.departmentHi,
    ...scheme.categoryTags,
    ...(scheme.eligibleOccupations ?? []),
    ...(SCHEME_NAME_ALIASES[scheme.id] ?? []),
  ].join(' '));
  const searchableTerms = tokenize(searchableText);

  return queryTerms.every(term => {
    if (searchableTerms.some(candidate => candidate.startsWith(term))) return true;

    const aliasTerms = Object.values(SEARCH_ALIASES)
      .filter(aliases => aliases.some(alias => tokenize(alias).includes(term)))
      .flatMap(aliases => aliases.flatMap(tokenize));
    if (aliasTerms.some(alias => searchableTerms.some(candidate => candidate.startsWith(alias)))) return true;

    return term.length >= 4 &&
      searchableTerms.some(candidate => candidate.length >= 4 && editDistanceAtMostOne(term, candidate));
  });
}
