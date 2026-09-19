// Central config, read from environment (.env locally, injected by compose in Docker).
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Local runs: load the .env sitting at the project root (two levels up from backend/src/).
// In Docker there is no .env — compose injects the vars, so dotenv simply finds nothing.
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
  transcript: {
    // 'library' reads YouTube directly (works from a home connection); 'api' uses a hosted
    // provider (needed on cloud hosts, whose IPs YouTube blocks). Defaults to whichever the
    // environment can actually support: a key present means a deployment that needs the API.
    provider: (process.env.TRANSCRIPT_PROVIDER || (process.env.SUPADATA_API_KEY ? 'api' : 'library')).toLowerCase(),
    apiKey: process.env.SUPADATA_API_KEY || '',
    baseUrl: process.env.SUPADATA_BASE_URL || 'https://api.supadata.ai/v1',
  },
};

if (config.transcript.provider === 'api' && !config.transcript.apiKey) {
  console.warn(
    '[config] TRANSCRIPT_PROVIDER is "api" but SUPADATA_API_KEY is not set — ' +
      'transcript lookups will fail until a key is provided.'
  );
}

// Fail loud early (but don't crash) if we can't summarize and aren't mocking.
if (!config.mock && !config.deepseek.apiKey) {
  console.warn(
    '[config] DEEPSEEK_API_KEY is not set and MOCK is false — ' +
      'summaries will fail until a key is provided in .env.'
  );
}
