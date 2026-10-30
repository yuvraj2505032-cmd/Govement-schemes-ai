import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseSavedSchemeIds, parseTrackedItems } from './citizenCloudSync';

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
