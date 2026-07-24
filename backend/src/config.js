// Central config, read from environment (.env locally, injected by compose in Docker).
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load app/.env for local runs (this file is app/backend/src/config.js).
// In Docker the vars are injected by compose and this file simply won't exist — harmless.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  // MOCK=true returns a canned summary so the app works with no LLM call (offline dev).
  mock: String(process.env.MOCK).toLowerCase() === 'true',
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  },
  transcriptCharLimit: parseInt(process.env.TRANSCRIPT_CHAR_LIMIT || '12000', 10),
};

// Fail loud early (but don't crash) if we can't summarize and aren't mocking.
if (!config.mock && !config.deepseek.apiKey) {
  console.warn(
    '[config] DEEPSEEK_API_KEY is not set and MOCK is false — ' +
      'summaries will fail until a key is provided in .env.'
  );
}
