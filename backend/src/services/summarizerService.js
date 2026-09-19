// Builds the short/detailed prompt and asks the LLM for a summary.
import { config } from '../config.js';
import { complete } from '../clients/llmClient.js';

function buildPrompt(transcript, type) {
  if (type === 'detailed') {
    return (
      'Write a detailed, well-structured summary of the following YouTube video ' +
      'transcript. Begin with a short overview paragraph, then cover the main sections ' +
      'with brief explanations. Be faithful to the transcript and do not invent facts.\n\n' +
      `Transcript:\n${transcript}`
    );
  }
  // short (default)
  return (
    'Summarize the following YouTube video transcript into 5-7 concise bullet points ' +
    'capturing the key ideas. Be faithful to the transcript and do not invent facts.\n\n' +
    `Transcript:\n${transcript}`
  );
}

export async function generateSummary(transcript, type) {
  // Truncate to keep each request inside a predictable cost and context budget.
  const clipped = transcript.slice(0, config.transcriptCharLimit);
  const prompt = buildPrompt(clipped, type);
  return complete(prompt);
}
