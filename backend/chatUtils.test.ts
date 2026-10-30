import assert from 'node:assert/strict';
import test from 'node:test';
import { getLanguageName, parseAssistantOutput } from './chatUtils.js';

test('language locales resolve to names for model instructions', () => {
  assert.equal(getLanguageName('pa-IN'), 'Punjabi');
  assert.equal(getLanguageName('ta-IN'), 'Tamil');
  assert.equal(getLanguageName('unknown'), 'English');
});

test('assistant output parses structured replies and allows only safe app actions', () => {
  assert.deepEqual(
    parseAssistantOutput('```json\n{"reply":"Opening saved schemes","action":{"type":"navigate","tab":"saved"}}\n```'),
    { reply: 'Opening saved schemes', action: { type: 'navigate', tab: 'saved' } }
  );
  assert.deepEqual(
    parseAssistantOutput('{"reply":"Done","action":{"type":"navigate","tab":"admin"}}'),
    { reply: 'Done' }
  );
  assert.deepEqual(
    parseAssistantOutput(`{"reply":"Searching","action":{"type":"search","query":"${'x'.repeat(121)}"}}`),
    { reply: 'Searching' }
  );
});

test('assistant output preserves providers that return plain text', () => {
  assert.deepEqual(parseAssistantOutput('Plain answer'), { reply: 'Plain answer' });
});
