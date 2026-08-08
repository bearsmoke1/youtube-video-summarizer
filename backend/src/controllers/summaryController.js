// Orchestrates the request: validate → transcript → summarize. Maps errors to responses.
import { extractVideoId } from '../utils/youtubeUtil.js';
import { fetchTranscript } from '../services/transcriptService.js';
import { generateSummary } from '../services/summarizerService.js';
import { AppError, ValidationError } from '../utils/errors.js';

export async function handleSummarize(req, res) {
  try {
    const { url, type } = req.body || {};
    const summaryType = type === 'detailed' ? 'detailed' : 'short';

    const videoId = extractVideoId(url);
    if (!videoId) throw new ValidationError();

    const transcript = await fetchTranscript(videoId);
    const summary = await generateSummary(transcript, summaryType);

    res.json({ summary, type: summaryType, videoId });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('[summarize] unexpected error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
