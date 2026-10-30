import assert from 'node:assert/strict';
import test from 'node:test';
import { GOV_SCHEMES } from '../data/schemes';
import { matchesSchemeSearch } from './schemeSearch';

test('scheme search supports translated names and topic aliases', () => {
  const pmKisan = GOV_SCHEMES.find(scheme => scheme.id === 'pm-kisan');
  const pension = GOV_SCHEMES.find(scheme => scheme.id === 'punjab-old-age-pension');
  assert.ok(pmKisan);
  assert.ok(pension);
  assert.equal(matchesSchemeSearch(pmKisan, 'ਕਿਸਾਨ'), true);
  assert.equal(matchesSchemeSearch(pmKisan, 'farmer'), true);
  assert.equal(matchesSchemeSearch(pension, 'pension'), true);
  assert.equal(matchesSchemeSearch(pension, 'not a scheme keyword'), false);
});
