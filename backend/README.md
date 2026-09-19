# Backend — Express API

A small Express service with one real job: turn a YouTube URL into a summary. It exposes two
endpoints and holds no state — no database, no sessions, no cache.

```
POST /api/summarize   { url, type }  →  { summary, type, videoId }
GET  /health                         →  { status: "ok" }
```

## Request lifecycle

Each request walks through four steps, and any step can stop it with a typed error:

```
url string
   │
   ▼  youtubeUtil.extractVideoId()        invalid → 400
video id
   │
   ▼  transcriptService.fetchTranscript() no captions → 422 · fetch failed → 502
transcript text
   │
   ▼  summarizerService.generateSummary() truncate, then build a short/detailed prompt
prompt
   │
   ▼  llmClient.complete()                provider error → 502
summary markdown
```

## Layers

The code is split so each file has one responsibility and one reason to change.

| Layer | File | Responsibility |
|---|---|---|
| Entry | `src/server.js` | Creates the Express app, enables CORS and JSON parsing, mounts `/health` and `/api`, listens. |
| Config | `src/config.js` | Reads `.env` into a single frozen-ish `config` object; warns at startup if no key is set and `MOCK` is off. |
| Route | `src/routes/summarize.js` | Maps `POST /summarize` to the controller. Nothing else. |
| Controller | `src/controllers/summaryController.js` | Orchestrates the four steps above and converts errors into HTTP responses. |
| Service | `src/services/transcriptService.js` | Fetches the caption track and flattens it into one clean string. |
| Service | `src/services/summarizerService.js` | Truncates the transcript and builds the short/detailed prompt. |
| Client | `src/clients/llmClient.js` | The only file that talks to the model provider. Also implements mock mode. |
| Utils | `src/utils/youtubeUtil.js` | Parses and validates every supported YouTube URL shape. |
| Utils | `src/utils/errors.js` | Typed error classes, each carrying its HTTP status and user-facing message. |

Two of these are deliberate isolation points:

- **`transcriptService.js`** is the only file that knows which transcript library is in use.
- **`llmClient.js`** is the only file that knows which model provider is in use. It speaks the
  OpenAI-compatible protocol, so switching providers is a base-URL and model-name change.

## Error model

`utils/errors.js` defines one base class, `AppError`, carrying a `statusCode` and a message
written for the end user. The controller catches `AppError` and returns that status and message
verbatim; anything else is logged server-side and becomes a generic `500`, so internal details
never reach the client.

| Error | Status | Raised when |
|---|---|---|
| `ValidationError` | 400 | The URL doesn't resolve to an 11-character video id |
| `NoCaptionsError` | 422 | No caption track, or the track is empty |
| `TranscriptError` | 502 | The transcript fetch failed for any other reason |
| `LLMError` | 502 | The model provider errored or returned an empty completion |

## Prompting

`summarizerService.js` holds both prompts. **Short** asks for 5–7 bullet points; **detailed**
asks for an overview paragraph followed by the main sections. Both instruct the model to stay
faithful to the transcript and invent nothing. The system message in `llmClient.js` repeats that
constraint, and `temperature` is kept low (`0.3`) to favour consistency over creativity.

Transcripts are truncated to `TRANSCRIPT_CHAR_LIMIT` characters before the prompt is built, which
keeps request size, latency, and cost predictable on long videos.

## Mock mode

With `MOCK=true`, `llmClient.complete()` returns a placeholder summary without any network call.
The rest of the pipeline — URL parsing, transcript fetch, prompt building — still runs, which
makes it useful for working on the frontend or testing error handling without spending credit.

## Local development

```bash
npm install
npm run dev     # node --watch, restarts on save
npm start       # plain node
```

Configuration is read from the `.env` file at the **repository root**, one level above this
folder. Under Docker there is no `.env` file inside the container — Compose injects the same
variables through `env_file`.

## Dependencies

`express` (HTTP) · `cors` · `dotenv` · `openai` (OpenAI-compatible client, pointed at DeepSeek) ·
`youtube-transcript` (caption fetching)

## Known limits

- Videos without captions cannot be summarized; audio is never transcribed.
- YouTube blocks transcript requests coming from datacenter IP ranges, so the service must run
  from a residential or office connection to be reliable.
- There is no rate limiting, authentication, or request timeout — it is built for local use.
