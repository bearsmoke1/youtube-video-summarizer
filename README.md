# YouTube Video Summarizer

Paste a YouTube link, choose **Short** or **Detailed**, and get an AI-written summary of the
video in seconds. Copy it to the clipboard or download it as a `.txt` file.

No sign-up, no database — nothing is stored. Each request is handled and forgotten.

**Stack:** React 18 + Vite + Tailwind CSS · Node 20 + Express · DeepSeek (OpenAI-compatible API) · Docker

---

## How it works

```
Browser ──POST /api/summarize──▶ Express API
                                    │
                                    ├─▶ parse & validate the YouTube URL  →  video id
                                    ├─▶ fetch the video's caption track   →  transcript text
                                    ├─▶ build a short/detailed prompt     →  DeepSeek
                                    ◀─  markdown summary
Browser ◀────── { summary, type, videoId } ──────┘
```

The summary comes back as markdown and is rendered in the browser. There is no database and no
session state — the video is never downloaded, only its existing caption track is read.

---

## Requirements

- **Docker** and **Docker Compose** (the recommended path), or **Node.js 20+** to run it directly.
- A **DeepSeek API key** — <https://platform.deepseek.com>. The API is OpenAI-compatible, so any
  compatible endpoint works by changing `DEEPSEEK_BASE_URL`.
- No key handy? Set `MOCK=true` and the app runs end to end with a canned summary.

---

## Quick start (Docker)

```bash
git clone https://github.com/bearsmoke1/youtube-video-summarizer.git
cd youtube-video-summarizer

cp .env.example .env          # then open .env and set DEEPSEEK_API_KEY

docker compose up --build
```

Then open **<http://localhost:5173>**.

| Endpoint | URL |
|---|---|
| Web UI | <http://localhost:5173> |
| API health check | <http://localhost:4000/health> |

Stop it with `Ctrl+C`, or `docker compose down` from another terminal.

> If your user isn't in the `docker` group, prefix the commands with `sudo`.

## Run without Docker

Two terminals, from the repository root:

```bash
# terminal 1 — API on :4000
cd backend
npm install
npm run dev

# terminal 2 — web UI on :5173
cd frontend
npm install
npm run dev
```

The `.env` file at the repository root is read by the backend in both modes. The Vite dev server
proxies `/api` to the backend, so the browser only ever talks to one origin.

---

## Configuration

Everything lives in `.env` at the repository root (copy it from `.env.example`). The file is
git-ignored — the API key never reaches the browser or the repository.

| Variable | Default | Purpose |
|---|---|---|
| `DEEPSEEK_API_KEY` | — | API key. Required unless `MOCK=true`. |
| `DEEPSEEK_MODEL` | `deepseek-chat` | Model used for summarization. |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | Any OpenAI-compatible endpoint. |
| `PORT` | `4000` | Port the API listens on. |
| `MOCK` | `false` | `true` returns a placeholder summary without calling the API. |
| `TRANSCRIPT_CHAR_LIMIT` | `12000` | Transcript characters sent to the model; longer ones are truncated. |

---

## API

**`POST /api/summarize`**

```jsonc
// request
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID", "type": "short" }   // type: "short" | "detailed"

// 200 OK
{ "summary": "markdown text…", "type": "short", "videoId": "VIDEO_ID" }

// error
{ "error": "This video has no captions, so it can't be summarized." }
```

| Status | Meaning |
|---|---|
| `400` | The URL isn't a recognizable YouTube video link |
| `422` | The video has no caption track |
| `502` | Transcript service or the model provider failed |
| `500` | Unexpected error |

**`GET /health`** → `{ "status": "ok" }`

---

## Repository layout

```
├── docker-compose.yml       # runs both services together
├── .env.example             # copy to .env and add your key
├── backend/                 # Express API          → see backend/README.md
└── frontend/                # React + Vite web UI  → see frontend/README.md
```

Each folder has its own README describing how that side is put together.

---

## Supported link formats

`youtube.com/watch?v=…` · `youtu.be/…` · `youtube.com/embed/…` · `youtube.com/shorts/…` ·
`youtube.com/v/…` (also `m.youtube.com`)

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| *"This video has no captions…"* | The video genuinely has no caption track. Only videos with manual or auto-generated captions can be summarized. |
| Every video fails on a cloud server | YouTube blocks transcript requests from datacenter IP ranges (AWS, GCP, Azure and similar). This affects any transcript library. Run it from a normal home or office connection. |
| *"The summarizer is unavailable…"* | Missing, invalid, or out-of-credit API key. Check `DEEPSEEK_API_KEY`, or set `MOCK=true` to test the rest of the pipeline. |
| *"Cannot reach the server…"* | The backend isn't running, or port `4000` is occupied. |
| Port already in use | Change the host port in `docker-compose.yml`, or stop whatever holds `5173` / `4000`. |

---

## Notes and limits

- Only videos **with captions** can be summarized; the audio itself is never transcribed.
- Long transcripts are truncated to `TRANSCRIPT_CHAR_LIMIT` characters before summarizing.
- Summaries are model-generated and can occasionally be imperfect — verify anything important.
- The compose setup runs Vite's development server and is intended for local use, not production.
