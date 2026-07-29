// Fetches a video's transcript via the maintained `youtube-transcript` library.
// This is the ONLY file that knows the transcript library — swap it here if needed.
import { YoutubeTranscript } from 'youtube-transcript';
import { NoCaptionsError, TranscriptError } from '../utils/errors.js';

export async function fetchTranscript(videoId) {
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
      // almost always a genuine no-captions case.
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
