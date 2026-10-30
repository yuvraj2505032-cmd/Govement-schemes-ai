import { ApplicationTrackerItem } from '../types/scheme';
import { Json, supabase } from './supabase';

const TRACKER_STATUSES = new Set<ApplicationTrackerItem['status']>([
  'Discovered',
  'Documents Assembled',
  'Form Submitted',
  'Approved',
  'Disbursed'
]);

function isTrackerStatus(value: unknown): value is ApplicationTrackerItem['status'] {
  return typeof value === 'string' && TRACKER_STATUSES.has(value as ApplicationTrackerItem['status']);
}

export function parseSavedSchemeIds(value: unknown): Set<string> {
  if (!Array.isArray(value) || !value.every((item): item is string => typeof item === 'string')) {
    throw new Error('Saved schemes in Supabase have an invalid format.');
  }
  return new Set(value);
}

export function parseTrackedItems(value: unknown): ApplicationTrackerItem[] {
  if (!Array.isArray(value)) {
    throw new Error('Application tracker data in Supabase has an invalid format.');
  }

  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object') {
      throw new Error('An application tracker item in Supabase is invalid.');
    }

    const candidate = item as Record<string, unknown>;
    if (
      typeof candidate.id !== 'string' ||
      typeof candidate.schemeId !== 'string' ||
      typeof candidate.schemeTitle !== 'string' ||
      typeof candidate.dateStarted !== 'string' ||
      !isTrackerStatus(candidate.status) ||
      (candidate.applicationRefNumber !== undefined && typeof candidate.applicationRefNumber !== 'string') ||
      (candidate.notes !== undefined && typeof candidate.notes !== 'string')
    ) {
      throw new Error('An application tracker item in Supabase has invalid fields.');
    }

    return {
      id: candidate.id,
      schemeId: candidate.schemeId,
      schemeTitle: candidate.schemeTitle,
      dateStarted: candidate.dateStarted,
      status: candidate.status,
      ...(typeof candidate.applicationRefNumber === 'string'
        ? { applicationRefNumber: candidate.applicationRefNumber }
        : {}),
      ...(typeof candidate.notes === 'string' ? { notes: candidate.notes } : {})
    };
  });
}

export async function loadCitizenCloudData(userId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('citizen_app_data')
    .select('saved_scheme_ids, tracked_items')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`Could not load cloud data: ${error.message}`);
  if (!data) return { savedSchemeIds: new Set<string>(), trackedItems: [], hasCloudRecord: false };

  return {
    savedSchemeIds: parseSavedSchemeIds(data.saved_scheme_ids),
    trackedItems: parseTrackedItems(data.tracked_items),
    hasCloudRecord: true
  };
}

export async function saveCitizenCloudData(
  userId: string,
  savedSchemeIds: Set<string>,
  trackedItems: ApplicationTrackerItem[]
) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const cloudTrackedItems: Json[] = trackedItems.map((item) => {
    const row: { [key: string]: Json | undefined } = {
      id: item.id,
      schemeId: item.schemeId,
      schemeTitle: item.schemeTitle,
      dateStarted: item.dateStarted,
      status: item.status,
      applicationRefNumber: item.applicationRefNumber,
      notes: item.notes
    };
    return row;
  });

  const { error } = await supabase.from('citizen_app_data').upsert({
    user_id: userId,
    saved_scheme_ids: Array.from(savedSchemeIds),
    tracked_items: cloudTrackedItems,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  if (error) throw new Error(`Could not sync cloud data: ${error.message}`);
}
