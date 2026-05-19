import { KNOWLEDGE_BASE_URL } from 'astro:env/client';

const ENDPOINT = `${KNOWLEDGE_BASE_URL}/ask`;

export type AskMessage = { role: 'user' | 'assistant'; content: string };

export type AskChunk = {
  answer?: string;
  reasoning?: string;
};

export async function* streamAskAi(
  messages: AskMessage[],
  signal?: AbortSignal,
): AsyncGenerator<AskChunk> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`Ask AI request failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let currentEvent = 'message';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    let answer = '';
    let reasoning = '';
    for (const line of lines) {
      if (line === '') {
        currentEvent = 'message';
        continue;
      }
      if (line.startsWith('event:')) {
        currentEvent = line.slice(6).trim();
        continue;
      }
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const obj = JSON.parse(data);
        if (currentEvent === 'reasoning' && typeof obj.reasoning === 'string') {
          reasoning += obj.reasoning;
        } else if (typeof obj.response === 'string') {
          answer += obj.response;
        }
      } catch {}
    }
    if (answer || reasoning) {
      yield { answer: answer || undefined, reasoning: reasoning || undefined };
    }
  }
}
