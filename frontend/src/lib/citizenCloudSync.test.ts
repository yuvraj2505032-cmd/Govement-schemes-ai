import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCitizenProfile, parseSavedSchemeIds, parseTrackedItems } from './citizenCloudSync';

const validProfile = {
  username: 'citizen42',
  age: 38,
  gender: 'Male',
  occupation: 'Farmer',
  annualIncome: 120000,
  category: 'SC',
  district: 'Ludhiana',
  isPunjabDomicile: true,
  landholdingAcres: 3,
  hasDisability: false,
  isWidowOrDestitute: false,
  isEnrolledInSchoolOrCollege: false
};

test('parses a saved citizen profile and rejects invalid profile data', () => {
  assert.deepEqual(parseCitizenProfile(validProfile), validProfile);
  const { username: _username, ...legacyProfile } = validProfile;
  assert.equal(parseCitizenProfile(legacyProfile).username, '');
  assert.throws(() => parseCitizenProfile({ ...validProfile, category: 'Unknown' }), /invalid fields/);
  assert.throws(() => parseCitizenProfile(null), /invalid format/);
});

test('parses saved scheme ids from cloud storage', () => {
  assert.deepEqual([...parseSavedSchemeIds(['pm-kisan', 'sehat'])], ['pm-kisan', 'sehat']);
  assert.throws(() => parseSavedSchemeIds(['pm-kisan', 42]), /invalid format/);
});

test('parses tracker rows and optional fields', () => {
  assert.deepEqual(parseTrackedItems([{
    id: 'item-1',
    schemeId: 'pm-kisan',
    schemeTitle: 'PM-Kisan',
    dateStarted: '2026-10-30',
    status: 'Form Submitted',
    applicationRefNumber: 'REF-123'
  }]), [{
    id: 'item-1',
    schemeId: 'pm-kisan',
    schemeTitle: 'PM-Kisan',
    dateStarted: '2026-10-30',
    status: 'Form Submitted',
    applicationRefNumber: 'REF-123'
  }]);

  assert.throws(() => parseTrackedItems([{ id: 'incomplete', status: 'Unknown' }]), /invalid fields/);
});
