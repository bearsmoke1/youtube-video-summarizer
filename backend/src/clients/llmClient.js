// DeepSeek wrapper (OpenAI-compatible API). Only file that talks to the LLM.
import OpenAI from 'openai';
import { config } from '../config.js';
import { LLMError } from '../utils/errors.js';

let client = null;
function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: config.deepseek.apiKey,
      baseURL: config.deepseek.baseURL,
    });
  }
  return client;
}

export async function complete(prompt) {
  // Offline dev: return a canned summary without calling DeepSeek.
  if (config.mock) {
    return [
      '• (MOCK MODE) This is a placeholder summary generated without calling DeepSeek.',
      '• The full request pipeline — URL parse, transcript, prompt build — ran normally.',
      '• Set MOCK=false in .env (with a valid key) to get real AI summaries.',
    ].join('\n');
  }

  try {
    const res = await getClient().chat.completions.create({
      model: config.deepseek.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes YouTube video transcripts ' +
            'accurately and concisely. Never invent facts not present in the transcript.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    });
    const text = res.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('empty completion from LLM');
    return text;
  } catch (err) {
    console.error('[llmClient] DeepSeek error:', err && err.message);
    throw new LLMError();
  }
}
