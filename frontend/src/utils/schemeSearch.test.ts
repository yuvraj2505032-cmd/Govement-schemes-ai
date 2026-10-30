import assert from 'node:assert/strict';
import test from 'node:test';
import { GOV_SCHEMES } from '../data/schemes';
import { matchesSchemeSearch } from './schemeSearch';

test('scheme search matches Punjabi, Hindi, and English scheme names', () => {
  const pmKisan = GOV_SCHEMES.find(scheme => scheme.id === 'pm-kisan');
  const pension = GOV_SCHEMES.find(scheme => scheme.id === 'punjab-old-age-pension');
  const ashirwad = GOV_SCHEMES.find(scheme => scheme.id === 'punjab-ashirwad');
  assert.ok(pmKisan);
  assert.ok(pension);
  assert.ok(ashirwad);
  assert.equal(matchesSchemeSearch(pmKisan, pmKisan.titlePa), true);
  assert.equal(matchesSchemeSearch(pmKisan, pmKisan.titleHi), true);
  assert.equal(matchesSchemeSearch(pmKisan, 'PM-Kisan Samman'), true);
  assert.equal(matchesSchemeSearch(pmKisan, 'ਕਿਸਾਨ'), true);
  assert.equal(matchesSchemeSearch(pmKisan, 'farmer'), true);
  assert.equal(matchesSchemeSearch(ashirwad, ashirwad.titlePa), true);
  assert.equal(matchesSchemeSearch(ashirwad, ashirwad.titleHi), true);
  assert.equal(matchesSchemeSearch(ashirwad, 'shagun'), true);
  assert.equal(matchesSchemeSearch(pension, 'pension'), true);
  assert.equal(matchesSchemeSearch(pension, 'वृद्धावस्था पेंशन'), true);
  assert.equal(matchesSchemeSearch(pmKisan, 'kisn'), true);
  assert.equal(matchesSchemeSearch(pension, 'not a scheme keyword'), false);
});
