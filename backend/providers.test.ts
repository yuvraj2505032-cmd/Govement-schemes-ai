import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { generateGroqText, searchOfficialSources } from './providers.js';

const originalGroqKey = process.env.GROQ_API_KEY;
const originalTavilyKey = process.env.TAVILY_API_KEY;
const originalGroqModel = process.env.GROQ_MODEL;
const originalFetch = globalThis.fetch;

afterEach(() => {
  if (originalGroqKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalGroqKey;
  if (originalTavilyKey === undefined) delete process.env.TAVILY_API_KEY;
  else process.env.TAVILY_API_KEY = originalTavilyKey;
  if (originalGroqModel === undefined) delete process.env.GROQ_MODEL;
  else process.env.GROQ_MODEL = originalGroqModel;
  globalThis.fetch = originalFetch;
});

test('Groq generation uses the configured model and returns assistant text', async () => {
  process.env.GROQ_API_KEY = 'test-groq-key';
  process.env.GROQ_MODEL = 'test-model';
  globalThis.fetch = async (input, init) => {
    assert.equal(input, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(init?.headers && (init.headers as Record<string, string>).Authorization, 'Bearer test-groq-key');
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, 'test-model');
    return new Response(JSON.stringify({ choices: [{ message: { content: '  Official scheme guidance  ' } }] }), {
      status: 200
    });
  };

  assert.equal(await generateGroqText('system', 'question'), 'Official scheme guidance');
});

test('Tavily returns only HTTPS government and NIC sources', async () => {
  process.env.TAVILY_API_KEY = 'test-tavily-key';
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.api_key, 'test-tavily-key');
    assert.deepEqual(body.include_domains, ['gov.in', 'nic.in']);
    return new Response(JSON.stringify({
      results: [
        { title: 'Government source', url: 'https://schemes.gov.in/info', content: 'Verified details' },
        { title: 'NIC source', url: 'https://portal.nic.in/info', content: 'Official details' },
        { title: 'Unverified source', url: 'https://example.com/info', content: 'Ignore this' },
        { title: 'Insecure source', url: 'http://portal.gov.in/info', content: 'Ignore this too' }
      ]
    }), { status: 200 });
  };

  assert.deepEqual(await searchOfficialSources('scheme'), [
    { title: 'Government source', url: 'https://schemes.gov.in/info', content: 'Verified details' },
    { title: 'NIC source', url: 'https://portal.nic.in/info', content: 'Official details' }
  ]);
});

test('unconfigured providers do not make network requests', async () => {
  delete process.env.GROQ_API_KEY;
  delete process.env.TAVILY_API_KEY;
  globalThis.fetch = async () => {
    assert.fail('fetch should not be called without configured credentials');
  };

  assert.equal(await generateGroqText('system', 'question'), null);
  assert.deepEqual(await searchOfficialSources('scheme'), []);
});
