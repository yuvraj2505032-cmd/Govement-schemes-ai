import { ApplicationTrackerItem, Category, CitizenProfile, Gender, Occupation } from '../types/scheme';
import { Json, supabase } from './supabase';

const TRACKER_STATUSES = new Set<ApplicationTrackerItem['status']>([
  'Discovered',
  'Documents Assembled',
  'Form Submitted',
  'Approved',
  'Disbursed'
]);
const PROFILE_GENDERS = new Set<Gender>(['All', 'Male', 'Female', 'Transgender']);
const PROFILE_CATEGORIES = new Set<Category>(['General', 'SC', 'ST', 'OBC/BC', 'EWS']);
const PROFILE_OCCUPATIONS = new Set<Occupation>([
  'Farmer',
  'Agricultural Labourer',
  'Student',
  'Unemployed Youth',
  'Artisan/Craftsperson',
  'Self-Employed/Shopkeeper',
  'Daily Wage Worker',
  'Homemaker',
  'Senior Citizen',
  'Private Employee',
  'Government Employee'
]);

function isProfileGender(value: unknown): value is Gender {
  return typeof value === 'string' && PROFILE_GENDERS.has(value as Gender);
}

function isProfileCategory(value: unknown): value is Category {
  return typeof value === 'string' && PROFILE_CATEGORIES.has(value as Category);
}

function isProfileOccupation(value: unknown): value is Occupation {
  return typeof value === 'string' && PROFILE_OCCUPATIONS.has(value as Occupation);
}

export function parseCitizenProfile(value: unknown): CitizenProfile {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Citizen profile in Supabase has an invalid format.');
  }
  const profile = value as Record<string, unknown>;
  if (
    (profile.username !== undefined && typeof profile.username !== 'string') ||
    typeof profile.age !== 'number' ||
    !Number.isFinite(profile.age) ||
    !isProfileGender(profile.gender) ||
    !isProfileOccupation(profile.occupation) ||
    typeof profile.annualIncome !== 'number' ||
    !Number.isFinite(profile.annualIncome) ||
    !isProfileCategory(profile.category) ||
    typeof profile.district !== 'string' ||
    typeof profile.isPunjabDomicile !== 'boolean' ||
    typeof profile.landholdingAcres !== 'number' ||
    !Number.isFinite(profile.landholdingAcres) ||
    typeof profile.hasDisability !== 'boolean' ||
    typeof profile.isWidowOrDestitute !== 'boolean' ||
    typeof profile.isEnrolledInSchoolOrCollege !== 'boolean'
  ) {
    throw new Error('Citizen profile in Supabase has invalid fields.');
  }
  return {
    username: typeof profile.username === 'string' ? profile.username : '',
    age: profile.age,
    gender: profile.gender,
    occupation: profile.occupation,
    annualIncome: profile.annualIncome,
    category: profile.category,
    district: profile.district,
    isPunjabDomicile: profile.isPunjabDomicile,
    landholdingAcres: profile.landholdingAcres,
    hasDisability: profile.hasDisability,
    isWidowOrDestitute: profile.isWidowOrDestitute,
    isEnrolledInSchoolOrCollege: profile.isEnrolledInSchoolOrCollege
  };
}

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
    .select('saved_scheme_ids, tracked_items, profile')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`Could not load cloud data: ${error.message}`);
  if (!data) return { savedSchemeIds: new Set<string>(), trackedItems: [], profile: null, hasCloudRecord: false };

  return {
    savedSchemeIds: parseSavedSchemeIds(data.saved_scheme_ids),
    trackedItems: parseTrackedItems(data.tracked_items),
    profile: data.profile === null ? null : parseCitizenProfile(data.profile),
    hasCloudRecord: true
  };
}

export async function saveCitizenCloudData(
  userId: string,
  savedSchemeIds: Set<string>,
  trackedItems: ApplicationTrackerItem[],
  profile: CitizenProfile
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
    profile: {
      username: profile.username,
      age: profile.age,
      gender: profile.gender,
      occupation: profile.occupation,
      annualIncome: profile.annualIncome,
      category: profile.category,
      district: profile.district,
      isPunjabDomicile: profile.isPunjabDomicile,
      landholdingAcres: profile.landholdingAcres,
      hasDisability: profile.hasDisability,
      isWidowOrDestitute: profile.isWidowOrDestitute,
      isEnrolledInSchoolOrCollege: profile.isEnrolledInSchoolOrCollege
    },
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  if (error) throw new Error(`Could not sync cloud data: ${error.message}`);
}
