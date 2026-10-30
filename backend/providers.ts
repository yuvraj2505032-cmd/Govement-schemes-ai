import { env } from 'node:process';

export interface OfficialSearchSource {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
  }>;
}

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
}

const isConfigured = (value: string | undefined, placeholder: string) =>
  Boolean(value && value !== placeholder);

export async function searchOfficialSources(query: string): Promise<OfficialSearchSource[]> {
  const apiKey = env.TAVILY_API_KEY;
  if (!isConfigured(apiKey, 'your-tavily-api-key')) return [];

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${query} official government scheme India`,
      search_depth: 'basic',
      max_results: 5,
      include_domains: ['gov.in', 'nic.in']
    })
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed with status ${response.status}`);
  }

  const data = (await response.json()) as TavilyResponse;
  if (!Array.isArray(data.results)) {
    throw new Error('Tavily returned an invalid search response');
  }

  return data.results.flatMap((result) => {
    if (!result.title || !result.url || !result.content) return [];

    try {
      const url = new URL(result.url);
      const isOfficialDomain =
        url.protocol === 'https:' &&
        (url.hostname === 'gov.in' ||
          url.hostname.endsWith('.gov.in') ||
          url.hostname === 'nic.in' ||
          url.hostname.endsWith('.nic.in'));
      return isOfficialDomain
        ? [{ title: result.title, url: url.toString(), content: result.content }]
        : [];
    } catch {
      return [];
    }
  });
}

export async function generateGroqText(systemPrompt: string, prompt: string): Promise<string | null> {
  const apiKey = env.GROQ_API_KEY;
  if (!isConfigured(apiKey, 'your-groq-api-key')) return null;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL || 'llama-3.3-70b-versatile',
     messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`Groq generation failed with status ${response.status}`);
  }

  const data = (await response.json()) as GroqResponse;
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Groq returned an empty or invalid response');
  }
  return content.trim();
}
