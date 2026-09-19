// Hosted transcript provider (Supadata). Used when the app runs somewhere YouTube refuses to
// serve caption tracks — cloud/datacenter IP ranges are blocked, so a deployed instance cannot
// read them directly. Same contract as the library path: video id in, transcript text out.
import { config } from '../config.js';
import { NoCaptionsError, TranscriptError } from '../utils/errors.js';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(url) {
  let res;
  try {
    res = await fetch(url, { headers: { 'x-api-key': config.transcript.apiKey } });
  } catch (err) {
    console.error('[transcriptApi] request failed:', err && err.message);
    throw new TranscriptError();
  }

  // The provider answers 206 when it has no transcript for the video.
  if (res.status === 206) throw new NoCaptionsError();

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (body.error === 'transcript-unavailable') throw new NoCaptionsError();
    console.error('[transcriptApi] error:', res.status, body.error || '', body.message || '');
    throw new TranscriptError();
  }
  return body;
}

// Accepts either the plain-text response or the segmented one.
function toText(body) {
  const content = body && body.content;
  const raw = Array.isArray(content)
    ? content.map((s) => (s && s.text ? s.text : '')).join(' ')
    : String(content || '');
  const text = raw.replace(/\s+/g, ' ').trim();
  if (!text) throw new NoCaptionsError();
  return text;
}

// Long videos are processed asynchronously: the first call returns a job id to poll.
async function awaitJob(jobId) {
  const url = new URL(`${config.transcript.baseUrl}/transcript/${jobId}`);
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const body = await call(url);
    if (body.content) return toText(body);
    if (body.status === 'failed' || body.error) throw new TranscriptError();
  }
  console.error('[transcriptApi] job timed out:', jobId);
  throw new TranscriptError();
}

export async function fetchTranscriptFromApi(videoId) {
  const url = new URL(`${config.transcript.baseUrl}/transcript`);
  url.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
  url.searchParams.set('text', 'true');
  // native = use the video's existing captions only. Generated transcripts are billed per
  // minute, so this keeps one summary to one credit and matches the app's "captions only" rule.
  url.searchParams.set('mode', 'native');

  const body = await call(url);
  return body.jobId ? awaitJob(body.jobId) : toText(body);
}
