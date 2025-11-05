import { BASE64_SPAM_DETECTOR_PROMPT, OPENAI_API_KEY } from 'astro:env/server';
import OpenAI from 'openai';
import logToRollbar from './logToRollbar';

type SpamResult = {
  is_spam: 'yes' | 'no' | 'manual_review';
  spam_score: number; // 0..1
  reasons: string[];
  notes?: string;
};

const spamJsonSchema = {
  type: 'object',
  properties: {
    is_spam: { enum: ['yes', 'no', 'manual_review'] },
    spam_score: { type: 'number', minimum: 0, maximum: 1 },
    reasons: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string', minLength: 5 },
  },
  required: ['is_spam', 'spam_score', 'reasons', 'notes'],
  additionalProperties: false,
};

function isSpamResult(obj: any): obj is SpamResult {
  if (!obj || typeof obj !== 'object') return false;
  if (!['yes', 'no', 'manual_review'].includes(obj.is_spam)) return false;
  if (typeof obj.spam_score !== 'number' || obj.spam_score < 0 || obj.spam_score > 1) return false;
  if (!Array.isArray(obj.reasons) || !obj.reasons.every((r: any) => typeof r === 'string'))
    return false;
  if (obj.notes !== undefined && typeof obj.notes !== 'string') return false;
  return true;
}

type Input = Record<string, string | null | undefined | File | File[]>;

function serializeInput(data: Input, fieldsToIgnore: Array<keyof Input>, maxLen = 10_000): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (fieldsToIgnore.includes(key) || value === null || value === undefined) continue;

    // Skip file values
    if (value instanceof File) continue;

    // Skip arrays of files
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (value[0] instanceof File) continue;

      lines.push(`${key}: ${value.join(', ')}`);
      continue;
    }

    lines.push(`${key}: ${value}`);
  }

  // join then truncate to maxLen to limit prompt injection surface/size
  const joined = lines.join('\n');
  return joined.length > maxLen ? joined.slice(0, maxLen) : joined;
}

export async function isSpam(input: Input, fieldsToIgnore: Array<keyof Input>): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey: OPENAI_API_KEY });

    const system = Buffer.from(BASE64_SPAM_DETECTOR_PROMPT, 'base64').toString('utf8');
    const user = `INPUT_BEGIN\n${serializeInput(input, fieldsToIgnore, 8000)}\nINPUT_END\n(END OF DATA)`;

    console.log(JSON.stringify({ system, user }, null, 2));

    const res = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: user,
        },
      ],
      temperature: 0,
      text: {
        format: {
          type: 'json_schema',
          name: 'SpamDetectionSchema',
          schema: spamJsonSchema,
          strict: true,
        },
      },
      max_output_tokens: 300,
    });

    if (!res.output_text) {
      throw new Error('Missing res.output_text');
    }

    const result = JSON.parse(res.output_text);

    if (!isSpamResult(result)) {
      throw new Error('Response is not valid spam result');
    }

    console.log(JSON.stringify(result, null, 2));

    if (result.is_spam === 'yes') {
      logToRollbar({ result }, { context: { action: 'isSpam', input, fieldsToIgnore } });
    }

    return result.is_spam === 'yes';
  } catch (err) {
    logToRollbar(err, { context: { action: 'isSpam', input, fieldsToIgnore } });

    return false;
  }
}
