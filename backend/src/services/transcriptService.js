// Fetches a video's transcript. Two interchangeable sources, chosen by configuration:
//
//   library (default) — reads YouTube's caption track directly. Free, but only works from a
//                       residential connection; YouTube blocks datacenter IP ranges.
//   api               — a hosted transcript provider, for deployments on cloud hosts.
//
// This is the ONLY file that knows where transcripts come from; nothing above it changes.
import { YoutubeTranscript } from 'youtube-transcript';
import { config } from '../config.js';
import { fetchTranscriptFromApi } from '../clients/transcriptApiClient.js';
import { NoCaptionsError, TranscriptError } from '../utils/errors.js';

export async function fetchTranscript(videoId) {
  if (config.transcript.provider === 'api') return fetchTranscriptFromApi(videoId);
  return fetchTranscriptFromYouTube(videoId);
}

async function fetchTranscriptFromYouTube(videoId) {
  let items;
  try {
    items = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (err) {
    const msg = String((err && err.message) || '').toLowerCase();
    // Genuine "this video has no captions" cases.
    if (
      msg.includes('disabled') ||
      msg.includes('not available') ||
      msg.includes('no transcript') ||
      msg.includes('captions')
    ) {
      // NOTE: the library can't always tell a real "no captions" from an IP block
      // (YouTube blocks datacenter/cloud IPs). On a normal/home connection this is
      // almost always a genuine no-captions case; on a server, set TRANSCRIPT_PROVIDER=api.
      throw new NoCaptionsError();
    }
    console.error('[transcript] fetch failed:', err && err.message);
    throw new TranscriptError();
  }

  if (!Array.isArray(items) || items.length === 0) throw new NoCaptionsError();

  const text = items
    .map((i) => (i && i.text ? i.text : ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) throw new NoCaptionsError();
  return text;
}
