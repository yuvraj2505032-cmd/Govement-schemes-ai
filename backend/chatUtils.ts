import type { AssistantAppAction } from '../shared/types/backend.js';

const NAVIGATION_TABS = new Set([
  'dashboard',
  'profile',
  'wizard',
  'saved',
  'insights',
  'family',
  'video-guides',
  'scanner',
  'whatif',
  'districts',
  'deadlines',
  'tracker'
]);
const FILTER_CATEGORIES = new Set(['all', 'Agriculture', 'Health', 'Education', 'Finance']);
const LANGUAGE_NAMES: Record<string, string> = {
  as: 'Assamese',
  bn: 'Bengali',
  doi: 'Dogri',
  en: 'English',
  gu: 'Gujarati',
  hi: 'Hindi',
  kn: 'Kannada',
  ks: 'Kashmiri',
  kok: 'Konkani',
  mai: 'Maithili',
  ml: 'Malayalam',
  mni: 'Manipuri',
  mr: 'Marathi',
  ne: 'Nepali',
  or: 'Odia',
  pa: 'Punjabi',
  sa: 'Sanskrit',
  sat: 'Santali',
  sd: 'Sindhi',
  ta: 'Tamil',
  te: 'Telugu',
  ur: 'Urdu'
};

export function getLanguageName(locale: unknown): string {
  if (typeof locale !== 'string') return 'English';
  return LANGUAGE_NAMES[locale.trim().toLowerCase().split(/[-_]/)[0]] ?? 'English';
}

function parseAction(value: unknown): AssistantAppAction | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const action = value as Record<string, unknown>;

  if (action.type === 'search' && typeof action.query === 'string') {
    const query = action.query.trim();
    return query.length > 0 && query.length <= 120 ? { type: 'search', query } : undefined;
  }
  if (action.type === 'filter' && typeof action.category === 'string' && FILTER_CATEGORIES.has(action.category)) {
    return { type: 'filter', category: action.category as Extract<AssistantAppAction, { type: 'filter' }>['category'] };
  }
  if (action.type === 'navigate' && typeof action.tab === 'string' && NAVIGATION_TABS.has(action.tab)) {
    return { type: 'navigate', tab: action.tab as Extract<AssistantAppAction, { type: 'navigate' }>['tab'] };
  }
  return undefined;
}

export function parseAssistantOutput(raw: string): { reply: string; action?: AssistantAppAction } {
  const trimmed = raw.trim();
  const jsonText = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    const parsed: unknown = JSON.parse(jsonText);
    if (parsed && typeof parsed === 'object') {
      const data = parsed as Record<string, unknown>;
      if (typeof data.reply === 'string' && data.reply.trim()) {
        const action = parseAction(data.action);
        return action ? { reply: data.reply.trim(), action } : { reply: data.reply.trim() };
      }
    }
  } catch {
    // Providers may return plain text despite the structured-output instruction.
  }
  return { reply: trimmed };
}
